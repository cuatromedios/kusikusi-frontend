<template>
  <q-layout view="lHh Lpr lFf" class="logged-layout">
    <q-layout-header class="no-shadow">
      <q-toolbar
        color="white"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          v-if="!leftDrawerOpen"
          color="faded"
        >
            <q-icon name="fa fa-bars" />
        </q-btn>

        <q-toolbar-title>
          <h1 class="no-margin text-dark">{{ $t('general.title') }}</h1>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      :width="200"
      class="no-shadow"
      v-model="leftDrawerOpen"
      :content-class="($q.theme === 'mat' ? 'bg-white' : '') + ' no-shadow'"
    >
      <q-list
        no-border
        link
        inset-delimiter
        class="no-margin no-padding"
      >
        <q-list-header class="bg-white relative-position logo">
          <img alt="Kusikusi logo" src="~assets/logo.svg">
          <q-btn
                  flat
                  dense
                  round
                  @click="leftDrawerOpen = !leftDrawerOpen"
                  aria-label="Menu"
          >
            <q-icon name="fa fa-caret-left" class="gt-md" />
          </q-btn>
        </q-list-header>
        <q-item @click.native="$router.push('/dashboard')">
          <q-item-side icon="fa fa-tachometer-alt" />
          <q-item-main :label="$t('layout.dashboard')"/>
        </q-item>
        <q-item @click.native="$router.push('/content/edit/')">
          <q-item-side icon="fa fa-list" />
          <q-item-main :label="$t('layout.content')"  />
        </q-item>
        <q-item @click.native="$router.push('/media')">
          <q-item-side icon="fa fa-image" />
          <q-item-main :label="$t('layout.media')" />
        </q-item>
        <q-item @click.native="$router.push('/users')">
          <q-item-side icon="fa fa-users" />
          <q-item-main :label="$t('layout.users')" />
        </q-item>
        <q-item @click.native="$router.push('/config')">
          <q-item-side icon="fa fa-cog" />
          <q-item-main :label="$t('layout.configuration')" />
        </q-item>
        <q-item @click.native="$router.push('/login')">
          <q-item-side icon="fa fa-sign-out-alt" />
          <q-item-main :label="$t('layout.logout')" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container class="bg-light">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'LayoutInside',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      drawer: null
    }
  },
  methods: {
    openURL
  }
}
</script>

<style lang="stylus">
  @import '~variables'
  $header-height = 4rem
  .logged-layout
    .q-toolbar
      height: $header-height
      h1
        font-size: ($header-height / 2)
    .q-layout-header
    .q-layout-drawer
      .q-list
        .q-list-header
          padding: ($header-height * .1) 0
          text-align center
          height: ($header-height)
          border-width 0 1px 1px 0
          border-color $light
          border-style solid
          @media all and (min-width: $sizes.lg)
            .q-btn
              right ($header-height / -4)
              top ($header-height / 4)
              position absolute
              .q-icon
                font-size ($header-height / 1.25)
                color white
                background-color $light
                width ($header-height / 2)
                height ($header-height / 2)
                border-radius: ($header-height / 4)
          @media all and (max-width: $sizes.lg)
            .q-btn
              right 0
              top 0
              position absolute
              .q-icon
                font-size: ($header-height / 4)
                color: white
          img
            height ($header-height * .8)
            width auto;
            max-width ($header-height * 3)
            display block
            margin 0 auto
      .q-item
        color $dark
        font-size ($header-height / 4)
        padding ($header-height * .2)
        .q-icon
          color $faded
          background-color rgba(255, 255, 255, 0.33)
          width ($header-height / 3)
          height ($header-height / 3)
          border-radius ($header-height / 4)
        .q-item-icon
          font-size 1rem
</style>
