<template>
  <main>
    <nuxt />
  </main>
</template>

<script>
export default {
  scrollToTop: true,
  mounted() {
    Telegram.WebApp.expand();
    function setThemeClass() {
      document.documentElement.className = Telegram.WebApp.colorScheme;
    }
    Telegram.WebApp.onEvent('themeChanged', setThemeClass);
    setThemeClass();
    Telegram.WebApp.MainButton.onClick(() => {
      if (Telegram.WebApp.MainButton.text === 'Добавить в список') {
        this.$store.commit('pushHolodos', this.$store.getters.catalog);
        this.$router.push('/order-list');
      } else {
        Telegram.WebApp.MainButton.hide();
      }
    });
  }
};
</script>

<style>
body {
  background-image: url('/img/bg-app.webp');
  background-attachment: fixed;
  background-position: center;
  background-repeat: repeat;
  background-size: contain;
}
</style>
