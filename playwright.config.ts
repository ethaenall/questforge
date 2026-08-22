import { existsSync } from 'node:fs'
import { platform } from 'node:os'
import { defineConfig, devices } from '@playwright/test'

/**
 * QuestForge Playwright config.
 *
 * The webServer serves the app on http://127.0.0.1:4173 with `vite preview`
 * (strict port — never silently reuses an unrelated listener).
 */

// Installed Google Chrome locations per platform.
const chromeExecutables =
  platform() === 'darwin'
    ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
    : platform() === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        ]
      : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable']

// One project: prefer channel 'chrome' when Chrome is installed, otherwise
// fall back to Playwright's own plain Chromium build.
const channelOverride = chromeExecutables.some((p) => existsSync(p))
  ? { channel: 'chrome' as const }
  : {}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [['list']],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    // NOTE(@playwright/test ^1.62): `url` and `port` are mutually exclusive in
    // webServer; `url` wins because it pins the exact 127.0.0.1 host.
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 60_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...channelOverride,
      },
    },
  ],
})
