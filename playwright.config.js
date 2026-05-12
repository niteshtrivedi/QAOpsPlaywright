// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { trace } from 'node:console';

/**
 * @see https://playwright.dev/docs/test-configuration
 */

const config = ({
  testDir: './tests',
  timeout: 70 *1000,
  expect : {
    timeout: 8000,
  },
  reporter: 'html',

  use: {
    browserName: 'chromium',
    headless : false,
    screenshot : 'on',
    trace : 'retain-on-failure',

  },
 
});
module.exports = config;
