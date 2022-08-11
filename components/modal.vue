<template>
  <div class="holodos-modal" v-if="modal" @click="modal = false">
    <div class="holodos-modal-content">
      <div class="holodos-modal-card">
        <img :src="item.img | toBase64Img" :alt="item.title" loading="lazy" />
        <div class="holodos-modal-container">
          <h3>{{ item.title }}</h3>
          <p>{{ item.pricePer }} {{ item.priceTitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modal: false,
      item: null
    };
  },
  filters: {
    toBase64Img(img) {
      return `data:image/webp;base64,${Buffer.from(img).toString('base64')}`;
    }
  },
  methods: {
    onModal(item) {
      this.item = item;
      this.modal = true;
    }
  }
};
</script>

<style scoped>
.holodos-modal {
  position: fixed;
  z-index: 999;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0, 0.2);
}

.holodos-modal-content {
  background-color: var(--block-bg-color);
  animation-name: modal-zoom;
  animation-duration: 0.6s;
  margin: auto;
  padding: 10px;
  /* color: #ffffff; */
  /* border: 1px solid #888; */
  max-width: 280px;
  border-radius: 15px;
  /* background-color: #f8a917; */
}

.holodos-modal-card {
  text-align: center;
}

.holodos-modal-container {
  padding: 2px 16px;
}

.holodos-modal-card img {
  width: 90%;
}

@keyframes modal-zoom {
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
}
</style>
