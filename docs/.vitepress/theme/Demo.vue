<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Pristine from 'pristine-neue';

const props = defineProps({
  name: { type: String, required: true },
});

const markup = import.meta.glob('../../examples/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const setups = import.meta.glob('../../examples/*.js', {
  import: 'default',
  eager: true,
});

const html = markup[`../../examples/${props.name}.html`];
const setup = setups[`../../examples/${props.name}.js`];

if (html === undefined || setup === undefined) {
  throw new Error(`No example named "${props.name}" in docs/examples/`);
}

const root = ref(null);
const status = ref('idle');

let form;
let pristine;

async function onSubmit(event) {
  event.preventDefault();
  status.value = 'checking';
  status.value = (await pristine.validate()) ? 'valid' : 'invalid';
}

function onReset() {
  form.reset();
  pristine.reset();
  status.value = 'idle';
}

onMounted(() => {
  form = root.value.querySelector('form');
  pristine = setup(form);
  form.addEventListener('submit', onSubmit);
});

onBeforeUnmount(() => {
  form.removeEventListener('submit', onSubmit);
  pristine.destroy();
  // The language is global, so don't leave the next page in German
  Pristine.setLocale('en');
});
</script>

<template>
  <div class="demo">
    <div class="demo-header">Try it</div>
    <div ref="root" class="demo-body" v-html="html"></div>
    <div class="demo-footer">
      <p class="demo-status" :data-status="status" aria-live="polite">
        <template v-if="status === 'checking'">Checking…</template>
        <template v-else-if="status === 'valid'">Valid. The form would be submitted now.</template>
        <template v-else-if="status === 'invalid'">Not valid yet. Check the messages above.</template>
        <template v-else>Submit the form to check it.</template>
      </p>
      <button type="button" class="demo-reset" @click="onReset">Reset</button>
    </div>
  </div>
</template>
