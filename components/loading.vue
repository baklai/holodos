<template lang="html">
  <div class="sk-grid" v-if="loading">
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    };
  },

  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.sk-center {
  margin: auto;
}

.sk-grid {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
}
.sk-grid-cube {
  width: 33.33%;
  height: 33.33%;
  background-color: #f8a917;
  float: left;
  animation: sk-grid 1.3s infinite ease-in-out;
}
.sk-grid-cube:nth-child(1) {
  animation-delay: 0.2s;
}
.sk-grid-cube:nth-child(2) {
  animation-delay: 0.3s;
}
.sk-grid-cube:nth-child(3) {
  animation-delay: 0.4s;
}
.sk-grid-cube:nth-child(4) {
  animation-delay: 0.1s;
}
.sk-grid-cube:nth-child(5) {
  animation-delay: 0.2s;
}
.sk-grid-cube:nth-child(6) {
  animation-delay: 0.3s;
}
.sk-grid-cube:nth-child(7) {
  animation-delay: 0s;
}
.sk-grid-cube:nth-child(8) {
  animation-delay: 0.1s;
}
.sk-grid-cube:nth-child(9) {
  animation-delay: 0.2s;
}

@keyframes sk-grid {
  0%,
  70%,
  100% {
    transform: scale3D(1, 1, 1);
  }
  35% {
    transform: scale3D(0, 0, 1);
  }
}
</style>
