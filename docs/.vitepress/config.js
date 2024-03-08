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
              { text: 'Create HRMP channels', link: '/sdk/HRMP' },
              { text: 'Query XCM pallets', link: '/sdk/NodePallets' },
            ]
          },
          {
            text: 'LightSpell⚡️ XCM API',
            items: [
              { text: 'Getting started', link: '/api/g-started' },
              { text: 'Asset pallet', link: '/api/assetP' },
              { text: 'HRMP pallet', link: '/api/hrmpP' },
              { text: 'Node pallets', link: '/api/nodeP' },
              { text: 'XCM pallet', link: '/api/xcmP' },
              { text: 'XCM Router☄️', link: '/api/xcmRouter' },
              { text: 'Upgrade request amount', link: '/api/upgrade' },
              { text: 'API playground', link: '/api/playground' },
              { text: 'Deploy API yourself', link: '/api/deploy' },


            ]
          },
          {
            text: 'SpellRouter☄️ XCM ROUTER',
            items: [
              { text: 'Getting started', link: '/router/getting-strtd' },
              { text: 'Router implementation', link: '/router/router-use' },
              { text: 'Router playground', link: '/router/playground' },
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


