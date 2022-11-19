<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <!-- <article
      class="reaction"
    > -->
       
      <div>
        <button
        @click="getUsersReaction"> This button is temporary </button>
        {{reactionId}}
        <i v-if="userReaction === 1">
        <button class = "darkButton"
        @click="ReactUp"> ⬆️ </button>
        </i>
      <i v-else>
            <button
        @click="ReactUp"> ⬆️ </button>
      </i>
      
      <i v-if="userReaction ===-1">
      <button class = "darkButton"
        @click ="ReactDown"> ⬇️ </button>
    </i>
    <i v-else>
            <button
        @click="ReactDown"> ⬇️ </button>
      </i>
        <i v-if="userReaction !== 0">(current reaction is {{userReaction}})</i>
      </div>
      
    <!-- </article> -->
  </template>
  
  <script>
  export default {
    name: 'ReactionComponent',
    props: {
      // Data from the stored freet
      freet: {
        type: Object,
        required: true
      }

    },
    data() {
      return {
        alerts: {}, // Displays success/error messages encountered during modification
        userReaction: 0, //Value of current user's reactions
        reactionId: "",
        allReactions: []
      };
    },
    mounted(){
        this.getUsersReaction()
    },
    //todo: mounting
    methods: {
      async getUsersReaction(){
        const freetId = this.freet._id; //todo make sure this is good
        const username = this.$store.state.username; 
        const params = {
          method: 'GET',
          message: 'Getting a specific users reaction on a specific freet',
          body: JSON.stringify({one:"true", freetId} ),
          callback: () => {
            this.$set(this.alerts, params.message, 'success');
            
            setTimeout(() => this.$get(this.alerts, params.message), 3000);
          }
        };
        const response = await fetch(`/api/reactions/?freetId=${this.freet._id}&&one=true`, {method: 'GET'});
        const userReaction = await response.json();
        // console.log(userReaction);
        this.userReaction = await userReaction.vote? parseInt(userReaction.vote) : 0;
        this.reactionId = await userReaction._id? userReaction._id : "";
        // console.log("reacionid", this.reactionId);
        // console.log("userreaction", this.userReaction);
      },
      ReactUp(){
        console.log("React up");
        console.log("previous reaction: ", this.userReaction);
        if(this.userReaction==1){ //case deleting reaction
          this.deleteReaction();
        }
        else if(this.userReaction==-1){ //case switching reactions
          this.changeReaction(1);
        }
        else{this.addReaction(1);} //case new reaction
        console.log("reaction should be added now");
      },
      ReactDown(){
        console.log("react down");
        if(this.userReaction==-1){ //case deleting reaction -1 => 0
          this.deleteReaction();
        }
        else if(this.userReaction==1){ //case changing reaction 1 => -1
          this.changeReaction(-1);
        }
        else{this.addReaction(-1);} //case adding reaction 0 => -1
      },
      async changeReaction(vote){
        console.log("changereaction value ", vote);
        const reactionId = this.reactionId;
        const response = await fetch('/api/reactions/', {method: 'PATCH', body: JSON.stringify({vote, reactionId}), headers: {'Content-Type': 'application/json'}});
        console.log(response);
        const r = await response.json();
        console.log(r);
        this.getUsersReaction() //update reaction value
      },
      async addReaction(vote){
        console.log("addReaction value ", vote);
        const freetId = this.freet._id;
        const params = {
          method: 'POST',
          message: 'Successfully changed from downvote to upvote!',
          body: JSON.stringify({freetId, vote}),
          callback: () => {
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        console.log("params", params);
        this.request(params);
        this.getUsersReaction() //update reaction value
      },
      async deleteReaction(){
        console.log("deleting reaction");
        // const response = fetch(`/api/reactions/${this.reactionId}`, {method: 'DELETE'})
        const response = await fetch(`/api/reactions/${this.reactionId}`, {method: 'DELETE'});
        console.log(response);
        const r = await response.json();
        console.log(r);
        console.log("should be deleted now");
        this.getUsersReaction();
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
          console.log("fetching reactions");
          const r = await fetch(`/api/reactions/?freetId=${this.freet._id}&&value=params.value`, options);
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
      
    }
  };
  </script>
  
  <style scoped>
  .reaction {
      padding: 20px;
      position: relative;
  }
  .darkButton{
    background-color: darkgray;
  }
  </style>
  