
<template>
  <app-header/>
  <RouterView />
  <app-footer/>
</template>

<script>
import AppHeader from './components/layouts/AppHeader.vue'
import AppFooter from './components/layouts/AppFooter.vue'

import "../public/assets/css/bootstrap.min.css"
import "../public/assets/fontawesome-free/css/all.min.css"
import "../public/assets/js/jquery.min.js"

import "../public/assets/js/cdn.jsdelivr.net_npm_bootstrap@5.0.0-beta3_dist_js_bootstrap.bundle.min.js"
import "../public/assets/js/bootstrap.min.js"

export default {
  name: "App",
  components: {
    AppHeader,
    AppFooter
  }
}
</script>
<style>
 * {
  margin-top: 0px !important;
 }
</style>
