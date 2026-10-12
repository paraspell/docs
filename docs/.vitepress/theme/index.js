import DefaultTheme from 'vitepress/theme'
import PackageManagerSwitch from './components/PackageManagerSwitch.vue'
import InstallCommand from './components/InstallCommand.vue'
import RunCommand from './components/RunCommand.vue'
import ApiVersionSwitch from './components/ApiVersionSwitch.vue'
import ImportBlock from './components/ImportBlock.vue'
import AssetsImportBlock from './components/AssetsImportBlock.vue'
import LinkCards from './components/LinkCards.vue'
import RewardTiers from './components/RewardTiers.vue'
import MagicEmoji from './components/MagicEmoji.vue'
import HomeMedia from './components/home/HomeMedia.vue'
import HomePackages from './components/home/HomePackages.vue'
import HomeFunding from './components/home/HomeFunding.vue'
import HomeFooter from './components/home/HomeFooter.vue'

import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    // keep default behavior
    if (DefaultTheme.enhanceApp)
      DefaultTheme.enhanceApp(ctx)

    const { app } = ctx


    app.component('AssetsImportBlock', AssetsImportBlock)
    app.component('ApiVersionSwitch', ApiVersionSwitch)
    app.component('ImportBlock', ImportBlock)
    app.component('PackageManagerSwitch', PackageManagerSwitch)
    app.component('InstallCommand', InstallCommand)
    app.component('RunCommand', RunCommand)
    app.component('LinkCards', LinkCards)
    app.component('RewardTiers', RewardTiers)
    app.component('MagicEmoji', MagicEmoji)

    // Start page sections (data lives in the frontmatter of docs/index.md)
    app.component('HomeMedia', HomeMedia)
    app.component('HomePackages', HomePackages)
    app.component('HomeFunding', HomeFunding)
    app.component('HomeFooter', HomeFooter)
  }
}