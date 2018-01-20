import Vue from 'vue'
import I18N from './plugin/i18n'
import Action from './plugin/action'
import Binding from './plugin/binding'
import Schedule from './plugin/schedule'
import Notifier from './plugin/notifier'
import Variables from './plugin/variables'
import FileStorage from './plugin/storage'
import TitleBar from './component/titlebar'
import Switcher from './component/switcher'
import TodoView from './component/todo-view'
import SuperButton from './component/super-button'

if (process.env.NODE_ENV === 'production') {
  Vue.config.devtools = false
  Vue.config.productionTip = false
}

Vue.use(I18N)
Vue.use(Action)
Vue.use(Binding)
Vue.use(Schedule)
Vue.use(Notifier)
Vue.use(Variables)
Vue.use(FileStorage)

new Vue({
  el: '#main',
  components: {
    'titlebar': TitleBar,
    'todo-view': TodoView,
    'super-button': SuperButton,
    'switcher': Switcher,
  },
  data: {
    title: document.title,
    view: {
      source: 'todo',
      title: '',
      repeat: false,
      type: 'daily',
    },
    selecting: false,
    icon: '',
    handler() {
      this.selecting = !this.selecting
    },
  },
  methods: {
    bind(data) {
      if (!data.handler) return
      this.selecting = false
      let icon = null
      if (data.icon) {
        icon = this.icon
        this.icon = data.icon
      }
      const handler = this.handler
      this.handler = () => {
        data.handler()
        if (data.icon) {
          this.icon = icon
        }
        this.handler = handler
      }
    },
    trigger() {
      this.handler()
    },
    toggle(sheet) {
      this.$set(this, 'view', sheet)
    }
  },
  beforeCreate() {
    // custom stylesheet
    const stylesheet = this.$storage.rawdataSync('custom', 'css')
    if (stylesheet) {
      const element = document.createElement('style')
      element.appendChild(document.createTextNode(stylesheet))
      document.head.appendChild(element)
    }
  },
  created() {
    // custom script
    this.$storage.require('custom', init => init(this))
  }
})
