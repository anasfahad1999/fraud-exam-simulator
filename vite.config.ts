import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

const enableObfuscation = process.env.ENABLE_OBFUSCATION === 'true'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    ...(enableObfuscation
      ? [
          obfuscatorPlugin({
            apply: 'build',
            include: ['**/*.{js,ts,jsx,tsx}'],
            options: {
              compact: true,
              controlFlowFlattening: false,
              deadCodeInjection: false,
              disableConsoleOutput: true,
              identifierNamesGenerator: 'mangled',
              renameGlobals: false,
              selfDefending: false,
              simplify: true,
              splitStrings: false,
              stringArray: true,
              stringArrayEncoding: ['base64'],
              stringArrayThreshold: 0.35,
              unicodeEscapeSequence: false,
            },
          }),
        ]
      : []),
  ],
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
      format: { comments: false },
    },
  },
})
