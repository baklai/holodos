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
      <span style="margin-left: 10px; margin: 0 auto">{{
        category.title
      }}</span>
    </nuxt-link>
  </section>
</template>

<script>
export default {
  async asyncData({ $axios, route }) {
    const categories = await $axios.$get('category', {
      params: { catalog: route.query.catalog }
    });
    return { categories };
  },

  mounted() {
    Telegram.WebApp.MainButton.hide();
    Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/catalog');
    });
    Telegram.WebApp.BackButton.show();
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
