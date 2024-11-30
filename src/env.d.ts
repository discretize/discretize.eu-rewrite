/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Module declaration for frontmatter
declare module "frontmatter" {
  interface FrontmatterResult {
    data: Record<string, any>;
    content: string;
  }

  function frontmatter(input: string): FrontmatterResult;
  export default frontmatter;
}
