# 🛠️ Contributing to `xcm-tools`

Thank you for your interest in contributing to `xcm-tools`!  
We run an open Bug Bounty Program that rewards contributors for reporting and fixing bugs in the project.

## 📋 Bug Bounty Overview

You can contribute in two ways:

1. **Report bugs** – Earn rewards based on bug severity.
2. **Fix bugs** – Earn additional rewards based on fix complexity.

**Which tools/apps from monorepo are eligible in Bug bounty?**

- [XCM SDK](https://github.com/paraspell/xcm-tools/tree/main/packages/sdk) (Papi version only)
- [SWAP](https://github.com/paraspell/xcm-tools/tree/main/packages/swap)
- [XCM API](https://github.com/paraspell/xcm-tools/tree/main/apps/xcm-api)
- [XCM Analyser](https://github.com/paraspell/xcm-tools/tree/main/packages/xcm-analyser)
- [XCM Playground](https://github.com/paraspell/xcm-tools/tree/main/apps/playground)

## ✅ Contributor Eligibility

To keep this program focused on genuine human contributors and prevent bulk/automated AI-agent submissions, both bug reports and fixes must meet **all** of the following requirements. Submissions that don't meet them will be closed without review.

- **Established account:** Your GitHub commit history must be at least **6 months** old.
- **Proof of personhood:** Set an on-chain identity on the Polkadot People Chain for your AssetHub address (see the [official guide](https://support.polkadot.network/support/solutions/articles/65000181990-how-to-request-and-cancel-identity-judgement)) and request a registrar judgement. [dotID](https://dotid.app/) offers this for free, including social/email verification and optional KYC for a stronger judgement. Use the **same address** you provide for payment below. Maintainers verify your judgement is at least `Reasonable` via [Subscan](https://people-polkadot.subscan.io/) — no separate wallet or platform outside the Polkadot ecosystem required.
- **[Signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits):** Every commit in your PR must include these trailers and must be signed with S flag:
  ```
  AI-Assisted-By: <tool name(s), e.g. "GitHub Copilot", "ChatGPT"> (or "None" if you didn't use one)
  ```
- **AI tools are welcome, autonomous agents are not:** Using AI tools (Copilot, ChatGPT, Claude, etc.) to help you write a fix is completely fine as long as you disclose it, understand the resulting code, and can explain and defend it yourself. Autonomous agents that scan issues and open PRs without a human reviewing and understanding the change first are **not eligible**, regardless of disclosure.
- **Be ready to explain your work:** Maintainers may ask clarifying questions during review. You're expected to give specific, on-topic answers within **5 days** (see "Reserving an Issue" below). Generic, evasive, or clearly disconnected answers will result in the PR being closed and your reservation forfeited.
- **Extra verification for high-severity fixes:** For 🔴 High complexity fixes, maintainers may request a brief live chat/call walkthrough of your change before payout, to confirm a human authored and understands it.
- **One reservation at a time:** You may only reserve one bug bounty issue at a time. Submit or drop your current one before reserving another.

> ⚠️ Repeated low-effort, undisclosed-AI, or automated submissions will result in a permanent ban from the Bug Bounty Program.

## 🔍 Bug Reporting

To report a bug:

1. Open an [issue in the repository](https://github.com/paraspell/xcm-tools/issues) and select `Bug bounty report`
2. Fill in all required sections.
3. Submit the issue — maintainers will review and assign a severity level.

### 💰 Rewards for Reporting Bugs

| Severity Level | Description                                                                 | Reward |
|----------------|-----------------------------------------------------------------------------|--------|
| ⚪️ Very low           | Very minor errors in docs / text / code                              | $5-10     |
| 🟢 Low         | Minor UI issues, typos, or cosmetic bugs                                    | $10-15    |
| 🟠 Medium      | Bugs affecting user features or causing functional issues                   | $15-20    |
| 🔴 High        | Crashes, data loss, security vulnerabilities, or major broken functionality | $20-30    |

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
- **You may only reserve one issue at a time.** Submit or drop your current reservation before reserving another — issues reserved in violation of this will be reassigned.
- Once your PR is opened, respond to maintainer review questions with specific, on-topic answers within **5 days**. If you don't, the reservation expires and the issue reopens for others.

### 🔁 Contributing to Your Own Report

If you reported a bug and want to fix it:

- You still need to **reserve the issue**.
- Submit your PR as outlined below.

## 📦 Submitting a Fix

**Please make sure your PR is according to rules and has high quality code. We will not be checking your PR if it doesn't follow our quality standards.**

1. Fork the repository and create a new branch.
2. Make your changes and **commit using a Conventional Commit message** with one of the **supported tags** listed below, including the `Signed-off-by` and `AI-Assisted-By` trailers described in Contributor Eligibility above.
3. In your PR description, explain **in your own words** the root cause of the bug and why your change fixes it — a plain summary of the diff is not enough.
4. Open a [Pull Request](https://github.com/paraspell/xcm-tools/pulls) referencing the issue.
5. **Tag `@michaeldev5`** in the PR description to request a review.

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

## ❓ FAQ

### 💡 Can I report and fix the same bug?

Yes! You can both **report and fix** the bug. Be sure to reserve it as outlined above before working on the fix.


### 🤖 Can I use AI tools to help with my fix?

Yes — using tools like GitHub Copilot, ChatGPT, or Claude to help you write a fix is fine, as long as you disclose it via the `AI-Assisted-By` commit trailer, understand the code you're submitting, and can explain and defend it during review. Submissions from autonomous agents that open PRs without a human reviewing and understanding the change first are not eligible, and repeated attempts will result in a permanent ban.


### 🕒 What happens if I reserve an issue but don’t submit a PR in 48 hours?

The issue becomes **unreserved and open** for others to claim. You may re-reserve it if it's still unassigned.


### 🧾 How do you determine reward amounts?

- **Bug reports** are evaluated based on user impact and severity.
- **Fixes** are evaluated based on code complexity, design quality, and completeness (tests, documentation).


### 🏦 How do I receive payment?

Your payment will be sent to `AssetHub Polkadot address` you provided in the issue or PR and the amount will be paid in `USDC` currency. Please ensure to only provide non-cex addresses to the PR, because the payment may not arrive correctly. The payment should be processed within 2 business days after the issue is resolved or PR is merged.


## 🧠 Tips

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
