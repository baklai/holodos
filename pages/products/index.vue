<template>
  <section>
    <div class="holodos-start-item">
      <nuxt-link
        class="button holodos-start-btn"
        v-for="(item, index) in category"
        :key="item"
        :to="`/products/${index}`"
      >
        {{ item }}
      </nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    window.Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/');
    });
    window.Telegram.WebApp.BackButton.show();
  },
  computed: {
    category() {
      return this.$store.getters.category;
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
