<!-- Default page that also displays freets -->

<template>
    <article
      class="comments"
    >
  <main>
    
    <section>
        <section>
      <header>
        <div class="left">
          <h2>
            Viewing Comment under Freet
            <FreetForCommentComponent
            :key="freet.id"
            :freet="freet"
            />
            
          </h2>
        </div>
        
      </header>
    </section>
    content is {{content}}
    <section class= "form">
      Post New Comment
      <textarea v-model="content">
          
      </textarea>
      <button @click="postComment">Post Comment</button>

      <!-- <button @click ="submitComment"
      type="submit"
    >
      Post Comment
    </button> -->
    </section >
      <!-- UNDER HERE IS WHERE WE ACTUALLY VIEW THE FREETS -->
      <section 
      >
            <!-- <CommentComponent
                :freetId="$router.params.freetId"
            ></CommentComponent> -->
        <CommentComponent
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
        />
      </section>

    </section>
  </main>
  </article>
</template>

<script>
import CommentComponent from '@/components/Comment/CommentComponent.vue';
import PostCommentForm from '@/components/Comment/PostCommentForm.vue';
// import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';
// import GetCommentsForm from '@/components/Comment/GetCommentsForm.vue';
import FreetForCommentComponent from '@/components/Comment/FreetForCommentComponent.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
    name: 'CommentsPage',
    components: {FreetComponent, CommentComponent, FreetForCommentComponent, PostCommentForm}, 
    props: {
    // freet: {
    //     type: Object,
    //     required: true
    //     }
    },
    data() {
        return {
            comments: [],
            freet: {},
            content: ""
        }
    },

    created() {
        this.getComments();
    },
    mounted(){
        this.getFreet();
    },
    methods: {
        async postComment(){
          try{
          console.log("posting comment", this.content);
          const freetId = this.freet._id;
          const fields = {content: this.content, freetId};
          console.log(fields);
          const response = await fetch('/api/comments', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
          console.log("response", response);

          if (!response.ok) {
                // If response is not okay, we throw an error and enter the catch block
                console.log("okay");
                const res = await response.json();
                throw new Error(res.error);
                
                }
          this.content="";
          this.getComments();
          }catch (e) {
            console.log("caught", e);
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }   

          
        },
        async getComments(){
            try {
                console.log("HERE", this.$route.params);
                console.log(this.$route.params.freet);
                const r = await fetch(`/api/comments/?freetId=${this.$route.params.freetId}`);
                if (!r.ok) {
                // If response is not okay, we throw an error and enter the catch block
                const res = await r.json();
                throw new Error(res.error);
                }
                const comment = await r.text();
                this.comments =JSON.parse(comment);


        } catch (e) {
            console.log("caught", e);
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }   
    },
    async getFreet(){
        try {
            console.log("attempting to get freet")
            const freetId = this.$route.params.freetId;
            const r = await fetch(`/api/freets/?freetId=${this.$route.params.freetId}`);
            console.log(r);
            if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
            }
            const freet = await r.text();
            console.log("freet", freet);
            this.freet = JSON.parse(freet);
            }
            catch (e) {
            console.log("caught", e);
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }   
        console.log("we now set this.freet to be", this.freet)

    }
        }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  background-color: #FED2FE;
  border-radius: 15px;
}


.content{
    text-size-adjust: .5;
}

.comment_poster{
  border: 1px;
}

/* .comments{
    font-size: medium;
} */
</style>
