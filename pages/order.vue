<template>
  <section class="holodos-page holodos-order-overview">
    <div class="holodos-block" style="margin-bottom: 14px">
      <div class="holodos-order-header-wrap">
        <img src="img/logo-app.webp" style="width: 60px; margin-right: 20px" />
        <div class="holodos-order-item-label">
          <div class="holodos-order-item-title">
            СПИСОК #{{ getRndInteger(1000000, 9999999) }}
          </div>
          <div class="holodos-order-item-text">
            Ідеальний список для покупок
          </div>
          <div class="holodos-order-item-description">@MyHolodosBot</div>
        </div>
      </div>
      <div class="holodos-order-items"></div>
    </div>

    <div class="holodos-block">
      <div class="holodos-order-header-wrap">
        <h2 class="holodos-order-header">Ваш список</h2>
        <nuxt-link
          class="button holodos-order-edit"
          to="/category"
          title="Редагувати список"
          style="cursor: pointer; font-size: 16px; color: var(--main-color)"
        >
          ...
        </nuxt-link>
      </div>

      <div class="holodos-order-items">
        <div v-for="(item, name) in products" :key="`order-${name}`">
          <template v-for="(product, index) in item">
            <div
              v-if="product.count > 0"
              class="holodos-order-item selected"
              :key="`order-${product.category}-${index}`"
            >
              <div class="holodos-order-item-photo">
                <picture class="holodos-item-lottie">
                  <img :src="product.img | toBase64Img" :alt="product.title" />
                </picture>
              </div>
              <div class="holodos-order-item-label">
                <div
                  class="holodos-order-item-title holodos-order-item-title-small"
                >
                  {{ product.title }}
                  <span class="holodos-order-item-counter">
                    {{ product.count }}x
                  </span>
                </div>
                <div class="holodos-order-item-description">
                  {{ name }}
                </div>
              </div>
              <div class="holodos-order-item-price" style="font-size: small">
                {{ product.pricePer }} {{ product.priceTitle }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="holodos-order-item selected">
        <div class="holodos-order-item-photo"></div>
        <div class="holodos-order-item-label">
          <div class="holodos-order-item-title">Усього:</div>
        </div>
        <div class="holodos-order-item-price-all">₴{{ price }}</div>
      </div>
    </div>

    <div class="holodos-text-field-wrap">
      <textarea
        class="holodos-text-field holodos-block"
        rows="1"
        v-model="comment"
        placeholder="Додати коментар…"
        style="overflow: hidden visible; overflow-wrap: break-word"
      ></textarea>
      <div class="holodos-text-field-hint">
        Будь-які особливі побажання, деталі тощо.
      </div>
    </div>
  </section>
</template>

<script>
export default {
  async asyncData({ store }) {
    const products = store.getters.products;
    return { products };
  },
  data() {
    return {
      comment: null
    };
  },
  mounted() {
    Telegram.WebApp.MainButton.setParams({
      text: 'Надіслати список',
      color: '#008000',
      textColor: '#fff'
    });

    Telegram.WebApp.MainButton.onClick(() => {
      if (Telegram.WebApp.MainButton.text === 'Надіслати список') {
        Telegram.WebApp.sendData(
          JSON.stringify({
            order: this.$store.getters.order,
            price: this.price,
            comment: this.getComment()
          })
        );
      }
    });

    Telegram.WebApp.BackButton.onClick(() => {
      this.$router.push('/category');
    });

    Telegram.WebApp.BackButton.show();
  },

  filters: {
    toBase64Img(img) {
      return `data:image/webp;base64,${Buffer.from(img).toString('base64')}`;
    }
  },

  computed: {
    price() {
      return this.$store.getters.price;
    }
  },

  methods: {
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getComment() {
      return this.comment;
    }
  }
};
</script>

<style scoped>
section {
  display: block;
}
</style>
