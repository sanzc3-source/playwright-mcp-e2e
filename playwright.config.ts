import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  // Containerized runs share one machine with the app, so cap parallelism
  workers: process.env.CI ? 1 : process.env.BASE_URL ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters. HTML for local viewing, JUnit XML for Jenkins to parse test trends, list for live terminal output. */
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. Set by the Docker Compose
       setup (BASE_URL=http://sut:3000) when tests run fully containerized; falls back
       to localhost for local runs against the Docker-started app. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /*Records every test, but deletes the video automatically if the test passes. Keeps disk usage sane in CI while still catching failures on video. */
    video: 'retain-on-failure',

    /* RWA uses "data-test" attributes (not the Playwright default "data-testid"), so this tells getByTestId() to look for the right one everywhere in the suite. */
    testIdAttribute: 'data-test',

    /* Captures a screenshot only when a test fails, not on every pass.*/
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'api',
      /* Anchored to the api/ folder - a filename-only match would also catch tests/ui/bankAccounts.spec.ts */
      testMatch: /api\/(api-check|bankAccounts|transactions|users|notifications)\.spec\.ts/,
      dependencies: ['setup'],
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
      testIgnore: /api\/(api-check|bankAccounts|transactions|users|notifications)\.spec\.ts/,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
      testIgnore: /api\/(api-check|bankAccounts|transactions|users|notifications)\.spec\.ts/,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
      testIgnore: /api\/(api-check|bankAccounts|transactions|users|notifications)\.spec\.ts/,
    },
  ],

  /* Starts the Real World App via Docker before tests run, for local runs only.
     Skipped when BASE_URL is already set, since that means the app is being started
     separately by the containerized Docker Compose setup instead. */
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'docker compose -f ../cypress-realworld-app/docker-compose.yml up --build',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 180 * 1000,
      },
});