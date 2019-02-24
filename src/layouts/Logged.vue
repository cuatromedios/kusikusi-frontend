<template>
  <q-layout view="lHh Lpr lFf">
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
</style>
