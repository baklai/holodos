<template>
  <main>
    <nuxt />
  </main>
</template>

<script>
export default {
  scrollToTop: true,
  mounted() {
    window.Telegram.WebApp.expand();
    function setThemeClass() {
      document.documentElement.className = Telegram.WebApp.colorScheme;
    }
    Telegram.WebApp.onEvent('themeChanged', setThemeClass);
    setThemeClass();

    window.Telegram.WebApp.MainButton.onClick(() => {
      if (window.Telegram.WebApp.MainButton.text === 'Додати до списку') {
        this.$store.commit('pushHolodos', this.$store.getters.catalog);
        this.$router.push('/order-list');
      } else {
        window.Telegram.WebApp.MainButton.hide();
      }
    });
  }
};
</script>

<style>
body {
  background-image: url('/img/bg-app.png');
  background-attachment: fixed;
  background-position: center;
  background-repeat: repeat;
  background-size: contain;
}
</style>
