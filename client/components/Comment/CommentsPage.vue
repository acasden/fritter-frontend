<!-- Default page that also displays freets -->

<template>
  <main>
    
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing Comment under Freet
            <FreetComponent
                :key="freet.id"
                :freet="freet"
            ></FreetComponent>
          </h2>
        </div>
      </header>
      <!-- UNDER HERE IS WHERE WE ACTUALLY VIEW THE FREETS -->
      <section
        v-if="$store.state.freets.length" 
      >
        <!-- <CommentComponent
          v-for="comment in $store.state.freets"
          :key="comment.id"
          :comment="comment"
        /> -->
      </section>
      <article
        v-else
      >
        <h3>No comments found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
// import CommentComponent from '@/components/Comment/CommentComponent.vue';
// import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';
// import GetCommentsForm from '@/components/Comment/GetCommentsForm.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'CommentPage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm}, 
  props: {
    freet: {
        type: Object,
        required: true
      }
  }
//   mounted() {
//     this.$refs.getCommentForm.submit();
//   }
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
</style>
