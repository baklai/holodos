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
          <img
            :src="item.img"
            :alt="item.title"
            loading="lazy"
            placeholder="../img/placeholder.png"
          />
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
          @click="delCounter(category, index)"
        >
          <span class="ripple-mask"><span class="ripple"></span></span>
        </button>
        <button
          class="holodos-item-incr-button button-item ripple-handler"
          @click="addCounter(category, index)"
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
  mounted() {
    window.Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/catalog');
    });

    window.Telegram.WebApp.MainButton.setParams({
      text: 'Відкрити список',
      color: '#ffc107',
      textColor: '#fff'
    });

    window.Telegram.WebApp.MainButton.onClick(() => {
      this.$router.push('/order-list');
    });

    window.Telegram.WebApp.BackButton.show();
  },
  computed: {
    // category() {
    //   return this.$route.params.id;
    // },
    // products() {
    //   return this.$store.getters.products(this.$route.params.id);
    // }
  },

  watch: {
    '$store.state.counter'(value) {
      if (value > 0) {
        window.Telegram.WebApp.MainButton.show();
      } else {
        window.Telegram.WebApp.MainButton.hide();
      }
    }
  },

  methods: {
    addCounter(category, index) {
      this.$store.commit('addCounter', { category, index });
    },

    delCounter(category, index) {
      this.$store.commit('delCounter', { category, index });
    },

    onModal(item) {
      this.$refs.modal.onModal(item);
    }
  }
};
</script>
