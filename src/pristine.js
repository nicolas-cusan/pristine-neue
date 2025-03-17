import { lang } from './lang';
import { tmpl, findAncestor, groupedElemCount } from './utils';

let defaultConfig = {
  classTo: 'field',
  errorClass: 'error',
  successClass: 'success',
  errorTextParent: 'field',
  errorTextTag: 'div',
  errorTextClass: 'error-msg',
  liveAfterFirstValitation: true,
};

const PRISTINE_ERROR = 'pristine-error';

const SELECTOR =
  'input:not([disabled]):not([type^=hidden]):not([type^=submit]):not([type^=button]):not([data-pristine-ignore]), select, textarea';

const ALLOWED_ATTRIBUTES = [
  'required',
  'min',
  'max',
  'minlength',
  'maxlength',
  'pattern',
];

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const MESSAGE_REGEX = /-message(?:-([a-z]{2}(?:_[A-Z]{2})?))?/; // matches, -message, -message-en, -message-en_US
let currentLocale = 'en';
const validators = {};

const _ = (name, validator) => {
  validator.name = name;
  if (validator.priority === undefined) validator.priority = 1;
  validators[name] = validator;
};

_('text', { fn: (val, el) => true, priority: 0 });
_('required', {
  fn: (val, el) => {
    return el.type === 'radio' || el.type === 'checkbox'
      ? groupedElemCount(el)
      : val !== undefined && val !== '';
  },
  priority: 99,
  halt: true,
});
_('email', { fn: (val, el) => !val || EMAIL_REGEX.test(val) });
_('number', { fn: (val, el) => !val || !isNaN(parseFloat(val)), priority: 2 });
_('integer', { fn: (val, el) => !val || /^\d+$/.test(val) });
_('minlength', {
  fn: (val, el, length) => !val || val.length >= parseInt(length),
});
_('maxlength', {
  fn: (val, el, length) => !val || val.length <= parseInt(length),
});
_('min', {
  fn: (val, el, limit) => {
    return (
      !val ||
      (el.type === 'checkbox'
        ? groupedElemCount(el) >= parseInt(limit)
        : parseFloat(val) >= parseFloat(limit))
    );
  },
});
_('max', {
  fn: (val, el, limit) => {
    return (
      !val ||
      (el.type === 'checkbox'
        ? groupedElemCount(el) <= parseInt(limit)
        : parseFloat(val) <= parseFloat(limit))
    );
  },
});
_('pattern', {
  fn: (val, el, pattern) => {
    if (!val) return true;

    // Check if pattern is already a regex pattern with slashes
    let m =
      typeof pattern === 'string'
        ? pattern.match(new RegExp('^/(.*?)/([gimy]*)$'))
        : null;

    if (m) {
      // It's a regex pattern with slashes, parse it
      return new RegExp(m[1], m[2]).test(val);
    } else {
      // It's a regular pattern string, use it directly
      return new RegExp(pattern).test(val);
    }
  },
});
_('equals', {
  fn: (val, el, otherFieldSelector) => {
    let other;

    // Handle both selector strings and direct element references
    if (
      typeof otherFieldSelector === 'string' &&
      otherFieldSelector.startsWith('#')
    ) {
      other = document.querySelector(otherFieldSelector);
    } else if (otherFieldSelector instanceof HTMLElement) {
      other = otherFieldSelector;
    }

    return other && ((!val && !other.value) || other.value === val);
  },
});

