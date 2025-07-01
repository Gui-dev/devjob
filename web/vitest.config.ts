import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{ts,tsx}'], // Padrão para encontrar arquivos de teste
    exclude: ['node_modules', '.next'], // Excluir diretórios
    setupFiles: './test-config/setup.ts',
  },
})
