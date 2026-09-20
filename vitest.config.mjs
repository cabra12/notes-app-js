import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['tests/**/*.test.js'],
        env: {
            DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://charlotteabraham@localhost:5432/notes_test',
        },
    },
})
