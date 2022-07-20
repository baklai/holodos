<template>
  <section class="holodos-start">
    <div class="holodos-start-item">
      <img src="img/logo-app.png" alt="Холодос" />
      <nuxt-link class="button holodos-start-btn" to="/catalog">
        Відкрити
      </nuxt-link>
      <p>бот агрегує список продуктів із мережі маркетів АТБ</p>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    window.Telegram.WebApp.BackButton.hide();
    window.Telegram.WebApp.MainButton.hide();
  }
};
</script>

<style scoped>
img {
  width: 200px;
  margin-bottom: 15px;
}
</style>
