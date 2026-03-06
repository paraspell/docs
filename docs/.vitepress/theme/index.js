import DefaultTheme from 'vitepress/theme'
import PackageManagerSwitch from './components/PackageManagerSwitch.vue'
import InstallCommand from './components/InstallCommand.vue'
import ApiVersionSwitch from './components/ApiVersionSwitch.vue'
import ImportBlock from './components/ImportBlock.vue'
import AssetsImportBlock from './components/AssetsImportBlock.vue'

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
  }
}