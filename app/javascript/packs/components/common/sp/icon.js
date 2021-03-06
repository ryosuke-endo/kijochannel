import Vue from 'vue/dist/vue'
import iconMixins from '../../../mixins/icon'

export default Vue.extend({
  mixins: [iconMixins],
  methods: {
    showModal() {
      this.$emit('show')
    }
  },
  template: `
    <div class="c-icon__items c-margin-l-10">
      <i data="icon-item" class="fa fa-link c-icon-d-gray c-margin-r-10 text--s-lg c-icon__item" @click="showModal">
      </i>
    </div>`
})
