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
