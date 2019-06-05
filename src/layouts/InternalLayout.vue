<template>
  <q-layout view="hHh lpR lFf" class="bg-grey-3">
    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left"/>
        <q-toolbar-title>
          <q-avatar>
            <img src="~assets/logo.svg">
          </q-avatar>
          {{ $store.state.ui.currentTitle }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="left"
              side="left"
              bordered
              :mini="miniState"
              @mouseover="miniState = false"
              @mouseout="miniState = true">
      <q-list class="rounded-borders text-info q-mt-lg">
        <q-item
            v-for="item in menu"
            :key="item.label"
            clickable
            v-ripple
            :active="false"
            active-class="bg-info text-white"
            :to="{ name: item.route} ">
          <q-item-section avatar>
            <q-icon :name="item.icon"/>
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <div class="q-pa-lg">
        <router-view/>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'InternalLayout',
  data () {
    return {
      left: true,
      miniState: true
    }
  },
  computed: {
    menu () {
      let menu
      let dashboard = {
        label: this.$t('dashboard.title'),
        icon: 'dashboard',
        route: this.$router.names.dashboard
      }
      let content = {
        label: this.$t('content.title'),
        icon: this.$t('content.icon'),
        route: this.$router.names.content
      }
      let media = {
        label: this.$t('media.title'),
        icon: 'photo',
        route: this.$router.names.media
      }
      let users = {
        label: this.$t('users.title'),
        icon: 'supervised_user_circle',
        route: this.$router.names.users
      }
      let configuration = {
        label: this.$t('settings.title'),
        icon: 'settings_applications',
        route: this.$router.names.settings
      }
      let logout = {
        label: this.$t('login.logout'),
        icon: 'exit_to_app',
        route: this.$router.names.login
      }
      if (this.$store.state.session.user.profile === 'admin') {
        menu = [dashboard, content, media, users, configuration, logout]
      } else {
        menu = [content, media, logout]
      }
      return menu
    }
  }
}
</script>

<style>
</style>
