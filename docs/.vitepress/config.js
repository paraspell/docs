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
              { text: 'Getting started', link: '/sdk/getting-started' },
              { text: 'Sending XCM', link: '/sdk/xcmPallet' },
              { text: 'XCM fee queries', link: '/sdk/xcmUtils' },
              { text: 'Asset queries', link: '/sdk/AssetPallet' },
              { text: 'XCM pallet queries', link: '/sdk/NodePallets' },
            ]
          },
          {
            text: ' <div style="display: flex; align-items: center;"><img width="90" alt="Lightspell logo" src="https://user-images.githubusercontent.com/55763425/251588168-4855abc3-445a-4207-9a65-e891975be62c.png"><span>XCM API</span></div>',
            items: [
              { text: 'Getting started', link: '/api/g-started' },
              { text: 'XCM SDK🪄', link: '/api/xcmP' },
              { text: 'XCM Analyser🔎', link: '/api/xcmAnalyser' },
              { text: 'Upgrade request amount', link: '/api/upgrade' },
              { text: 'Deploy API yourself', link: '/api/deploy' },
            ]
          },
          {
            text: 'XCM analyser 🔎',
            items: [
              { text: 'Getting started', link: '/analyser/getng-strtd' },
              { text: 'Convert locations', link: '/analyser/analyser-use' },
            ]
          },
          {
            text: 'XCM visualizer 🖼️',
            items: [
              { text: 'Getting started', link: '/visualizer/getting-start' },
              { text: 'User guide', link: '/visualizer/user-guide' },
            ]
          },
          {
            text: 'XCM playground 🛝',
            items: [
              { text: 'Getting started', link: '/tools/playground' },

            ]
          },
          {
            text: 'Might interest you 🔭',
            items: [
              { text: 'Interesting links', link: '/links' },
              { text: 'List of supported chains', link: '/supported' },
              { text: 'Bug bounty 💸', link: '/contribution' },
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


