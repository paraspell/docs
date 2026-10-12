<script setup>
import SdkImportBlock from './SdkImportBlock.vue'

const names = [
  'getSupportedDestinations',
  'getSupportedAssets',
  'getFeeAssets',
  'getAssetsObject',
  'getAssetId',
  'getRelayChainSymbol',
  'getNativeAssets',
  'getOtherAssets',
  'getAllAssetsSymbols',
  'hasSupportForAsset',
  'getAssetDecimals',
  'getParaId',
  'getTChain',
  'getAssetLocation',
  'TParachain',
  'TRelaychain',
  'TSubstrateChain',
  'TExternalChain',
  'TChain',
  'findAssetInfo',
  'findAssetInfoOrThrow'
]
</script>

<template>
  <SdkImportBlock :names="names" />
</template>
