# pos-electron

## About the Project

`pos-electron` is a Point of Sale (POS) application built using Electron, designed to provide a seamless and efficient interface for managing sales transactions. It leverages modern web technologies to deliver a desktop application experience.

### Core Technologies

- **ElectronVite**: For building cross-platform desktop applications using web technologies.
- **React**: For building the user interface with reusable components.
- **TypeORM**: For database management and object-relational mapping.
- **SQLite**: For lightweight and efficient database storage, ideal for local data persistence.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Publishing

1. Update version in `package.json` to match the tag

2. Commit and push all changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

5. Run the GitHub Action workflow

6. Publish the release:
   - Go to GitHub Releases page
   - Find the draft release created by the GitHub Action
   - Review and publish the release

### Build

```bash
docker run --rm -ti \
 --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
 --env ELECTRON_CACHE="/root/.cache/electron" \
 --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
 --network="host" \
 -v ${PWD}:/project \
 -v ${PWD##*/}-node-modules:/project/node_modules \
 -v ~/.cache/electron:/root/.cache/electron \
 -v ~/.cache/electron-builder:/root/.cache/electron-builder \
 electronuserland/builder:wine
```
then 
`apt-get update`
`apt-get install -y build-essential pkg-config libudev-dev libusb-1.0-0-dev`
`npm install && npm run build:linux`
