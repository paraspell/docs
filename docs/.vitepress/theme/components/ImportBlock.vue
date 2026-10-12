<script setup>
import SdkImportBlock from './SdkImportBlock.vue'

const names = [
  'getDefaultPallet',
  'getSupportedPallets',
  'getPalletIndex',
  'SUPPORTED_PALLETS',
  'getNativeAssetsPallet',
  'getOtherAssetsPallets'
]
</script>

<template>
  <SdkImportBlock :names="names" />
</template>