export default function Pristine(form, config, live = true) {
  const self = this;
  let wasValidated = false;

  init(form, config, live);

  function init(form, config, live) {
    form.setAttribute('novalidate', 'true');

    self.form = form;
    self.config = { ...defaultConfig, ...(config || {}) };
    self.live = !(live === false);

    self.fields = Array.from(form.querySelectorAll(SELECTOR)).map((input) => {
      const fns = [];
      const params = {};
      const messages = {};

      Array.from(input.attributes).forEach((attr) => {
        if (/^data-pristine-/.test(attr.name)) {
          let name = attr.name.substr(14);
          const messageMatch = name.match(MESSAGE_REGEX);
          if (messageMatch !== null) {
            const locale =
              messageMatch[1] === undefined ? 'en' : messageMatch[1];
            if (!messages.hasOwnProperty(locale)) messages[locale] = {};
            messages[locale][
              name.slice(0, name.length - messageMatch[0].length)
            ] = attr.value;
            return;
          }
          let attrValue = attr.value;
          if (name === 'type') {
            name = attrValue;
          }
          _addValidatorToField(fns, params, name, attrValue);
        } else if (ALLOWED_ATTRIBUTES.includes(attr.name)) {
          _addValidatorToField(fns, params, attr.name, attr.value);
        } else if (attr.name === 'type') {
          _addValidatorToField(fns, params, attr.value);
        }
      });

      fns.sort((a, b) => b.priority - a.priority);

      const listener = (e) => {
        if (self.config.liveAfterFirstValitation && wasValidated) {
          self.validate(e.target);
        } else if (!self.config.liveAfterFirstValitation) {
          self.validate(e.target);
        }
      };

      if (self.live) {
        input.addEventListener('change', listener);
        if (!['radio', 'checkbox'].includes(input.getAttribute('type'))) {
          input.addEventListener('input', listener);
        }
      }

      return (input.pristine = {
        input,
        validators: fns,
        params,
        messages,
        self,
      });
    });
  }

  function _addValidatorToField(fns, params, name, value) {
    let validator = validators[name];
    if (validator) {
      fns.push(validator);
      if (value) {
        let valueParams;

        // Case 1: Pattern - keep as is
        if (name === 'pattern') {
          valueParams = [value];
        }
        // Case 2: Check if it's valid JSON
        else if (value.trim().startsWith('{') || value.trim().startsWith('[')) {
          try {
            // Try to parse as JSON
            const jsonValue = JSON.parse(value);
            valueParams = Array.isArray(jsonValue) ? jsonValue : [jsonValue];
          } catch (e) {
            // If JSON parsing fails, fall back to regular string
            valueParams = value.split(',');
          }
        }
        // Case 3: Regular string (comma-separated values)
        else {
          valueParams = value.split(',');
        }

        valueParams.unshift(null); // placeholder for input's value
        params[name] = valueParams;
      }
    }
  }

  /***
   * Checks whether the form/input elements are valid
   * @param input => input element(s) or a jquery selector, null for full form validation
   * @param silent => do not show error messages, just return true/false
   * @returns {Promise<boolean>} returns a Promise that resolves to true when valid, false otherwise
   */
  self.validate = (input = null, silent = false) => {
    let fields = self.fields;
    if (input) {
      if (input instanceof HTMLElement) {
        fields = [input.pristine];
      } else if (
        input instanceof NodeList ||
        input instanceof (window.$ || Array) ||
        Array.isArray(input)
      ) {
        fields = Array.from(input).map((el) => el.pristine);
      }
    } else {
      wasValidated = true;
    }

    let valid = true;
    const promises = [];

    for (let i = 0; fields[i]; i++) {
      const field = fields[i];
      const result = self.validateField(field);

      // Check if validation returned a promise
      if (result instanceof Promise) {
        promises.push(
          result.then((isValid) => {
            if (isValid) {
              !silent && _showSuccess(field);
            } else {
              valid = false;
              !silent && _showError(field);
            }
            return isValid;
          })
        );
      } else if (result) {
        !silent && _showSuccess(field);
      } else {
        valid = false;
        !silent && _showError(field);
      }
    }

    // If we have async validators, wait for them to complete
    if (promises.length > 0) {
      return Promise.all(promises).then(() => valid);
    }

    // Otherwise return a resolved promise with the result
    return Promise.resolve(valid);
  };

  /***
   * Get errors of a specific field or the whole form
   * @param input
   * @returns {Array|*}
   */
  self.getErrors = function (input) {
    if (!input) {
      let erroneousFields = [];
      for (let i = 0; i < self.fields.length; i++) {
        let field = self.fields[i];
        if (field.errors.length) {
          erroneousFields.push({ input: field.input, errors: field.errors });
        }
      }
      return erroneousFields;
    }
    if (input.tagName && input.tagName.toLowerCase() === 'select') {
      return input.pristine.errors;
    }
    return input.length ? input[0].pristine.errors : input.pristine.errors;
  };

  /***
   * Validates a single field, all validator functions are called and error messages are generated
   * when a validator fails
   * @param field
   * @returns {boolean|Promise<boolean>} returns true/false for sync validation or a Promise for async validation
   * @private
   */
  self.validateField = function (field) {
    let errors = [];
    let valid = true;
    let promises = [];

    for (let i = 0; field.validators[i]; i++) {
      let validator = field.validators[i];
      let params = field.params[validator.name]
        ? field.params[validator.name]
        : [];
      params[0] = field.input.value;

      // Insert the element as the second parameter
      if (params.length > 1) {
        // Shift all parameters to make room for the element
        params.splice(1, 0, field.input);
      } else {
        params.push(field.input);
      }

      let result = validator.fn.apply(null, params);

      // Check if the validator returns a Promise
      if (result instanceof Promise) {
        // For async validators, add to promises array to handle later
        promises.push(
          result.then((isValid) => {
            if (!isValid) {
              valid = false;
              let error = _getErrorMessage(field, validator, params);
              errors.push(error);
            }
            return isValid;
          })
        );
      } else if (!result) {
        // For synchronous validators that fail
        valid = false;
        let error = _getErrorMessage(field, validator, params);
        errors.push(error);

        if (validator.halt === true) {
          break;
        }
      }
    }

    // If we have async validators
    if (promises.length > 0) {
      // Return a promise that resolves when all validations are complete
      return Promise.all(promises).then(() => {
        field.errors = errors;
        return valid && errors.length === 0;
      });
    }

    // For synchronous validation only
    field.errors = errors;
    return valid;
  };

  // Helper function to get error message
  function _getErrorMessage(field, validator, params) {
    if (typeof validator.msg === 'function') {
      return validator.msg(field.input.value, params);
    } else if (typeof validator.msg === 'string') {
      return tmpl(validator.msg, ...params);
    } else if (
      validator.msg === Object(validator.msg) &&
      validator.msg[currentLocale]
    ) {
      return tmpl(validator.msg[currentLocale], ...params);
    } else if (
      field.messages[currentLocale] &&
      field.messages[currentLocale][validator.name]
    ) {
      return tmpl(field.messages[currentLocale][validator.name], ...params);
    } else if (lang[currentLocale] && lang[currentLocale][validator.name]) {
      return tmpl(lang[currentLocale][validator.name], ...params);
    } else {
      return tmpl(lang[currentLocale].default, ...params);
    }
  }

  /***
   * Add a validator to a specific dom element in a form
   * @param elem => The dom element where the validator is applied to
   * @param fn => validator function
   * @param msg => message to show when validation fails. Supports templating. ${0} for the input's value, ${1} and
   * so on are for the attribute values
   * @param priority => priority of the validator function, higher valued function gets called first.
   * @param halt => whether validation should stop for this field after current validation function
   */
  self.addValidator = function (elem, fn, msg, priority, halt) {
    if (elem instanceof HTMLElement) {
      elem.pristine.validators.push({ fn, msg, priority, halt });
      elem.pristine.validators.sort((a, b) => b.priority - a.priority);
    } else {
      console.warn('The parameter elem must be a dom element');
    }
  };

  /***
   * An utility function that returns a 2-element array, first one is the element where error/success class is
   * applied. 2nd one is the element where error message is displayed. 2nd element is created if doesn't exist and cached.
   * @param field
   * @returns {*}
   * @private
   */
  function _getErrorElements(field) {
    if (field.errorElements) {
      return field.errorElements;
    }
    let errorClassElement = findAncestor(field.input, self.config.classTo);
    let errorTextParent = null,
      errorTextElement = null;
    if (self.config.classTo === self.config.errorTextParent) {
      errorTextParent = errorClassElement;
    } else {
      if (!errorClassElement) return [null, null];
      errorTextParent = errorClassElement.querySelector(
        '.' + self.config.errorTextParent
      );
    }
    if (errorTextParent) {
      errorTextElement = errorTextParent.querySelector('.' + PRISTINE_ERROR);
      if (!errorTextElement) {
        errorTextElement = document.createElement(self.config.errorTextTag);
        errorTextElement.className =
          PRISTINE_ERROR + ' ' + self.config.errorTextClass;
        errorTextParent.appendChild(errorTextElement);
        errorTextElement.pristineDisplay = errorTextElement.style.display;
      }
    }
    return (field.errorElements = [errorClassElement, errorTextElement]);
  }

  function _showError(field) {
    let errorElements = _getErrorElements(field);
    let errorClassElement = errorElements[0],
      errorTextElement = errorElements[1];

    if (errorClassElement) {
      errorClassElement.classList.remove(self.config.successClass);
      errorClassElement.classList.add(self.config.errorClass);
    }
    if (errorTextElement) {
      errorTextElement.innerHTML = field.errors.join('<br/>');
      errorTextElement.style.display = errorTextElement.pristineDisplay || '';
    }
  }

  /***
   * Adds error to a specific field
   * @param input
   * @param error
   */
  self.addError = function (input, error) {
    input = input.length ? input[0] : input;
    input.pristine.errors.push(error);
    _showError(input.pristine);
  };

  self.removeError = function (field) {
    let errorElements = _getErrorElements(field);
    let errorClassElement = errorElements[0],
      errorTextElement = errorElements[1];
    if (errorClassElement) {
      // IE > 9 doesn't support multiple class removal
      errorClassElement.classList.remove(self.config.errorClass);
      errorClassElement.classList.remove(self.config.successClass);
    }
    if (errorTextElement) {
      errorTextElement.innerHTML = '';
      errorTextElement.style.display = 'none';
    }
    return errorElements;
  };

  function _showSuccess(field) {
    let errorClassElement = self.removeError(field)[0];
    errorClassElement &&
      errorClassElement.classList.add(self.config.successClass);
  }

  /***
   * Resets the errors
   */
  self.reset = function () {
    for (let i = 0; self.fields[i]; i++) {
      self.fields[i].errorElements = null;
    }
    Array.from(self.form.querySelectorAll('.' + PRISTINE_ERROR)).map(function (
      elem
    ) {
      elem.parentNode.removeChild(elem);
    });
    Array.from(self.form.querySelectorAll('.' + self.config.classTo)).map(
      function (elem) {
        elem.classList.remove(self.config.successClass);
        elem.classList.remove(self.config.errorClass);
      }
    );
  };

  /***
   * Resets the errors and deletes all pristine fields
   */
  self.destroy = function () {
    self.reset();
    self.fields.forEach(function (field) {
      delete field.input.pristine;
    });
    self.fields = [];
  };

  self.setGlobalConfig = function (config) {
    defaultConfig = config;
  };

  return self;
}

/***
 *
 * @param name => Name of the global validator
 * @param fn => validator function
 * @param msg => message to show when validation fails. Supports templating. ${0} for the input's value, ${1} and
 * so on are for the attribute values
 * @param priority => priority of the validator function, higher valued function gets called first.
 * @param halt => whether validation should stop for this field after current validation function
 */
Pristine.addValidator = function (name, fn, msg, priority, halt) {
  _(name, { fn, msg, priority, halt });
};

Pristine.addMessages = function (locale, messages) {
  let langObj = lang.hasOwnProperty(locale)
    ? lang[locale]
    : (lang[locale] = {});

  Object.keys(messages).forEach(function (key, index) {
    langObj[key] = messages[key];
  });
};

Pristine.setLocale = function (locale) {
  currentLocale = locale;
};
