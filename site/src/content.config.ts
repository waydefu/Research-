import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Astro 6 Content Layer; no copies and no modifications to source Markdown.
// The official glob loader accepts paths outside the project root.
const fromRepo = (base: string, pattern = '**/*.md') => defineCollection({
  loader: glob({
    base,
    pattern,
    generateId: ({ entry }) => entry.replace(/\.md$/i, '').replace(/\\/g, '/'),
  }),
});
export const collections = {
  research: fromRepo('../research'),
  governance: fromRepo('../docs/governance', '**/!(THREAT-MODEL).md'),
  design: fromRepo('../showcase/design')
};
