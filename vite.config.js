import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  appType: 'spa', // serves index.html for all routes — enables /en /fr /es paths
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/test/**', 'src/main.jsx', 'src/**/*.d.ts', 'src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      reporter: ['text', 'lcov'],
    },
  },
})
