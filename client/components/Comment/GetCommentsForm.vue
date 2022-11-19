<!-- Form for getting comments from user (inline style) -->

<script>
// import InlineForm from '@/components/common/InlineForm.vue';

export default {
  props: {
    freet: {
        type: Object,
        required: true
      }
  },
  name: 'GetCommentsForm',
  mixins: [InlineForm],
  data() {
    return {comments: []};
  },
  methods: {
    async submit() {
      this.$store.commit('updateComments', [])
      const url = `/api/comments?freetId=${this.freet._id}`; //here we never filter comments, but only ever want the ones under a specific freet
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        // this.$store.commit('updateFilter', this.value);
        this.$store.commit('updateComments', res);
      } catch (e) {
        if (this.value === this.$store.state.filter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateFilter', null);
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshFreets');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.filter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
