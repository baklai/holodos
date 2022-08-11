<template>
  <section class="holodos-page holodos-items">
    <Modal ref="modal" />
    <div
      class="holodos-item"
      :class="item.orderedQuantity === 0 ? '' : 'selected'"
      v-for="(item, index) in products"
      :key="`product-${index}`"
    >
      <div
        class="holodos-item-counter"
        :style="item.orderedQuantity === 0 ? '' : 'animation-name: badge-incr'"
      >
        {{ item.orderedQuantity }}
      </div>

      <div class="holodos-item-photo" @click="onModal(item)">
        <picture class="holodos-item-lottie">
          <img :src="item.img | toBase64Img" />
        </picture>
      </div>
      <div class="holodos-item-label">
        <span class="holodos-item-price">
          {{ item.pricePer }} {{ item.priceTitle }}
        </span>
      </div>
      <div class="holodos-item-buttons">
        <button
          class="holodos-item-decr-button decr-btn button-item ripple-handler"
          @click="delOrderedQuantity(item)"
        >
          <span class="ripple-mask"><span class="ripple"></span></span>
        </button>
        <button
          class="holodos-item-incr-button button-item ripple-handler"
          @click="addOrderedQuantity(item)"
        >
          <span class="button-item-label"> ТАК </span>
          <span class="ripple-mask">
            <span
              class="ripple"
              :style="
                item.orderedQuantity === 0
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
    const products = await $axios.$get(`category/${route.params.id}`);
    return { products };
  },
  data() {
    return {
      orderedQuantity: null
    };
  },
  mounted() {
    Telegram.WebApp.BackButton.show();
    Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/category');
    });

    Telegram.WebApp.MainButton.setParams({
      text: 'Додати до списку',
      color: '#ffc107',
      textColor: '#fff'
    });
  },

  watch: {
    orderedQuantity(value) {
      if (value > 0) {
        Telegram.WebApp.MainButton.show();
        this.$store.commit('setCategory', {
          category: 'this.category.category',
          products: this.products.filter((item) => item.orderedQuantity > 0)
        });
      } else {
        Telegram.WebApp.MainButton.hide();
        this.$store.commit('setCategory', null);
      }
    }
  },

  filters: {
    toBase64Img(img) {
      return `data:image/webp;base64,${Buffer.from(img).toString('base64')}`;
    }
  },

  methods: {
    addOrderedQuantity(item) {
      ++this.orderedQuantity;
      ++item.orderedQuantity;
    },

    delOrderedQuantity(item) {
      --this.orderedQuantity;
      --item.orderedQuantity;
    },

    onModal(item) {
      this.$refs.modal.onModal(item);
    }
  }
};
</script>
