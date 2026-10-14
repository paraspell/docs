---
title: Documentation
pageClass: docs-home

tools:
  - icon: code
    title: XCM SDK
    details: The first and only XCM SDK in the ecosystem. Send XCM and query fees, assets and pallets with PAPI, Polkadot.js or Dedot.
    link: /xcm-sdk/getting-started
  - icon: zap
    title: XCM API
    details: Integrate XCM in a package-less way over REST, offloading heavy computation from your dApp and reducing associated costs.
    link: /xcm-api/getting-started
  - icon: terminal
    title: ParaSpell CLI
    details: Scaffold ready-to-run XCM SDK and XCM API starter apps and go from zero to a working cross-chain dApp in minutes.
    link: /paraspell-cli/getting-started
  - icon: search
    title: XCM Analyser
    details: Convert XCM locations and entire XCM calls into a human-readable format.
    link: /xcm-analyser/getting-started
  - icon: play
    title: XCM Playground
    details: Demo-test every ParaSpell XCM tool in your browser, including various DEX operations.
    link: /xcm-playground/getting-started
  - icon: globe
    title: Supported chains
    details: Relay chains and parachains across Polkadot, Kusama, Westend and Paseo, plus Ethereum via Snowbridge.
    link: /supported-chains

media:
  video:
    poster:
      dark: /intro-video-poster-dark.jpg
      light: /intro-video-poster-light.jpg
    sources:
      dark:
        - https://cdn.jsdelivr.net/gh/paraspell/presskit@main/introvideo_claude/paraspell-intro-dark.mp4
        - https://raw.githubusercontent.com/paraspell/presskit/main/introvideo_claude/paraspell-intro-dark.mp4
      light:
        - https://cdn.jsdelivr.net/gh/paraspell/presskit@main/introvideo_claude/paraspell-intro-light.mp4
        - https://raw.githubusercontent.com/paraspell/presskit/main/introvideo_claude/paraspell-intro-light.mp4

packages:
  - name: '@paraspell/sdk'
    tag: SDK
    details: XCM SDK for Polkadot API (PAPI).
    docs: /xcm-sdk/getting-started
    source: https://github.com/paraspell/xcm-tools/tree/main/packages/sdk
  - name: '@paraspell/sdk-pjs'
    tag: SDK
    details: XCM SDK for Polkadot.js.
    docs: /xcm-sdk/getting-started
    source: https://github.com/paraspell/xcm-tools/tree/main/packages/sdk-pjs
  - name: '@paraspell/sdk-dedot'
    tag: SDK
    details: XCM SDK for Dedot.
    docs: /xcm-sdk/getting-started
    source: https://github.com/paraspell/xcm-tools/tree/main/packages/sdk-dedot
  - name: '@paraspell/swap'
    tag: Extension
    details: Cross-chain swaps on popular exchanges (formerly XCM Router).
    docs: /xcm-sdk/getting-started#install-swap-extension
  - name: '@paraspell/evm'
    tag: Extension
    details: EVM contract transfers.
    docs: /xcm-sdk/getting-started#install-evm-extension
  - name: '@paraspell/evm-snowbridge'
    tag: Extension
    details: Snowbridge transfers from Ethereum.
    docs: /xcm-sdk/getting-started#install-snowbridge-extension
  - name: '@paraspell/xcm-analyser'
    tag: Tool
    details: Converts XCM locations into a human-readable format.
    docs: /xcm-analyser/getting-started
    source: https://github.com/paraspell/xcm-tools/tree/main/packages/xcm-analyser
  - name: paraspell-cli
    tag: Tool
    details: Scaffolds ready-to-run XCM SDK and XCM API starter apps.
    docs: /paraspell-cli/getting-started
    source: https://github.com/paraspell/cli
  - name: XCM API
    tag: API
    details: Package-less REST API hosted at api.paraspell.xyz.
    docs: /xcm-api/getting-started
    source: https://github.com/paraspell/xcm-tools/tree/main/apps/xcm-api

