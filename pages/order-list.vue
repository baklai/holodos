<template>
  <section class="holodos-page holodos-order-overview">
    <div class="holodos-block" style="margin-bottom: 14px">
      <div class="holodos-order-header-wrap">
        <img
          src="img/logo-app.png"
          alt=""
          style="width: 60px; margin-right: 20px"
        />
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
          to="/products"
          title="Редагувати список"
          style="cursor: pointer; font-size: 16px"
        >
          ...
        </nuxt-link>
      </div>

      <div class="holodos-order-items">
        <div v-for="category in holodos" :key="`order-${category.category}`">
          <template v-for="(item, index) in category.products">
            <div
              v-if="item.counter > 0"
              class="holodos-order-item selected"
              :key="`order-${item.category}-${index}`"
            >
              <div class="holodos-order-item-photo">
                <picture class="holodos-item-lottie">
                  <img :src="item.img" :alt="item.title" />
                </picture>
              </div>
              <div class="holodos-order-item-label">
                <div
                  class="holodos-order-item-title holodos-order-item-title-small"
                >
                  {{ item.title }}
                  <span class="holodos-order-item-counter">
                    {{ item.counter }}x
                  </span>
                </div>
                <div class="holodos-order-item-description">
                  {{ category.category }}
                </div>
              </div>
              <div class="holodos-order-item-price" style="font-size: small">
                {{ item.price }} {{ item.priceTitle }}
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
  data() {
    return {
      comment: null
    };
  },
  mounted() {
    window.Telegram.WebApp.MainButton.setParams({
      text: 'Надіслати список',
      color: '#008000',
      textColor: '#fff'
    });

    window.Telegram.WebApp.MainButton.onClick(() => {
      const products = [];
      this.holodos.forEach((el) => {
        const result = el.products.filter((item) => item.counter > 0);
        if (result.length > 0) {
          result.forEach((val) => {
            products.push({
              title: val.title,
              counter: val.counter,
              price: val.price,
              priceTitle: val.priceTitle
            });
          });
        }
      });
      const resList = {
        products: products,
        comment: this.comment,
        price: this.price
      };
      window.Telegram.WebApp.sendData(JSON.stringify(resList));
    });

    window.Telegram.WebApp.BackButton.show();
  },

  computed: {
    price() {
      let price = 0;
      this.$store.getters.holodos.forEach((el) => {
        const result = el.products.filter((item) => item.counter > 0);
        if (result.length > 0) {
          result.forEach((val) => {
            price += val.counter * val.price;
          });
        }
      });
      return price.toFixed(2);
    },

    holodos() {
      return this.$store.getters.holodos;
    }
  },
  methods: {
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
};
</script>

<style scoped>
section {
  display: block;
}
</style>
