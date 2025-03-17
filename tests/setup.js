import { expect, afterEach } from 'vitest';

// This file contains setup code that will run before each test

// Helper function to create a form fixture in the DOM
global.createFormFixture = (html) => {
  const fixture = document.createElement('div');
  fixture.id = 'fixture';
  fixture.innerHTML = html;
  document.body.appendChild(fixture);
  return fixture;
};

// Helper function to clean up the DOM after each test
global.cleanupFixture = () => {
  const fixture = document.getElementById('fixture');
  if (fixture) {
    document.body.removeChild(fixture);
  }
};

// Automatically clean up after each test
afterEach(() => {
  cleanupFixture();
});
