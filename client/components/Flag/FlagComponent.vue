<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->
<template>
    <article
      class="flag"
    >
        <div 
            v-if="flagged"
            class = "right_child">
             🚩 
        </div>
        <!-- <button @click ="isFlagged">See if flagged</button> -->

        <div 
            v-if="(show) "
            class = "content">
            {{freet.content}} <button @click = hideContent() class = "text_button"> Hide Freet. </button> 
        </div>
        <div 
            v-else-if="!flagged" 
            class = "content">
            <button @click = showContent() 
                class = "text_button"> 
                This Freet is hidden. Click here to view. 
            </button> 
        </div>
        <div
            v-else-if="flagged &&!show"
            class = "no_content">
            <button @click = showContent() 
                class = "text_button"> 
                This Freet is flagged as controversial. Click here to view anyways.
            </button> 
        </div>
    </article>
  </template>
  
  <script>
  
  export default {
    name: 'FlagComponent',
    props: {
      // Data from the stored freet
      freet: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        alerts: {}, // Displays success/error messages encountered during freet modification,
        flagged: false,
        flagId: "",
        flaggerId: "",
        show: true,
      };
    },
    mounted(){
        this.isFlagged()
    },
    methods: {
        async isFlagged(){
            console.log("isFlagged?");
            const freetId = this.freet._id;
            const response = await fetch(`/api/flags?freetId=${freetId}`);
            const r = await response.json();
            
            console.log("r", r);
            this.flagId = await r._id ? r._id : "";
            this.flagged = this.flagId === "" ? false: true;
            this.flaggerId = await r.FlaggerId ? r.FlaggerId : "";
            console.log( this.flagged, this.flagId, this.flaggerId);
            if (this.flagged){ this.show = false;}
            console.log("done");
        },
        showContent(){
            this.show = true;
        },
        hideContent(){
            this.show =false;
        }
        // async deleteManualFlag(){
        //     console.log("deletemanualflag");
        //     await fetch(`/api/flags/${this.flagId}`, {method: 'DELETE'});
        //     this.flaggerId = "";
        //     isFlagged();
        // },
        // addManualFlag(){
        //     if (!flagged){
        //         this.createManualFlag();
        //     }
        //     else{
        //         this.addManualFlagToFlag();
        //     }
        //     console.log("manual flag should be added now");
        // }

      
    }
  };
  </script>
  
  <style scoped>
  
  /* border-radius rounds corners, border is outline, padding gives space between content and border */
  .freet {
      border: 1px solid #111;
      border-radius: 15px;
      padding: 20px;
      position: relative;
  }
  .left_child{
    float: left;
    padding-left: 10px;
    padding-right:10px;
  }
  .right_child{
    float: right;
    padding-right: 10px;
  }
  .content{
    font-size: 0.5;
    font-weight: 100;
    margin:1%;
  }

  .text_button{
    border:0;
    font-size: 0.5;
    font-weight:100;
  }
  </style>
  