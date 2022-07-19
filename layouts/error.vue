<template>
  <section class="holodos-start">
    <div class="holodos-start-item">
      <img
        :src="
          error.statusCode === 404 ? '/img/404-error.png' : '/img/500-error.png'
        "
        alt="Помилка"
        width="280"
      />
      <h1>
        {{
          error.statusCode === 404
            ? 'Ой! Цю сторінку неможливо знайти.'
            : 'Ой! Внутрішня помилка сервера.'
        }}
      </h1>
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
    window.Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/');
    });
    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.MainButton.hide();
  }
};
</script>

<style scoped>
h1 {
  font-size: 16px;
  color: var(--hint-color);
}
</style>
