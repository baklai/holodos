<template>
  <section class="holodos-start">
    <div class="holodos-start-item">
      <img src="img/logo-app.webp" alt="Холодос" width="200" />
      <nuxt-link class="button holodos-start-btn" to="/category">
        Відкрити холодос
      </nuxt-link>
      <p>бот агрегує список товарів із бази користувачів</p>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    Telegram.WebApp.BackButton.hide();
    Telegram.WebApp.MainButton.hide();
  }
};
</script>

<style scoped>
img {
  margin-bottom: 15px;
}
</style>
