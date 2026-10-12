---
resources:
  - title: Deployed on
    details: api.paraspell.xyz/v2
    link: https://api.paraspell.xyz/v2
  - title: GitHub repository
    details: Source code of the XCM API.
    link: https://github.com/paraspell/xcm-tools/tree/main/apps/xcm-api
  - title: Downtime monitoring
    details: Current status of the deployed API.
    link: https://status.paraspell.xyz/
guides:
  - title: XCM SDK endpoints
    details: Send XCM, dry run calls, and query fees, assets and pallets over REST.
    link: /xcm-api/xcm-sdk-functionality
  - title: XCM Analyser endpoints
    details: Convert locations and XCM calls into a human-readable format.
    link: /xcm-api/xcm-analyser-functionality
  - title: Upgrade request amount
    details: Raise your rate limit with a free API key.
    link: /xcm-api/upgrade-xcm-request-amount
  - title: Deploy API yourself
    details: Run your own instance of the XCM API.
    link: /xcm-api/deploy-api-yourself
---

# Getting started with XCM API <MagicEmoji emoji="⚡️" />

This section guides you on how to use our XCM API. The API lets you integrate XCM interoperability into your decentralized application in a package-less way, offloading heavy computing tasks from your application and reducing associated costs.

<LinkCards :items="$frontmatter.resources" />

## What you can do

<LinkCards :items="$frontmatter.guides" />
