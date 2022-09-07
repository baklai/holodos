<template>
  <section class="holodos-start-item">
    <nuxt-link
      class="button holodos-start-btn square_btn"
      v-for="category in categories"
      :key="category.title"
      :to="`/category/${category.id}`"
    >
      {{ category.title }}
    </nuxt-link>
  </section>
</template>

<script>
export default {
  async asyncData({ $axios, route }) {
    const categories = await $axios.$get(`category?key=${route.query.key}`);
    return { categories };
  },

  mounted() {
    Telegram.WebApp.MainButton.hide();
    Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/catalog');
    });
    Telegram.WebApp.BackButton.show();
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
