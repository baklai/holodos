<template>
  <main>
    <nuxt />
  </main>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.BackButton.hide();
    window.Telegram.WebApp.MainButton.hide();

    function setThemeClass() {
      document.documentElement.className = Telegram.WebApp.colorScheme;
    }
    Telegram.WebApp.onEvent('themeChanged', setThemeClass);
    setThemeClass();
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
