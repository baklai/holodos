<template>
  <section class="holodos-start">
    <div class="holodos-start-item">
      <img
        :src="
          error.statusCode === 404
            ? '/img/404-error.webp'
            : '/img/500-error.webp'
        "
        alt="Помилка"
        width="280"
      />
      <h1>Упс! Щось пішло не так.</h1>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  mounted() {
    Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/');
    });
    Telegram.WebApp.BackButton.show();
    Telegram.WebApp.MainButton.hide();
  }
};
</script>

<style scoped>
h1 {
  font-size: 16px;
  color: var(--hint-color);
}
</style>
