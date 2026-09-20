const { z } = require('zod')

const categories = ['Personal', 'Work', 'Idea', 'Journal']

const noteSchema = z.object({
    noteTitle: z.string().trim().min(1, 'Title is required').max(100, 'Title is too long'),
    noteCategory: z.enum(categories),
    noteContent: z.string().max(5000, 'Note is too long'),
})

module.exports = { noteSchema }
