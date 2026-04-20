export default {
    title: 'ParaSpell',
    description: 'Make world more connected with XCM.',
    base: '/docs/',
    head: [
      [
        'link',
        { rel: 'icon', type: 'image/x-icon',  href: '/docs/favicon.ico' }
      ]
    ],
    themeConfig: {
        logo: '/paraspell.png',
        search: {
          provider: 'local'
        },
        nav: [
          { text: 'HOME', link: '/' },
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/paraspell' },
            { icon: 'twitter', link: 'https://twitter.com/paraspell' },
        ],

        sidebar: [
          {
            text: '<div style="display: flex; align-items: center;"><img width="90" alt="ParaSpell logo" src="https://user-images.githubusercontent.com/55763425/251588903-bcf72b05-bdf7-46d8-b804-16b0e3236792.png"><span>XCM SDK</span></div>',
            items: [
              { text: 'Getting started', link: '/xcm-sdk/getting-started' },
              { text: 'Sending XCM', link: '/xcm-sdk/send-xcm' },
              { text: 'XCM fee queries', link: '/xcm-sdk/xcm-utils' },
              { text: 'Asset queries', link: '/xcm-sdk/asset-package' },
              { text: 'XCM pallet queries', link: '/xcm-sdk/pallet-package' },
            ]
          },
          {
            text: ' <div style="display: flex; align-items: center;"><img width="90" alt="Lightspell logo" src="https://user-images.githubusercontent.com/55763425/251588903-bcf72b05-bdf7-46d8-b804-16b0e3236792.png"><span>XCM API</span></div>',
            items: [
              { text: 'Getting started', link: '/xcm-api/getting-started' },
              { text: 'XCM SDK🪄', link: '/xcm-api/xcm-sdk-functionality' },
              { text: 'XCM Analyser🔎', link: '/xcm-api/xcm-analyser-functionality' },
              { text: 'Upgrade request amount', link: '/xcm-api/upgrade-xcm-request-amount' },
              { text: 'Deploy API yourself', link: '/xcm-api/deploy-api-yourself' },
            ]
          },
          {
            text: 'XCM analyser 🔎',
            items: [
              { text: 'Getting started', link: '/xcm-analyser/getting-started' },
              { text: 'Convert locations', link: '/xcm-analyser/how-to-use' },
            ]
          },
          {
            text: 'XCM visualizer 🖼️',
            items: [
              { text: 'Getting started', link: '/xcm-visualizer/getting-started' },
              { text: 'User guide', link: '/xcm-visualizer/user-guide' },
            ]
          },
          {
            text: 'XCM playground 🛝',
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
            text: 'Migration guides ⬆',
            items: [
              { text: 'From v10 to v11', link: '/migration/v10-to-v11' },
              { text: 'From v11 to v12', link: '/migration/v11-to-v12' },
              { text: 'From v12 to v13', link: '/migration/v12-to-v13' },
            ]
          }
        ]
    }
  }


