---
packages:
  - id: xcm-sdk-🪄
    icon: code
    title: XCM SDK
    details: The SDK unifies various pallets, including XCM, Transact, Swap and Asset pallet, in a cohesive manner. It supports all XCM-compatible Parachains within the Kusama and the Polkadot ecosystems and is designed for ease of implementation, abstracting much of the complex logic and requiring only a few simple, user-friendly inputs.
    link: https://github.com/paraspell/xcm-tools/tree/main/packages/sdk
    meta: paraspell/xcm-tools · packages/sdk
  - id: xcm-api-⚡️
    icon: zap
    title: XCM API
    details: The XCM API serves as an enhancement for XCM and Asset pallet, designed to simplify the development process. By also integrating the XCM SDK and its swap capabilities, it enables dApp developers to incorporate XCM interoperability without the need to install additional packages, thereby saving both time and costs by offloading heavy computing tasks (such as call generation) from the application.
    link: https://github.com/paraspell/xcm-tools/tree/main/apps/xcm-api
    meta: paraspell/xcm-tools · apps/xcm-api
  - id: paraspell-cli-⌨️
    icon: terminal
    title: ParaSpell CLI
    details: A wizard-driven CLI that scaffolds ready-to-run XCM SDK and XCM API starter apps, so you can go from zero to a working cross-chain dApp in minutes.
    link: https://github.com/paraspell/cli
    meta: paraspell/cli
  - id: xcm-analyser-🔎
    icon: search
    title: XCM Analyser
    details: A tool designed to convert XCM locations into a human-readable format.
    link: https://github.com/paraspell/xcm-tools/tree/main/packages/xcm-analyser
    meta: paraspell/xcm-tools · packages/xcm-analyser
  - id: xcm-playground-🛝
    icon: play
    title: XCM Playground
    details: A sandbox environment that allows users to test all ParaSpell applications and packages, including the XCM SDK, XCM API, XCM Router, and XCM Analyser.
    link: https://github.com/paraspell/xcm-tools/tree/main/apps/playground
    meta: paraspell/xcm-tools · apps/playground
  - id: paraspell-xcm-tools-landing-page-🛬
    icon: globe
    title: ParaSpell XCM Tools Landing page
    details: A professional landing page for the XCM Tools, providing a clear overview of the capabilities that can be achieved through the XCM Tools.
    link: https://github.com/paraspell/xcm-tools/tree/main/apps/site
    meta: paraspell/xcm-tools · apps/site
other:
  - id: presskit-🤵‍♂️
    icon: image
    title: Presskit
    details: The Presskit contains ParaSpell logos for media and press use.
    link: https://github.com/paraspell/presskit
    meta: paraspell/presskit
  - id: docs-📖
    icon: book
    title: Docs
    details: The documentation provides guidance on how to use the XCM Tool stack. It also includes useful links and important information about ParaSpell.
    link: https://github.com/paraspell/docs
    meta: paraspell/docs
---

# List of interesting ParaSpell✨ repositories

Following subpage summarizes repositories worth checking.

## Packages and applications 

<LinkCards :items="$frontmatter.packages" layout="list" />

## Other repositories 

<LinkCards :items="$frontmatter.other" />