# Oldest first
research:
  - title: Sharing Fungible Assets Across Polkadot Paraverse
    badge: IEEE
    link: https://ieeexplore.ieee.org/document/9872938/
  - title: Enhancing XCMP Interoperability Across Polkadot Paraverse
    badge: IEEE
    link: https://ieeexplore.ieee.org/document/10174872
  - title: 'ParaSpell XCM SDK: A New Protocol for Interoperability in Polkadot Paraverse'
    badge: IEEE
    link: https://ieeexplore.ieee.org/document/10338906
  - title: 'Cross-Chain Payments on Blockchain Networks: An Apartment Booking Use-Case'
    badge: ACM
    link: https://dl.acm.org/doi/10.1145/3605098.3636137
  - title: Protocol for unifying cross-chain liquidity on Polkadot
    badge: Frontiers
    link: https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2024.1413840/full
  - title: Decentralized Bridge Between Polkadot and Cosmos
    badge: ACM
    link: https://dl.acm.org/doi/10.1145/3672608.3708011
  - title: 'Unispell: universal adapter for interoperability in Polkadot Paraverse'
    badge: Springer
    link: https://link.springer.com/article/10.1007/s10586-025-05183-6
  - title: 'Understanding Cross-Chain Message Passing Delays in Polkadot: An Experimental Perspective'
    badge: IEEE
    link: https://ieeexplore.ieee.org/abstract/document/11229575

