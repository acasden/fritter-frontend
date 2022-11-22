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
        <div>

        </div>
      </header>
      <p
        class="content"
      >
        {{ freet.content }}
      </p>
      <p class="info">
        Posted at {{ freet.dateModified }}
      </p>

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
  
  export default {
    name: 'FreetForCommentComponent',
    props: {
      // Data from the stored freet
      freet: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        alerts: {}, // Displays success/error messages encountered during freet modification
      };
    },

  };
  </script>
  
  <style scoped>
  .freet {
      border: 1px solid #111;
      padding: 20px;
      position: relative;
      background-color: #FED2FE;
      border-radius: 15px;
  }

  .author{
    font-size:large;
    margin: 0%;
    
  }
  .content{
    font-size:large;
    font-weight: 100;
    text-size-adjust: .5;
}

  .info{
    font-size: large;
    font-weight: 100;
  }
  </style>
  