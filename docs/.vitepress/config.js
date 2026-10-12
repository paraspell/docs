export default {
    title: 'ParaSpell',
    description: 'Make world more connected with XCM.',
    base: '/docs/',
    lastUpdated: true,
    head: [
      [
        'link',
        { rel: 'icon', type: 'image/x-icon',  href: '/docs/favicon.ico' }
      ],
      ['meta', { name: 'theme-color', content: '#ff5c8c' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: 'ParaSpell' }],
      ['meta', { property: 'og:image', content: 'https://paraspell.github.io/docs/paraspell-icon.png' }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:site', content: '@paraspell' }]
    ],
    // Per-page titles for link previews (X, Telegram, Slack, ...)
    transformHead({ title, description }) {
      return [
        ['meta', { property: 'og:title', content: title }],
        ['meta', { property: 'og:description', content: description }]
      ]
    },
    themeConfig: {
        logo: { src: '/paraspell-wordmark.png', alt: 'ParaSpell' },
        siteTitle: false,
        search: {
          provider: 'local'
        },
        nav: [
          { text: 'Home', link: '/', activeMatch: '^/$' },
          { text: 'XCM SDK', link: '/xcm-sdk/getting-started', activeMatch: '^/xcm-sdk/' },
          { text: 'XCM API', link: '/xcm-api/getting-started', activeMatch: '^/xcm-api/' },
          {
            text: 'Tools',
            activeMatch: '^/(paraspell-cli|xcm-analyser|xcm-playground)/',
            items: [
              { text: 'ParaSpell CLI', link: '/paraspell-cli/getting-started' },
              { text: 'XCM Analyser', link: '/xcm-analyser/getting-started' },
              { text: 'XCM Playground', link: '/xcm-playground/getting-started' },
            ]
          },
          {
            text: 'Resources',
            activeMatch: '^/(supported-chains|interesting-links|contribution-guidelines)',
            items: [
              {
                items: [
                  { text: 'Supported chains', link: '/supported-chains' },
                  { text: 'Bug bounty', link: '/contribution-guidelines' },
                  { text: 'Interesting links', link: '/interesting-links' },
                ]
              },
              {
                items: [
                  { text: 'ParaSpell website', link: 'https://paraspell.xyz' },
                  { text: 'Playground app', link: 'https://playground.paraspell.xyz' },
                  { text: 'Status page', link: 'https://status.paraspell.xyz' },
                ]
              }
            ]
          },
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/paraspell', ariaLabel: 'GitHub' },
            { icon: 'x', link: 'https://x.com/paraspell', ariaLabel: 'X' },
            { icon: 'telegram', link: 'https://t.me/paraspell', ariaLabel: 'Telegram' },
        ],

        outline: {
          level: [2, 3],
          label: 'On this page'
        },

        editLink: {
          pattern: 'https://github.com/paraspell/docs/edit/main/docs/:path',
          text: 'Suggest changes to this page'
        },

        lastUpdated: {
          text: 'Last updated',
          formatOptions: { dateStyle: 'medium' }
        },

        footer: {
          message: 'Released under the MIT License.',
          copyright: `Copyright © ${new Date().getFullYear()} ParaSpell`
        },

        sidebar: [
          {
            text: 'XCM SDK 🪄',
            items: [
              { text: 'Getting started', link: '/xcm-sdk/getting-started' },
              { text: 'Sending XCM', link: '/xcm-sdk/send-xcm' },
              { text: 'XCM fee queries', link: '/xcm-sdk/xcm-utils' },
              { text: 'Asset queries', link: '/xcm-sdk/asset-package' },
              { text: 'XCM pallet queries', link: '/xcm-sdk/pallet-package' },
            ]
          },
          {
            text: 'XCM API ⚡️',
            items: [
              { text: 'Getting started', link: '/xcm-api/getting-started' },
              { text: 'XCM SDK endpoints', link: '/xcm-api/xcm-sdk-functionality' },
              { text: 'XCM Analyser endpoints', link: '/xcm-api/xcm-analyser-functionality' },
              { text: 'Upgrade request amount', link: '/xcm-api/upgrade-xcm-request-amount' },
              { text: 'Deploy API yourself', link: '/xcm-api/deploy-api-yourself' },
            ]
          },
          {
            text: 'ParaSpell CLI ⌨️',
            items: [
              { text: 'Getting started', link: '/paraspell-cli/getting-started' },
              { text: 'Command mode', link: '/paraspell-cli/command-mode' },
            ]
          },
          {
            text: 'XCM Analyser 🔎',
            items: [
              { text: 'Getting started', link: '/xcm-analyser/getting-started' },
              { text: 'Convert locations', link: '/xcm-analyser/how-to-use' },
            ]
          },
          {
            text: 'XCM Playground 🛝',
            items: [
              { text: 'Getting started', link: '/xcm-playground/getting-started' },
            ]
          },
          {
            text: 'Might interest you 🔭',
            items: [
              { text: 'Interesting links', link: '/interesting-links' },
              { text: 'List of supported chains', link: '/supported-chains' },
              { text: 'Bug bounty 💸', link: '/contribution-guidelines' },
            ]
          },
          {
            text: 'Migration guides',
            collapsed: true,
            items: [
              { text: 'From v13 to v14', link: '/migration/v13-to-v14' },
              { text: 'From v12 to v13', link: '/migration/v12-to-v13' },
              { text: 'From v11 to v12', link: '/migration/v11-to-v12' },
              { text: 'From v10 to v11', link: '/migration/v10-to-v11' },
            ]
          }
        ]
    }
  }
