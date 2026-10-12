---
overview:
  - icon: bug
    title: Report bugs
    badge: $5–30
    details: Earn rewards based on bug severity.
    link: '#🔍-bug-reporting'
  - icon: pull-request
    title: Fix bugs
    badge: $5–250+
    details: Earn additional rewards based on fix complexity.
    link: '#🛠️-fixing-bugs'

eligible:
  - icon: code
    title: XCM SDK
    details: PAPI version only
    link: https://github.com/paraspell/xcm-tools/tree/main/packages/sdk
  - icon: swap
    title: Swap
    link: https://github.com/paraspell/xcm-tools/tree/main/packages/swap
  - icon: zap
    title: XCM API
    link: https://github.com/paraspell/xcm-tools/tree/main/apps/xcm-api
  - icon: search
    title: XCM Analyser
    link: https://github.com/paraspell/xcm-tools/tree/main/packages/xcm-analyser
  - icon: play
    title: XCM Playground
    link: https://github.com/paraspell/xcm-tools/tree/main/apps/playground

# Lowest tier first; tone is gray, green, orange or red
reportRewards:
  - tone: gray
    level: Very low
    reward: $5–10
    details: Very minor errors in docs / text / code
  - tone: green
    level: Low
    reward: $10–15
    details: Minor UI issues, typos, or cosmetic bugs
  - tone: orange
    level: Medium
    reward: $15–20
    details: Bugs affecting user features or causing functional issues
  - tone: red
    level: High
    reward: $20–30
    details: Crashes, data loss, security vulnerabilities, or major broken functionality

fixRewards:
  - tone: gray
    level: Very low
    reward: $5
    details: Very minor errors in docs / text / code
  - tone: green
    level: Low
    reward: $10–20
    details: Small fix (e.g., 1-2 lines), config changes
  - tone: orange
    level: Medium
    reward: $30–70
    details: Logic changes, multi-file fixes, test additions
  - tone: red
    level: High
    reward: $80–250+
    details: Complex refactors, deep bug fixes, architectural or security-critical changes with tests and docs
---

# Bug bounty program <MagicEmoji emoji="💸" />

Thank you for your interest in contributing to `xcm-tools`! We reward contributors for reporting and fixing bugs in the project.

<div id="📋-bug-bounty-overview"></div>

<LinkCards :items="$frontmatter.overview" />

## Eligible tools

