<template>
  <tiny-switch :show-text="true" v-model="value">
    <template #open>
      <span>是</span>
    </template>
    <template #close>
      <span style="position: relative">否</span>
    </template>
  </tiny-switch>
</template>

<script lang="jsx">
import { Switch } from '@opentiny/vue'

export default {
  components: {
    TinySwitch: Switch
  },
  data() {
    return {
      value: false
    }
  }
}
</script>
