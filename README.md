# 🌌 Discretize.eu

Welcome to the source repository of the [discretize.eu](https://discretize.eu) website.

## Requirements

- yarn
- node 18 +
- git

## Installation

```
git clone git@github.com:gw2princeps/discretize.eu-rewrite.git
cd discretize.eu-rewrite
git submodule update --init --recursive
yarn install
```

## Development

The dev server is slow when working directly on the guides. That is because for every refresh it has to rebuild all the guides. To speed up the process, I recommend to work on the /docs pages, which are much smaller and load fast.

For example, there is `/docs/index.mdx` which is the component documentation page.
It is recommended to test smaller components on that page.

```
yarn dev
```

## Build

```
yarn build
yarn preview
```
