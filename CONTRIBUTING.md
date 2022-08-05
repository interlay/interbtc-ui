# Contributing

**interBTC** is an open-source software project, providing a 1:1 Bitcoin-backed asset - fully collateralized, interoperable, and censorship-resistant.

## Rules

There are a few basic ground-rules for contributors (including the maintainer(s) of the project):

- **Master** must have the latest changes and its history must never be re-written.
- **Non-master branches** must be prefixed with the _type_ of ongoing work.
- **All modifications** must be made in a **pull-request** to solicit feedback from other contributors.
- **All commits** must be **signed**, have a clear commit message to better track changes, and must follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#summary) standard.
- **All tags** must follow [semantic versioning](https://semver.org/).

## Workflow

We use [Github Flow](https://guides.github.com/introduction/flow/index.html), so all code changes should happen through Pull Requests.

## Issues

We use GitHub issues to track feature requests and bugs.

### Bug Reports

Please provide as much detail as possible, see the GitHub templates if you are unsure.

## Coding Style

Our coding style is enforced by Prettier and ESLint. Please make sure these are enabled in your editor. If you are using VSCode you can add the following to `.vscode/settings.json` in the project root (you may need to create the directory):

```
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": ["source.formatDocument", "source.fixAll.eslint"]
}
```

## Releases

Declaring formal releases remains the prerogative of the project maintainer(s).

## License

By contributing, you agree that your contributions will be licensed under its Apache License 2.0.
