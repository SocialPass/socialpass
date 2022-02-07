# SocialPass Development
Monorepo setup with yarn workspaces and lerna. All projects are in the `packages` folder with the `@nfty` namespace.

The two core projects are `@nfty/sdk` and `@nfty/workbench`. `@nfty/sdk` is the core SocialPass SDK, whilst `@nfty/workbench` is a simple React application for development, testing and demonstration purposes, which imports the `@nfty/sdk` package locally.

# Documentation
https://www.notion.so/Frontend-SDK-842e20a5ca5a47198f133fae886a11c5

# Setup
`git clone ...`

`cd frontend/development`

`yarn install`

# Workbench
`yarn start:workbench`
