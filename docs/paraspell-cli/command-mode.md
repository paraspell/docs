# Command mode

Every wizard step is also available as a flag. Pass everything a command needs and the wizard is skipped entirely, or leave a value out and the CLI only prompts for that one, which is handy for templates, CI pipelines, or repeated scaffolding.

## Commands

```bash
paraspell-cli sdk [framework] [flags]
paraspell-cli api [framework] [flags]
```

`framework` can also be passed positionally instead of via `--framework`.

## Flags

| Flag | Values | Description |
| --- | --- | --- |
| `--name` | string | Project name |
| `--framework` | `react` \| `vue` \| `node` | Target framework (default `react`) |
| `--client` | `papi` \| `pjs` \| `dedot` | JS client, **`sdk` command only** (default `papi`) |
| `--extensions` | comma-separated list of `evm`, `swap`, `snowbridge` | Extensions to include |
| `--package-manager` | `npm` \| `yarn` \| `pnpm` \| `bun` | Package manager used to install dependencies (default `pnpm`) |
| `--out` | path | Output directory |
| `--private-key` | string | EVM wallet key for the Node.js server, when using EVM or Snowbridge origins |
| `--substrate-mnemonic` | string | Substrate mnemonic or `//Dev` URI for the Node.js server |

## Examples

```bash
# React app using the XCM SDK and PAPI
npx paraspell-cli@latest sdk react \
  --name my-xcm-app \
  --client papi \
  --package-manager pnpm

# Vue app using the XCM API with EVM origins and swaps
npx paraspell-cli@latest api vue \
  --name my-xcm-api \
  --extensions evm,swap \
  --package-manager npm

# Headless SDK server with swaps
npx paraspell-cli@latest sdk node \
  --name my-xcm-server \
  --client dedot \
  --extensions swap
```

::: info
Non-interactive environments use sensible defaults for anything not passed as a flag. Dependency installation stays an explicit step, so it can be run separately in CI.
:::

::: warning
Avoid typing `--private-key` or `--substrate-mnemonic` literally in shared shells or CI logs: command-line values can end up in shell history. Pass them via an environment variable instead. Preferably through the interactive prompt, or edit the generated `.env` directly.
:::
