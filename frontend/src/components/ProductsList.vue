<template>
  <div class="m-5 mb-14">
    <div class="flex flex-wor justify-end">
      <button class="rounded-xl p-3 m-4 text-white bg-green shadow-lg" v-if="this.$store.state.userInfo.isAdmin" @click="showCreateProductModal">Adicionar Produto</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-[20rem]">
      <div v-for="product in products" :key="product.id">
        <Products :detail="false" :product="product" />
      </div>
    </div>
    <div class="text-center" v-if="products.length === 0">
      <h2 class="text-2xl">{{ noProductLabel }}</h2>
    </div>
  </div>
</template>

<script>
import Products from './Products.vue';
import { getByTitle } from '../assets/filters';

export default {
  name: 'productsList',

  components: {
    Products
  },

  data () {
    return {
      id: '',
      noProductLabel: 'No product found'
    };
  },

  mounted () {
    this.$store.dispatch('getProductsList')
  },

  computed: {
    products () {
      const {
        products,
        userInfo: {
          hasSearched
        }
      } = this.$store.state

      if (hasSearched) {
        return this.getProductByTitle();
      } else {
        return products;
      }
    }
  },

  methods: {
    showCreateProductModal () {
      this.$store.commit('showCreateProductModal', true);
    },
    async getProductByTitle () {
      const {
        products,
        userInfo: {
          productTitleSearched
        }
      } = this.$store.state

      return getByTitle(products, productTitleSearched);
    }
  }

};
</script>
