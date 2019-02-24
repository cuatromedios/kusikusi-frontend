import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

const list = {}
const names = {}
function fillNames (node) {
  for (let r = 0; r < node.length; r++) {
    if (node[r].name !== undefined) {
      list[node[r].name] = node[r]
      names[node[r].name] = node[r].name
    }
    if (node[r].children) {
      fillNames(node[r].children)
    }
  }
}
fillNames(routes)

const Router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes,
  list,
  names,
  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})
Router.names = names

export default Router
