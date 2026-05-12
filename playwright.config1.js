// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { trace } from 'node:console';

/**
 * @see https://playwright.dev/docs/test-configuration
 */

const config = ({
  testDir: './tests',
  retries:1,
  timeout: 70 *1000,
  expect : {
    timeout: 8000,
  },
  reporter: 'html',
  projects :[
   {
    name : 'safari execution',
    use: {
    browserName: 'webkit',
    headless : true,
    screenshot : 'on',
    trace : 'retain-on-failure',
    }
  },
  {
    name : 'chrome execution',
    use: {
    browserName: 'chromium',
    headless : false,
    screenshot : 'on',
    video: 'retain-on-failure',
    ignoreHttpsErrors: true,
    Permissions: ['geolocation'],
    trace : 'retain-on-failure',
    //viewport: {width:720, height:720}
  }
   }   

  ]

  
 
});
module.exports = config;
