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

        socialLinks: [
            { icon: 'github', link: 'https://github.com/paraspell' },
            { icon: 'twitter', link: 'https://twitter.com/paraspell' },
        ],

        sidebar: [
          {
            items: [
                { text: 'Welcome to ParaSpell✨', link: '/' },
            ]
          },
          {
            text: 'ParaSpell✨ XCM SDK',
            items: [
              { text: 'Getting started', link: '/sdk/getting-started' },
              { text: 'Send XCM', link: '/sdk/xcmPallet' },
              { text: 'Asset query', link: '/sdk/AssetPallet' },
              { text: 'Query XCM pallets', link: '/sdk/NodePallets' },
            ]
          },
          {
            text: 'LightSpell⚡️ XCM API',
            items: [
              { text: 'Getting started', link: '/api/g-started' },
              { text: 'XCM SDK✨', link: '/api/xcmP' },
              { text: 'XCM Router☄️', link: '/api/xcmRouter' },
              { text: 'XCM Analyser🔎', link: '/api/xcmAnalyser' },
              { text: 'Upgrade request amount', link: '/api/upgrade' },
              { text: 'Deploy API yourself', link: '/api/deploy' },
            ]
          },
          {
            text: 'SpellRouter☄️ XCM ROUTER',
            items: [
              { text: 'Getting started', link: '/router/getting-strtd' },
              { text: 'Send routed XCM', link: '/router/router-use' },
            ]
          },
          {
            text: 'XCM analyser 🔎',
            items: [
              { text: 'Getting started', link: '/analyser/getng-strtd' },
              { text: 'Convert multilocations', link: '/analyser/analyser-use' },
            ]
          },
          {
            text: 'XCM visualizator 🖼️',
            items: [
              { text: 'Getting started', link: '/visualizator/getting-start' },
              { text: 'User guide', link: '/visualizator/user-guide' },
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
            ]
          },
        ]
    }
  }