# Oldest first
grants:
  - title: Base grant
    links:
      - { text: Application, link: https://github.com/w3f/Grants-Program/pull/1118 }
      - { text: Delivery, link: https://github.com/w3f/Grant-Milestone-Delivery/pull/584 }
  - title: Phase 2 grant
    links:
      - { text: Application, link: https://github.com/w3f/Grants-Program/pull/1245 }
      - { text: Delivery 1, link: https://github.com/w3f/Grant-Milestone-Delivery/pull/670 }
      - { text: Delivery 2 & 3, link: https://github.com/w3f/Grant-Milestone-Delivery/pull/715 }
  - title: Phase 3 grant
    focus: Make SDK better
    links:
      - { text: Application, link: https://github.com/w3f/Grants-Program/pull/1589 }
      - { text: Delivery, link: https://github.com/w3f/Grant-Milestone-Delivery/pull/836 }
  - title: Phase 4 grant
    focus: Build XCM-API
    links:
      - { text: Application, link: https://github.com/w3f/Grants-Program/pull/1817 }
      - { text: Delivery, link: https://github.com/w3f/Grant-Milestone-Delivery/pull/972 }
  - title: Phase 5 grant
    focus: Implement XCM-Router
    links:
      - { text: Application, link: https://github.com/w3f/Grants-Program/pull/2057 }
      - { text: Delivery 1, link: https://github.com/w3f/Grant-Milestone-Delivery/pull/1081 }
      - { text: Delivery 2, link: https://github.com/w3f/Grant-Milestone-Delivery/pull/1087 }

# Oldest first; add each new monthly report to the last period
treasury:
  - period: Mar 2024 – Jul 2024
    funder: Kusama
    referendum: 344
    referendumLink: https://kusama.polkassembly.io/referenda/344
    reports:
      - { month: Mar, link: https://docs.google.com/document/d/1AAukuZ-H2ecb1kahwO5beMHL5dKo74OC5JA-przJgqA/edit?usp=sharing }
      - { month: Apr, link: https://docs.google.com/document/d/15cRKcqdNAJFhpfon4brvIKpaJoomnFIET2eI9AgYlIo/edit?usp=sharing }
      - { month: May, link: https://docs.google.com/document/d/1I5mKA_t7uLW7I2ujF8JagfpYA2s97ADUZKDdv9ITnJE/edit?usp=sharing }
      - { month: Jun, link: https://docs.google.com/document/d/1vy696HHpgiFVn3Xr4eP40NGg-PY5S05aP-yZZEMHI2U/edit?usp=sharing }
      - { month: Jul, link: https://docs.google.com/document/d/17_6JjysvPLbiZiD7gvKdH_hAyWHpTmEiEX9ytQoSAII/edit?usp=sharing }
  - period: Aug 2024 – Jan 2025
    funder: Kusama
    referendum: 417
    referendumLink: https://kusama.polkassembly.io/referenda/417
    reports:
      - { month: Aug, link: https://docs.google.com/document/d/1yaNIXZOPTSaMGTqahvcEt7gAqlSqsIVCydvkf7T1dbQ/edit?usp=sharing }
      - { month: Sep, link: https://docs.google.com/document/d/1KRzXq9jB5WamLcgjVUtjI80SC2RC6PnB0SFEjyrAZdw/edit?usp=sharing }
      - { month: Oct, link: https://docs.google.com/document/d/1ZzvD03XeR7Z43wHCQlgDfGCUXFA0jab5wdPTT1dy9QU/edit?usp=sharing }
      - { month: Nov, link: https://docs.google.com/document/d/14IExOdqajGJSnvCRqL5XeTLYlPGVd6hwZ35MeG0TK_g/edit?usp=sharing }
      - { month: Dec, link: https://docs.google.com/document/d/1ApjuM85Nv83Ha_9wSfxLn8iZNqiw37V8shTRLzzrWNo/edit?usp=sharing }
      - { month: Jan, link: https://docs.google.com/document/d/1-5__OtE60ue-h4QeDmG24MxagsgAgrtUmQLkeLTvNt0/edit?usp=sharing }
  - period: Feb 2025 – Jul 2025
    funder: Kusama
    referendum: 485
    referendumLink: https://kusama.polkassembly.io/referenda/485
    reports:
      - { month: Feb, link: https://docs.google.com/document/d/1WmpErT8SyIXApdwtCeB0X28XgUSoR2qXeJSec3c-4dA/edit?usp=sharing }
      - { month: Mar, link: https://docs.google.com/document/d/1gbVz8yMbesRlE5KHUce1DYmi0UcSMhUICtEsgXIrevA/edit?usp=sharing }
      - { month: Apr, link: https://docs.google.com/document/d/1FxUdJcUUOQjcd5bHyASGLGpj9Im4Ex06Osk6ixcfi_8/edit?usp=sharing }
      - { month: May, link: https://docs.google.com/document/d/1yhsSCSaOqR7zCWNPM7wvBrpimUxaeb76tmA21wmtxvE/edit?usp=sharing }
      - { month: Jun, link: https://docs.google.com/document/d/196SwN4cJ03BAjWg6alzt1MW5fSEnnVbSxCx03qjMuYo/edit?usp=sharing }
      - { month: Jul, link: https://docs.google.com/document/d/1inuXzdJs2I1vfh6GuO9yQxWcJB2vlVDfDngscwudi3o/edit?usp=sharing }
  - period: Aug 2025 – Jul 2026
    funder: Polkadot
    referendum: 1641
    referendumLink: https://polkadot.subsquare.io/referenda/1641
    reports:
      - { month: Aug, link: https://docs.google.com/document/d/11W3keTVFBCdyoE12eyB1I1yCPONHBGmCdjTvfPszr-Y/edit?usp=sharing }
      - { month: Sep, link: https://docs.google.com/document/d/1FLusxQYk2oT5o-YpocGnExO2c1pw1bY4u0faITrMnAM/edit?usp=sharing }
      - { month: Oct, link: https://docs.google.com/document/d/1Chhl1KNJqsnc-0At7Lg7tG2XPsO2SaA5UVYsFeYuPLs/edit?usp=sharing }
      - { month: Nov, link: https://docs.google.com/document/d/1jLnSJO5tYWgI5ud02kUYx6Trr-l-COXEJHqaPY9joJw/edit?usp=sharing }
      - { month: Dec, link: https://docs.google.com/document/d/1jFvBVHdQ50whvFU_Nm6nf94AZ7RfHI_DzlhHUPHt8gA/edit?usp=sharing }
      - { month: Jan, link: https://docs.google.com/document/d/1Ga6utP2r2eaNgTEutUVDnQyvNWr_L6P5Q6cf194aCPk/edit?usp=sharing }
      - { month: Feb, link: https://docs.google.com/document/d/1ScfhL6SUIitIWwSS7PXODlxrloqwRyiye4uyPmgO_9o/edit?usp=sharing }
      - { month: Mar, link: https://docs.google.com/document/d/1AujeX0eBbvk45Y8IFGyg4GZ83Vmk3yGTeMISGMvwNfk/edit?usp=sharing }
      - { month: Apr, link: https://docs.google.com/document/d/1Ge8Ysuwj_sXH8M8IbNDF9wRQuT4x9O0dl1dAQHHH4wE/edit?usp=sharing }
      - { month: May, link: https://docs.google.com/document/d/1k9hbqmT9Y2Y0jS9FXOxzUMj90DI8v0cUxUolTZtNwhM/edit?usp=sharing }
      - { month: Jun, link: https://docs.google.com/document/d/1isVkXaWMVKVJAU1Z5F9QLWMv0JWrZLCai6ffUag4QYs/edit?usp=sharing }
      - { month: Jul, link: https://docs.google.com/document/d/1cfPc6lMywuWDzKP6kVyBbx1T9lQug2NjVFLGnI2y_0M/edit?usp=sharing }
  - period: Aug 2026 – Jul 2027
    funder: Polkadot
    referendum: 1916
    referendumLink: https://polkadot.subsquare.io/referenda/1916
    reports:
      - { month: Aug, link: https://docs.google.com/document/d/13qI4iDfigJV70PztlzYRiJAhrrD6d87qCdlOse7vG_U/edit?usp=sharing }
      - { month: Sep, link: https://docs.google.com/document/d/1hBKzP1B5eiWZscVIWC0AvS6KZSmO9EU7bxXvL1ZiauA/edit?usp=sharing }

contact:
  title: How to reach out to us
  items:
    - { icon: mail, text: Contact form, link: https://paraspell.xyz/#contact-us }
    - { icon: telegram, text: Telegram, link: https://t.me/paraspell }
    - { icon: x, text: , link: https://x.com/paraspell }

supporters:
  title: Project is supported by
  alt: Polkadot, Kusama and Web3 Foundation Grants Program
  light: https://raw.githubusercontent.com/paraspell/presskit/main/logos_supporters/polkadot_kusama_w3f_standard.png
  dark: https://raw.githubusercontent.com/paraspell/presskit/main/logos_supporters/polkadot_kusama_transparent.png
---

# ![ParaSpell](/paraspell-wordmark.png) XCM Tools <span class="nowrap">Documentation <MagicEmoji emoji="🧙‍♂️" :tilt="10" /></span>

<p class="lead">Guides and references for the ParaSpell XCM Tools.</p>

##

<LinkCards :items="$frontmatter.tools" :columns="2" />

## What is ParaSpell? <MagicEmoji emoji="✨" :tilt="-8" />

ParaSpell is dedicated to enhancing XCM functionality by conducting in-depth research on every XCM-compatible Parachain. This research is then consolidated into XCM Tools, which standardize the diverse XCM implementations into easy-to-use, uniform tools. These tools enable you to seamlessly integrate the interoperability benefits of the Polkadot and Kusama ecosystems into your application within moments.

### Why should I use ParaSpell?

Implementing Polkadot's flagship feature, XCM, into your application can sometimes be a complex task. Each Parachain may customize its XCM Pallets to meet specific needs, resulting in a wide variety of implementations. Supporting multiple Parachains in a consistent manner is therefore time-consuming. Fortunately, ParaSpell has already conducted this research and wrapped the necessary pallets from every compatible Parachain into its tools. **Saving time is crucial when delivering a product, and ParaSpell helps you use it wisely.**

## Tired of reading? <MagicEmoji emoji="🎬" />

<HomeMedia v-bind="$frontmatter.media" />

## Project achievements <MagicEmoji emoji="🏆" />

We take great pride in our achievements, which reflect our commitment to enhancing cross-chain communication and our dedication to building a strong reputation through diligent effort.

### International research articles and journals

<LinkCards :items="$frontmatter.research" />

### Maintenance and development funding

<HomeFunding :grants="$frontmatter.grants" :treasury="$frontmatter.treasury" />

<HomeFooter :supporters="$frontmatter.supporters" :contact="$frontmatter.contact" />
