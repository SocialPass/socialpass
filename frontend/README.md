# SocialPass Development

`socialpass/tokengate` contains core SocialPass frontend, namely the `<TokenGate/>` component.

More documentation can be found in `packages/tokengate/README.md`

# Setup
`git clone ...`

`cd frontend`

`yarn install`

# SocialPass - Frontend
This folder is a monorepo setup with yarn workspaces and lerna. 

## TicketPortal
# Documentation
https://www.notion.so/Frontend-SDK-842e20a5ca5a47198f133fae886a11c5


## Storybook
`yarn storybook`

Note: If error on digital envelope routines, fix is below

unix:
`export NODE_OPTIONS=--openssl-legacy-provider`

windows:
`set NODE_OPTIONS=--openssl-legacy-provider`


# TSDX Information

> If you’re new to TypeScript and React, checkout [this handy cheatsheet](https://github.com/sw-yx/react-typescript-cheatsheet/)

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle analysis

Calculates the real cost of your library using [size-limit](https://github.com/ai/size-limit) with `npm run size` and visulize it with `npm run analyze`.

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [size-limit](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.


## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).
