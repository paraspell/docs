# 🛠️ Contributing to `xcm-tools`

Thank you for your interest in contributing to `xcm-tools`!  
We run an open Bug Bounty Program that rewards contributors for reporting and fixing bugs in the project.

## 📋 Bug Bounty Overview

You can contribute in two ways:

1. **Report bugs** – Earn rewards based on bug severity.
2. **Fix bugs** – Earn additional rewards based on fix complexity.

**Which tools/apps from monorepo are eligible in Bug bounty?**

- [XCM SDK](https://github.com/paraspell/xcm-tools/tree/main/packages/sdk) (Papi version only)
- [XCM API](https://github.com/paraspell/xcm-tools/tree/main/apps/xcm-api)
- [XCM Router](https://github.com/paraspell/xcm-tools/tree/main/packages/xcm-router)
- [XCM Analyser](https://github.com/paraspell/xcm-tools/tree/main/packages/xcm-analyser)
- [XCM Visualizer FE](https://github.com/paraspell/xcm-tools/tree/main/apps/visualizator-fe)
- [XCM Visualizer BE](https://github.com/paraspell/xcm-tools/tree/main/apps/visualizator-be)
- [XCM Playground](https://github.com/paraspell/xcm-tools/tree/main/apps/playground)

## 🔍 Bug Reporting

To report a bug:

1. Open an [issue in the repository](https://github.com/paraspell/xcm-tools/issues) and select `Bug bounty report`
2. Fill in all required sections.
3. Submit the issue — maintainers will review and assign a severity level.

### 💰 Rewards for Reporting Bugs

| Severity Level | Description                                                                 | Reward |
|----------------|-----------------------------------------------------------------------------|--------|
| ⚪️ Very low           | Very minor errors in docs / text / code                              | $5     |
| 🟢 Low         | Minor UI issues, typos, or cosmetic bugs                                    | $10    |
| 🟠 Medium      | Bugs affecting user features or causing functional issues                   | $20    |
| 🔴 High        | Crashes, data loss, security vulnerabilities, or major broken functionality | $30    |

> Maintainers determine severity based on impact. Contributors may be contacted for clarification.

> Please note that reporting and fixing grammar errors in documentation that do not affect functionality or clarity to the user is not rewarded; you are, however, very welcome to open a PR fixing them.

## 🛠️ Fixing Bugs

You can contribute fixes to open bug bounty issues.

### 🔒 Reserving an Issue

Before working on a fix:

- Ensure, that the issue has "Bug bounty 💰" tag on it.
- Comment on the issue with:  
  > `I would like to reserve this issue.`  
- The issue will be assigned and reserved to you for **48 hours**.
- If no PR is opened within 48 hours, the reservation expires.

### 🔁 Contributing to Your Own Report

If you reported a bug and want to fix it:

- You still need to **reserve the issue**.
- Submit your PR as outlined below.

## 📦 Submitting a Fix

**Please make sure your PR is according to rules and has high quality code. We will not be checking your PR if it doesn't follow our quality standards.**

1. Fork the repository and create a new branch.
2. Make your changes and **commit using a Conventional Commit message** with one of the **supported tags** listed below.
3. Open a [Pull Request](https://github.com/paraspell/xcm-tools/pulls) referencing the issue.
4. **Tag `@michaeldev5`** in the PR description to request a review.

### ✅ Commit Guidelines

Please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification when writing your commit messages. This helps automate changelog generation and improves project consistency.

Use **one of the following commit types**:

| Type       | Section                   | Description                                                   |
|------------|---------------------------|---------------------------------------------------------------|
| `feat`     | Features                  | New features                                                  |
| `fix`      | Bug Fixes                 | Bug fixes                                                     |
| `perf`     | Performance Improvements  | Code changes that improve performance                         |
| `revert`   | Reverts                   | Revert a previous commit                                      |
| `docs`     | Documentation             | Changes to documentation only                                 |
| `style`    | Styles                    | Code style changes (formatting, whitespace, etc.)             |
| `chore`    | Miscellaneous Chores      | Routine tasks (note: these are hidden in changelogs)          |
| `refactor` | Code Refactoring          | Code changes that neither fix bugs nor add features           |
| `test`     | Tests                     | Adding or updating tests                                      |
| `build`    | Build System              | Changes that affect the build system or external dependencies |
| `ci`       | Continuous Integration    | CI configuration and scripts                                  |

#### Example:
```bash
git commit -m "fix: Handle null case in token parser"
```

### 💵 Rewards for Fixes

| Complexity | Description                                                                                         | Reward Range |
|------------|-----------------------------------------------------------------------------------------------------|--------------|
| ⚪️ Very low | Very minor errors in docs / text / code                                   | $5     |
| 🟢 Low     | Small fix (e.g., 1-2 lines), config changes                                | $10–$20      |
| 🟠 Medium  | Logic changes, multi-file fixes, test additions                                                      | $30–$70      |
| 🔴 High    | Complex refactors, deep bug fixes, architectural or security-critical changes with tests and docs   | $80–$250+     |


> The reward is based on code complexity and quality, as determined by maintainers.

> The High complexity tasks only have theoretical cap of $250, because the final amount depends on complexity of the task. The amount can be higher.

> Please note that reporting and fixing grammar errors in documentation that do not affect functionality or clarity to the user is not rewarded; you are, however, very welcome to open a PR fixing them.

## 👥 Collaborating on Existing Issues

If someone has already reported an issue or opened a PR and you want to contribute:

- Comment to express intent.
- If allowed, follow the same reservation/PR process.
- Make sure your contribution is additive and clearly explained.

## ❓ FAQ (Frequently Asked Questions)

### 💡 Can I report and fix the same bug?

Yes! You can both **report and fix** the bug. Be sure to reserve it as outlined above before working on the fix.


### 🕒 What happens if I reserve an issue but don’t submit a PR in 48 hours?

The issue becomes **unreserved and open** for others to claim. You may re-reserve it if it's still unassigned.


### 🧾 How do you determine reward amounts?

- **Bug reports** are evaluated based on user impact and severity.
- **Fixes** are evaluated based on code complexity, design quality, and completeness (tests, documentation).


### 🏦 How do I receive payment?

Your payment will be sent to `AssetHub Polkadot address` you provided in the issue or PR and the amount will be paid in `USDC` currency. Please ensure to only provide non-cex addresses to the PR, because the payment may not arrive correctly. The payment should be processed within 2 business days after the issue is resolved or PR is merged.


## 🧠 Tips for High-Quality Contributions

- Follow the existing code style and structure.
- Write meaningful commit messages.
- Include unit tests if applicable.
- Keep PRs focused — one issue per pull request.
- Add inline comments on important changes and new functions
- Be respectful and collaborative in discussions.


## 📫 Need Help?

If you're unsure how to start or have questions about an issue or PR you can use one of the following ways to reach out to us:

- Contact form on our [landing page](https://paraspell.xyz/#contact-us).
- Message us on our [X](https://x.com/paraspell).
- Support channel on [telegram](https://t.me/paraspell).

We appreciate your support and contributions!

— The `ParaSpell✨` Team
