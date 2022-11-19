<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->
<template>
    <article
      class="comment"
    >
      <header>
        <div
          v-if="$store.state.username === comment.author"
          class="actions"
        >
          <button @click="deleteComment">
            🗑️ Delete
          </button>
        </div>
      </header>
      <textarea
        class="content"
      />
      <p>
        {{ comment.content }}
      </p>
      <p class="info">
        Posted at {{ comment.dateCreated }}
      </p>
      <div>
        
      </div>

      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </article>
  </template>
  
  <script>
//   import FreetComponent from "@/components/Freet/FreetComponent.vue";
  
  export default {
    name: 'CommentComponent',
    // components: {ReactionComponent},
    props: 
      // Data from the stored comment
      comment: {
        type: Object,
        required: true
      }
    },
    data() {
      return {

      };
    },
    methods: {
      deleteCommment() {
        /**
         * Deletes this comment.
         */
        const params = {
          method: 'DELETE',
          callback: () => {
            this.$store.commit('alert', {
              message: 'Successfully deleted comment!', status: 'success'
            });
          }
        };
        this.request(params);
      },
      async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/comments/${this.comment._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshComments');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    }
  };
  </script>
  
  <style scoped>
  .comment {
      border: 1px solid #111;
      padding: 20px;
      position: relative;
  }
  </style>
  