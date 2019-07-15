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
            v-for="item in $store.getters['ui/menu']"
            :key="item.label"
            clickable
            v-ripple
            :active="false"
            active-class="bg-info text-white"
            :to="{ name: item.name, params: item.params} ">
          <q-item-section avatar>
            <q-icon :name="item.icon"/>
          </q-item-section>
          <q-item-section>{{ $t(item.label) }}</q-item-section>
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
  }
}
</script>

<style>
</style>
