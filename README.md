# 🌌 Discretize.eu

Welcome to the source repository of the [discretize.eu](https://discretize.eu) website. Due to Astro requiring direct access to the React source code, we submodule discretize-ui and other repositories into this repository.

## Requirements

- pnpm v8
- node 18 +
- git

## Installation

```
git clone git@github.com:gw2princeps/discretize.eu-rewrite.git
cd discretize.eu-rewrite
git submodule update --init --recursive
pnpm install
```

## Development

```
pnpm dev
```

Note: This command will execute extra scripts that are necessary to prepare the file system. Astro expects one .astro file per page that imports the md(x) file. For each build/guide/fractal, these scripts will create the necessary files.

Why not use dynamic imports? Astro has to reload all pages included in the dynamic set such that the dev server becomes unbearably slow.

## Build

```
pnpm build
pnpm preview
```
