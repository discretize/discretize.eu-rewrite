const fractalHeaders = import.meta.glob(
  `../../discretize-guides/fractals/**/images/header.jpg`,
  {
    import: "default",
  }
);

const guideHeaders = import.meta.glob(
  `../../discretize-guides/guides/**/images/header.jpg`,
  {
    import: "default",
  }
);

const mdxGuides = import.meta.glob(
  `../../discretize-guides/guides/**/index.mdx`,
  {
    import: "default",
  }
);

const mdxBuilds = import.meta.glob(
  `../../discretize-guides/builds/**/index.mdx`,
  {
    import: "default",
  }
);

export { fractalHeaders, guideHeaders, mdxGuides, mdxBuilds };
