<template>
  <section class="holodos-page holodos-items">
    <Modal ref="modal" />
    <div
      class="holodos-item"
      :class="item.counter === 0 ? '' : 'selected'"
      v-for="(item, index) in catalog.products"
      :key="`product-${index}`"
    >
      <div
        class="holodos-item-counter"
        :style="item.counter === 0 ? '' : 'animation-name: badge-incr'"
      >
        {{ item.counter }}
      </div>

      <div class="holodos-item-photo" @click="onModal(item)">
        <picture class="holodos-item-lottie">
          <img :src="item.img" loading="lazy" />
        </picture>
      </div>
      <div class="holodos-item-label">
        <span class="holodos-item-price">
          {{ item.price }} {{ item.priceTitle }}
        </span>
      </div>
      <div class="holodos-item-buttons">
        <button
          class="holodos-item-decr-button decr-btn button-item ripple-handler"
          @click="delCounter(item)"
        >
          <span class="ripple-mask"><span class="ripple"></span></span>
        </button>
        <button
          class="holodos-item-incr-button button-item ripple-handler"
          @click="addCounter(item)"
        >
          <span class="button-item-label"> ТАК </span>
          <span class="ripple-mask">
            <span
              class="ripple"
              :style="
                item.counter === 0
                  ? ''
                  : 'transform: translate3d(4.34375px, -4px, 0px) scale3d(1, 1, 1); opacity: 0; transition-duration: var(--ripple-end-duration, 0.2s);'
              "
            >
            </span>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  async asyncData({ $axios, route }) {
    const catalog = await $axios.$get(`catalog/${route.params.id}`);
    return { catalog };
  },
  data() {
    return {
      counter: null
    };
  },
  created() {
    window.Telegram.WebApp.BackButton.onClick(() => {
      if (this.counter > 0) this.pushHolodos();
      this.$router.push('/catalog');
    });

    window.Telegram.WebApp.MainButton.setParams({
      text: 'Відкрити список',
      color: '#ffc107',
      textColor: '#fff'
    });

    window.Telegram.WebApp.MainButton.onClick(() => {
      if (this.counter > 0) this.pushHolodos();
      this.$router.push('/order-list');
    });

    window.Telegram.WebApp.BackButton.show();
  },

  watch: {
    counter(value) {
      if (value > 0) {
        window.Telegram.WebApp.MainButton.show();
      } else {
        window.Telegram.WebApp.MainButton.hide();
      }
    }
  },

  methods: {
    pushHolodos() {
      const products = this.catalog.products.filter((item) => item.counter > 0);
      this.$store.commit('holodos', {
        category: this.catalog.category,
        products: products
      });
    },

    addCounter(item) {
      ++this.counter;
      ++item.counter;
    },

    delCounter(item) {
      --this.counter;
      --item.counter;
    },

    onModal(item) {
      this.$refs.modal.onModal(item);
    }
  }
};
</script>

<style scoped>
img {
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100px;
  background-image: url('/img/placeholder.png');
}
</style>
