# Getting started with ParaSpell CLI ⌨️

ParaSpell CLI scaffolds ready-to-run starter apps for [XCM SDK](/xcm-sdk/getting-started) and [XCM API](/xcm-api/getting-started), using a short wizard that creates the project and installs its dependencies for you based on your choices.

::: info
#### Prerequisites:
- Node.js 24 or newer
:::



## Quick start

**Choose your package manager:**

<PackageManagerSwitch />

<RunCommand pkg="paraspell-cli@latest" />

## Interactive mode

1. Choose XCM SDK or XCM API.
2. Choose React, Vue, or Node.js.
3. Pick a Polkadot client for the SDK: PAPI (recommended), Polkadot.js, or Dedot.
4. Choose the Swap, EVM, and Snowbridge extensions.
5. Name the project and choose a package manager.
6. Optionally configure a development wallet for Node.js.
7. Review the configuration before files are written.

::: info
Project creation and dependency installation report live progress. If installation fails, the generated project is kept and the CLI prints the command to finish it manually.
:::

## What to choose 🧰

| Choice | Options | Pick based on |
| --- | --- | --- |
| Tool | XCM SDK / XCM API | XCM SDK calls ParaSpell directly from your app. XCM API builds transfers via REST while you sign them locally, keeping XCM logic out of your app. |
| Extensions | EVM, Swap, Snowbridge | **EVM** for EVM-chain origins, **Swap** for cross-chain swaps (`@paraspell/swap`), **Snowbridge** for Ethereum ↔ Polkadot transfers. |
| Wallet secrets (Node.js only) | Configure / skip | Configure a development wallet (e.g. `//Alice`) so the generated server can sign and submit live transfers on `POST /`; skip it to wire up signing yourself. Secrets are entered via masked prompts and written to a gitignored `.env`. |

::: warning
Avoid typing secrets literally when passing them as flags in shared shells or CI logs: command-line values can be saved in shell history. Prefer the interactive prompt, or edit `.env` directly.
:::

## Getting help

<RunCommand pkg="paraspell-cli@latest" args="--help" />
<RunCommand pkg="paraspell-cli@latest" args="sdk --help" />
<RunCommand pkg="paraspell-cli@latest" args="api --help" />

::: info
These commands run the CLI once without installing it, so `paraspell-cli` alone won't work afterward. Install it globally (`npm i -g paraspell-cli`) to call `paraspell-cli --help` directly.
:::

Want to skip the prompts and generate a project in one command? See [command mode](/paraspell-cli/command-mode).
