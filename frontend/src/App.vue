<template>
  <div id="app" class="flex flex-col h-screen">
    <Header />
    <main class="flex-grow">
      <div v-if="breadcrumbs.length" class="m-4 pl-2">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center" v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.name">
              <router-link
                :to="{
                  name: breadcrumb.router,
                }"
              >
              <a :href="breadcrumb.link" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                <svg v-if="index === 0" class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                </svg>
                <svg v-else class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
                {{ breadcrumb.name }}
              </a>
              </router-link>
            </li>
          </ol>
        </nav>
      </div>
      <LoginModal />
      <SignupModal />
      <CreateProductModal />
      <EditProductModal />
      <CheckoutModal />
      <OrdersModalVue />
      <BaseLoading />
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import LoginModal from './components/LoginModal.vue';
import SignupModal from './components/SignupModal.vue';
import BaseLoading from './components/BaseLoading.vue';
import CreateProductModal from './components/CreateProductModal.vue'
import EditProductModal from './components/EditProductModal.vue';
import CheckoutModal from './components/CheckoutModal.vue';
import OrdersModalVue from './components/OrdersModal.vue';

// Usando ref para definir dados reativos
const breadcrumbs = ref([]);

// Usando useRoute para acessar a rota atual
const route = useRoute();

// Atualizando breadcrumbs antes do componente ser montado
// e em resposta a mudanças na rota
watch(route, (currentRoute) => {
  breadcrumbs.value = currentRoute.meta?.breadcrumbs ?? [];
}, { immediate: true });
</script>


<style lang="scss">
  body {
    @apply flex;
    @apply flex-col;
    height:100vh;
    margin:0;
  }

  .input {
    @apply block;
    @apply w-full;
    @apply px-4;
    @apply py-2;
    @apply text-xl;
    @apply font-normal;
    @apply bg-grey_dark;
    @apply bg-clip-padding;
    @apply border;
    @apply border-solid;
    @apply rounded;
    @apply transition;
    @apply ease-in-out;
    @apply m-0;
    @apply focus:bg-grey_dark;
    @apply focus:outline-none;
  }

  .modal {
    @apply top-0;
    @apply right-0;
    @apply left-0;
    @apply bottom-0;
    @apply z-50;
    @apply items-center;
    @apply justify-center;
  }

  .modal-background {
    @apply bg-grey_dark/80;
    @apply w-full;
    @apply h-full;
    @apply z-10;
    @apply fixed;
    @apply top-0;
  }

  .modal-wrapper {
    @apply bg-black_light;
    @apply z-20;
    @apply rounded-2xl;
    @apply w-96;
  }
</style>