These tools and apps from the [xcm-tools](https://github.com/paraspell/xcm-tools) monorepo are part of the Bug Bounty Program:

- [XCM SDK (PAPI Version)](https://github.com/paraspell/xcm-tools/tree/main/packages/sdk)
- [SWAP Extension](https://github.com/paraspell/xcm-tools/tree/main/packages/swap)
- [XCM API](https://github.com/paraspell/xcm-tools/tree/main/apps/xcm-api)
- [XCM Analyser](https://github.com/paraspell/xcm-tools/tree/main/packages/xcm-analyser)
- [XCM Playground](https://github.com/paraspell/xcm-tools/tree/main/apps/playground)

## Requirements 

To keep the program focused on genuine human contributors, every bug report and fix must meet **all** of these requirements. Submissions that don't are closed without review.

::: details Minimal Contributor Requirements

- **Established account:** your GitHub commit history is at least **6 months** old.
- **Proof of personhood:** set an on-chain identity on the Polkadot People Chain for your AssetHub address and request a registrar judgement ([official guide](https://support.polkadot.network/support/solutions/articles/65000181990-how-to-request-and-cancel-identity-judgement)). [dotID](https://dotid.app/) does this for free, with social/email verification and optional KYC for a stronger judgement. Maintainers check on [Subscan](https://people-polkadot.subscan.io/) that the judgement is at least `Reasonable`. Use the **same address** for payment; nothing outside the Polkadot ecosystem is needed.
- **[Signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits):** sign every commit in your PR with the `-S` flag and include this trailer:
  ```
  AI-Assisted-By: <tool name(s), e.g. "GitHub Copilot", "ChatGPT"> (or "None" if you didn't use one)
  ```
- **AI tools are welcome, autonomous agents are not:** using AI tools (Copilot, ChatGPT, Claude, etc.) is fine if you disclose it, understand the resulting code, and can explain and defend it yourself. Autonomous agents that open PRs without a human reviewing and understanding the change are **not eligible**, regardless of disclosure.
- **Be ready to explain your work:** answer maintainers' review questions specifically and on topic within **5 days**. Without an answer, the reservation expires and the issue reopens for others. Generic, evasive, or off-topic answers get the PR closed and the reservation forfeited.
- **Extra verification for high-severity fixes:** for 🔴 High complexity fixes, maintainers may ask for a brief live chat or call walkthrough before payout, to confirm that a human authored the change and understands it.

::: danger
Repeated low-effort, undisclosed-AI, or automated submissions will result in a permanent ban from the Bug Bounty Program.
:::


## Report a bug

1. Open an [issue in the repository](https://github.com/paraspell/xcm-tools/issues) and select `Bug bounty report`.
2. Fill in all required sections.
3. Submit the issue. Maintainers review it and assign a severity level.

### Rewards for reports

Maintainers determine severity based on impact and may contact you for clarification.

<RewardTiers :tiers="$frontmatter.reportRewards" />

Reporting or fixing grammar errors in the documentation that don't affect functionality or clarity isn't rewarded, but you're very welcome to open a PR fixing them.

## Fix a bug

::: details Reserving the Issue

- Only issues with the "Bug bounty 💰" tag are eligible.
- Comment `I would like to reserve this issue.` on the issue. It is assigned to you and reserved for **48 hours**; if no PR is opened by then, the reservation expires.
- You may reserve **one issue at a time**. Submit or drop your current reservation before reserving another; issues reserved in violation of this are reassigned.
- <span id="🔁-contributing-to-your-own-report"></span>Reported the bug yourself? You still need to reserve the issue before fixing it.
- <span id="👥-collaborating-on-existing-issues"></span>Someone already reported it or opened a PR? Comment to express intent and, if allowed, follow the same reservation and PR process. Keep your contribution additive and clearly explained.

:::

::: details Submitting the Fix 

**Make sure your PR follows these rules and has high-quality code. We will not review PRs that don't meet our quality standards.**


1. Fork the repository and create a new branch.
2. Commit using a [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) message with a type and scope (see below), including the `Signed-off-by` and `AI-Assisted-By` trailers.
3. In the PR description, explain **in your own words** the root cause of the bug and why your change fixes it. A plain summary of the diff is not enough.
4. Open a [pull request](https://github.com/paraspell/xcm-tools/pulls) referencing the issue and tag `@michaeldev5` to request a review.

### Commit messages

Write commit messages as `type(scope): description`. This helps automate changelog generation and keeps the project consistent.

- **type** is one of `feat`, `fix`, `perf`, `revert`, `docs`, `style`, `chore`, `refactor`, `test`, `build` or `ci`.
- **scope** is the package or app you changed, named after its folder in `packages/` or `apps/`, for example `sdk-core`, `sdk`, `assets`, `swap`, `xcm-api`, `xcm-analyser` or `playground`.
- **description** says briefly what the commit does.

<div id="example"></div>

For example, a signed fix in the SDK core package, with the `Signed-off-by` (`-s`) and `AI-Assisted-By` trailers:

```bash
git commit -S -s -m "fix(sdk-core): Handle null case in token parser" \
  --trailer "AI-Assisted-By: None"
```

::: details What each commit type means
- `feat`: new features (Features)
- `fix`: bug fixes (Bug Fixes)
- `perf`: code changes that improve performance (Performance Improvements)
- `revert`: revert a previous commit (Reverts)
- `docs`: changes to documentation only (Documentation)
- `style`: code style changes such as formatting or whitespace (Styles)
- `chore`: routine tasks, hidden in changelogs (Miscellaneous Chores)
- `refactor`: code changes that neither fix bugs nor add features (Code Refactoring)
- `test`: adding or updating tests (Tests)
- `build`: changes that affect the build system or external dependencies (Build System)
- `ci`: CI configuration and scripts (Continuous Integration)

:::

### Rewards for fixes

Rewards depend on code complexity and quality, as determined by maintainers. The $250 for High complexity is not a hard cap: the final amount depends on the task and can be higher.

<RewardTiers :tiers="$frontmatter.fixRewards" />

## Tips 

- Follow the existing code style and structure.
- Write meaningful commit messages.
- Include unit tests if applicable.
- Keep PRs focused: one issue per pull request.
- Add inline comments on important changes and new functions.
- Be respectful and collaborative in discussions.

## FAQ 

<div id="💡-can-i-report-and-fix-the-same-bug"></div>

::: details Can I report and fix the same bug?
Yes! You can both **report and fix** the bug. Be sure to reserve it as outlined above before working on the fix.
:::

<div id="🤖-can-i-use-ai-tools-to-help-with-my-fix"></div>

::: details Can I use AI tools to help with my fix?
Yes, using tools like GitHub Copilot, ChatGPT, or Claude to help you write a fix is fine, as long as you disclose it via the `AI-Assisted-By` commit trailer, understand the code you're submitting, and can explain and defend it during review. Submissions from autonomous agents that open PRs without a human reviewing and understanding the change first are not eligible, and repeated attempts will result in a permanent ban.
:::

<div id="🕒-what-happens-if-i-reserve-an-issue-but-don-t-submit-a-pr-in-48-hours"></div>

::: details What happens if I reserve an issue but don’t submit a PR in 48 hours?
The issue becomes **unreserved and open** for others to claim. You may re-reserve it if it's still unassigned.
:::

<div id="🧾-how-do-you-determine-reward-amounts"></div>

::: details How do you determine reward amounts?
- **Bug reports** are evaluated based on user impact and severity.
- **Fixes** are evaluated based on code complexity, design quality, and completeness (tests, documentation).
:::

<div id="🏦-how-do-i-receive-payment"></div>

::: details How do I receive payment?
Your payment will be sent to the `AssetHub Polkadot address` you provided in the issue or PR, and the amount will be paid in `USDC`. Please ensure you only provide non-cex addresses in the PR, because the payment may not arrive correctly. The payment should be processed within 2 business days after the issue is resolved or the PR is merged.
:::

## Need help?

If you're unsure how to start or have questions about an issue or PR, reach out through the contact form on our [landing page](https://paraspell.xyz/#contact-us), on our [X](https://x.com/paraspell), or in our [Telegram](https://t.me/paraspell) support channel.

We appreciate your support and contributions!

The `ParaSpell✨` Team
