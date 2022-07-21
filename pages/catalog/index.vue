<template>
  <section>
    <div class="holodos-start-item">
      <nuxt-link
        class="button holodos-start-btn"
        v-for="item in catalog"
        :key="item.category"
        :to="`/catalog/${item._id}`"
      >
        {{ item.category }}
      </nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const catalog = await $axios.$get('catalog');
    return { catalog };
  },

  mounted() {
    window.Telegram.WebApp.MainButton.hide();
    window.Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/');
    });
    window.Telegram.WebApp.BackButton.show();
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
