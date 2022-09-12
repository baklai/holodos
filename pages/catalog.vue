<template>
  <section class="holodos-start">
    <div class="holodos-start-item">
      <nuxt-link
        class="button holodos-start-btn"
        to="/category?catalog=holodos"
        style="align-items: center; display: inline-flex"
      >
        <img src="/img/logo-app.webp" alt="Холодос" height="32" />
        <span style="margin-left: 10px">Мій каталог</span>
      </nuxt-link>
      <nuxt-link
        class="button holodos-start-btn square_btn"
        to="/category?catalog=atb-market"
      >
        <img src="/svg/atb-logo.svg" alt="АТБ-Маркет" height="32" />
      </nuxt-link>
      <nuxt-link
        class="button holodos-start-btn square_btn"
        to="/category?catalog=silpo-market"
      >
        <img src="/svg/silpo-logo.svg" alt="Сільпо-Маркет" height="28" />
      </nuxt-link>
      <p>бот агрегує товари із бази користувачів та мереж супермаркетів</p>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    Telegram.WebApp.MainButton.hide();
    Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/');
    });
    Telegram.WebApp.BackButton.show();
  }
};
</script>

<style scoped>
.button {
  display: inline-block;
  padding: 0.5em 1em;
  margin: 10px auto;
  text-decoration: none;
  background: var(--main-color);
  color: #fff;
  border-radius: 4px;
  box-shadow: 0px 0px 0px 5px var(--main-color);
  border: dashed 1px #fff;
}

.button:hover {
  border: dotted 1px #fff;
}
</style>
