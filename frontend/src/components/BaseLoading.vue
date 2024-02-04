<template>
  <div v-if="isLoading" class="overlay flex flex-row justify-center items-center">
    <div class="loader"></div>
  </div>
</template>

<script>

export default {
  computed: {
    isLoading () {
      return this.$store.state.loader.loading
    }
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99999;
}
.loader {
  width: 60px;
  height: 60px;
  border: 8px solid #edeaeb;
  border-radius: 50%;
  border-top: 8px solid #2D3753;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>