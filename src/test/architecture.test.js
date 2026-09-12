import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Rule (see src/utils/analytics.js header comment): components must route GA4
// events through trackEvent() rather than calling window.gtag directly, so the
// consent no-op guard in trackEvent() cannot be bypassed. This test enforces
// that rule statically across the whole src/ tree.

const SRC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_EXT_RE = /\.(js|jsx|ts|tsx)$/
const TEST_FILE_RE = /\.(test|spec)\./

function collectSourceFiles(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath))
      continue
    }
    if (!SOURCE_EXT_RE.test(entry.name)) continue
    if (TEST_FILE_RE.test(entry.name)) continue
    files.push(fullPath)
  }
  return files
}

describe('gtag access rule', () => {
  it('no file outside src/utils/analytics.js calls window.gtag directly', () => {
    const analyticsFile = path.join(SRC_DIR, 'utils', 'analytics.js')
    const testDir = path.join(SRC_DIR, 'test')
    // hooks/useAnalytics.js is the sanctioned exception named in analytics.js's
    // own header comment: it only reads window.gtag as a truthiness check to
    // avoid double-injecting the GA4 script and to detect a revoked-consent
    // reload — it never calls window.gtag to fire an event, so it is not the
    // bypass this rule guards against.
    const useAnalyticsFile = path.join(SRC_DIR, 'hooks', 'useAnalytics.js')

    const candidates = collectSourceFiles(SRC_DIR).filter(
      (file) =>
        file !== analyticsFile &&
        file !== useAnalyticsFile &&
        !file.startsWith(testDir + path.sep),
    )

    const offenders = candidates.filter((file) =>
      fs.readFileSync(file, 'utf8').includes('window.gtag'),
    )

    expect(offenders, `Found direct window.gtag usage outside analytics.js:\n${offenders.join('\n')}`).toEqual([])
  })
})
