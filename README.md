# NFTY V3
Frontend & Backend for NFTY V3

## Backend



## Frontend
ReactJS monorepo setup with yarn workspaces and lerna. All projects are in the `packages` folder with the `@nfty` namespace. 

Shared components reside in the `/shared` directory. Standalone projects reside in their own package directory.

Development & deployment is handled with a single `package.json` file at `/frontend/package.json`.

### Setup
`git clone ...`

`cd v3/frontend`

`yarn`

### Moonclave
`yarn start:moonclave`

### Shared
TBD

Storybook (or similar package) might be useful here for standalone development.