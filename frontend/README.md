# Frontend
React monorepo setup with yarn workspaces and lerna. All projects are in the `packages` folder with the `@nfty` namespace.

Shared components reside in the `/shared` directory. Standalone projects reside in their own package directory.

Development & deployment is handled with a single `package.json` file at `/frontend/package.json`.

## Setup
`git clone ...`

`cd v3/frontend`

`yarn install`

## Moonclave
`yarn start:moonclave`

## SDK
TBD

Storybook (or similar package) might be useful here for standalone development.
