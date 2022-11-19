<!-- Form for creating comments (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'PostCommentForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/comments',
      method: 'POST',
      hasBody: true,
      fields: [
        {freetId: 'freetId', id: 'content', label: 'Content', value: ''}
      ],
      title: 'Post a comment',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully commented!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
