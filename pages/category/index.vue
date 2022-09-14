<template>
  <section class="holodos-start-item">
    <nuxt-link
      class="button holodos-start-btn square_btn"
      v-for="category in categories"
      :key="category.title"
      :to="`/category/${category.id}`"
      style="align-items: center; display: inline-flex"
    >
      <img :src="category.icon | toBase64Img" width="28" height="28" />
      <span style="margin-left: 10px; margin: 0 auto">
        {{ category.title }}
      </span>
    </nuxt-link>
  </section>
</template>

<script>
export default {
  data() {
    return {
      categories: []
    };
  },

  async mounted() {
    Telegram.WebApp.MainButton.hide();
    Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/catalog');
    });
    Telegram.WebApp.BackButton.show();

    this.categories = await this.$axios.$get('category', {
      params: { catalog: this.$route.query.catalog }
    });
  },

  filters: {
    toBase64Img(img) {
      return `data:image/svg+xml;base64,${Buffer.from(img)}`;
    }
  }
};
</script>

<style scoped>
section {
  margin-left: 80px;
  margin-right: 80px;
}

.button {
  margin-top: 10px;
}
</style>
