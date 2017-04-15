import Vue from 'vue/dist/vue'
import URI from 'urijs'
import axios from 'axios/dist/axios'

import modalMixins from '../mixins/modal.js'

import formError from '../components/common/form/error.js'
import fileUpload from '../components/sp/topic/file_upload.js'
import icon from '../components/sp/topic/icon.js'
import modal from '../components/common/form/modal.js'

axios.defaults.headers['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content')

$(function() {
  const commentForm = Vue.extend({
    mixins: [modalMixins],
    data() {
      return {
        comment: {
          name: '匿子さん',
          body: '',
          image: '',
          topic_id: '',
          errors: {
            count: 0,
            key: [],
            messages: []
          }
        }
      }
    },
    components: {
      'form-error': formError,
      'file-upload': fileUpload,
      'icon': icon,
      'modal': modal
    },
    methods: {
      getTopicId() {
        const url = URI(location.href)
        this.comment.topic_id = url.path().match(/\d.*$/)[0]
      },
      imageDelete() {
        this.comment.image = ''
      },
      addUrl(url) {
        const text = this.comment.body
        if(text.length === 0) {
          this.comment.body = url
        } else {
          this.comment.body = (`${text}\n\n${url}`)
        }
      },
      reply(id) {
        const text = this.comment.body
        const $position = $('[data-text-area]').offset()

        if(text.length === 0) {
          this.comment.body = `>>${id}`
        } else {
          this.comment.body = `${text}\n>>${id}`
        }

        window.scroll($position.left, $position.top);
      },
      submit() {
        self = this
        const comment_params = {
          comment: self.comment
        }
        const url = `/api${URI(location.href).path()}/comments`
        axios({
          method: "post",
          url: url,
          data: comment_params
        })
        .then(function(res) {
          location.href = `/topics/complete?id=${res.data.topic_id}`
        })
        .catch(function(error) {
          self.comment.errors.count = parseInt(Object.keys(error.response.data.errors).length)
          self.comment.errors.keys = error.response.data.errors
          self.comment.errors.messages = error.response.data.error_messages
        })
      }
    }
  })

  const vueDom = new commentForm().$mount('#vue')
})