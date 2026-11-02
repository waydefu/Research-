import { defineConfig } from 'astro/config';
import remarkLinks from './src/lib/remark-links.mjs';
import rehypeTables from './src/lib/rehype-tables.mjs';

export default defineConfig({
  output: 'static',
  base: '/Research-/v3/',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkLinks],
    rehypePlugins: [rehypeTables],
    shikiConfig: { theme: 'github-dark' }
  }
});
