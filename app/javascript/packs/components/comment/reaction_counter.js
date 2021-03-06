import Vue from 'vue/dist/vue'
import { mapState } from 'vuex/dist/vuex'
import reactionMixins from './../../mixins/reaction.js'

export default Vue.extend({
  mixins: [reactionMixins],
  props: {
    reactionable_id: {
      type: String
    },
    type: {
      type: String
    }
  },
  methods: {
    filterIcons() {
      const self = this
      if (self.type === "Topic") {
        return self.icons.topic.order.map(function(id) {
          return self.icons.topic[id]
        })
      } else {
        if (self.icons.comment[self.reactionable_id].order === undefined) {
          return self.icons.comment[self.reactionable_id]
        }
        return self.icons.comment[self.reactionable_id].order.map(function(id) {
          return self.icons.comment[self.reactionable_id][id]
        })
      }
    },
    isReactioned(icon) {
      if(typeof(icon) !== "object") {
        return "none"
      }
      const ids = this.type === "Topic" ?
        this.icons.topic.user_reactioned_ids : this.icons.comment[this.reactionable_id].user_reactioned_ids
      if (ids === undefined) {
        return
      }
      if (ids.indexOf(icon.id) >= 0) {
        return "is-active"
      }
    },
    reactionCount(icon) {
      if(typeof(icon) !== "object") {
        return
      }
      const count = this.type === "Topic" ?
        this.icons.topic[icon.id].length : this.icons.comment[this.reactionable_id][icon.id].length
      return count
    },
  },
  computed: mapState([
    'icons',
    'visiable',
    'errorReaction'
  ]),
  template: `
  <div class="c-container c-flex c-flex__wrap" v-if="visiable">
    <div v-for="icon in filterIcons()" class="p-emoji__container c-flex c-border c-border-r-5" :class="isReactioned(icon[0])" @click="submit(icon[0])">
      <div :class="spriteClass(icon[0])">
      </div>
      <div class="p-emoji__counter">
        {{reactionCount(icon[0])}}
      </div>
    </div>
  </div>
  `
})
