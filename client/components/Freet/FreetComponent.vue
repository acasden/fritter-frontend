<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->
<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
      
      
        <!-- <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button> -->
        <!-- <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button> -->
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <div>
      
        
    <ReactionComponent
        :freet="freet"
    />
    </div>
    <!-- <button -->
      <!-- @click="ViewComments">View Comments</button> -->
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
import ReactionComponent from "@/components/Reaction/ReactionComponent.vue";

export default {
  name: 'FreetComponent',
  components: {ReactionComponent},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
    // comments:{ //Does this need to go here? prob not
    //   type:Object[], //array? probably
    //   required: false
    // }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      user_reactions: 0 //Value of current user's reactions
    };
  },
  methods: {
    async getUsersReaction(){
      const freetId = this.freet._id; //todo make sure this is good
      const username = store.state.username; 
      const params = {
        method: 'GET',
        message: 'Getting a specific users reaction on a specific freet',
        body: JSON.stringify({one:True, freetId} ),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      response = await fetch(`/api/reactions/?freetId=${fields.reactionId}`, {method: 'DELETE'})
      user_reactions = await response.json();
      this.user_reactions = user_reactions.reaction;
    },
    ReactUp(){
      console.log("React up");
      console.log("previous reaction: ", this.user_reactions);
      if(this.user_reactions==1){ //case deleting reaction
        this.deleteReaction();
      }
      else if(this.user_reactions==-1){ //case switching reactions
        this.changeReaction(1);
      }
      else{this.addReaction(1);} //case new reaction
      console.log("reaction should be added now");
    },
    ReactDown(){
      console.log("react down");
      if(this.user_reactions==-1){ //case deleting reaction -1 => 0
        this.deleteReaction();
      }
      else if(this.user_reactions==1){ //case changing reaction 1 => -1
        this.changeReaction();
      }
      else{this.addReaction(-1);} //case adding reaction 0 => -1
    },
    async changeReaction(){
      if(this.user_reactions==-1){
        //change from -1 to 1
      }
      else if(this.user_reactions==1){
        //change from 1 to -1
      }

    },
    async addReaction(value){
      console.log("addReaction value ", value);
      const freetId = this.freet._id;
      const params = {
        method: 'POST',
        message: 'Successfully changed from downvote to upvote!',
        body: JSON.stringify({freetId, value}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      console.log("params", params);
      this.reactRequest(params);
      this.user_reactions=1;
      
    },
    async deleteReaction(){
      response = fetch(`/api/reactions/${fields.reactionId}`, {method: 'DELETE'})
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted reaction!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
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
        console.log("fetching freets");
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async reactRequest(params) {
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
        console.log("fetching reactions");
        const r = await fetch(`/api/reactions/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
