<template>
  <Product :detail="true" :product="product"/>
</template>

<script>
import Product from '../components/Products.vue'
export default {
  name: 'product_detail-id',

  components: {
    Product
  },

  validate ({ params }) {
    return /^\d+$/.test(params.id)
  },

  data () {
    return {
      product: {},
      selected: 1,
      quantityArray: []
    };
  },

  async mounted () {
    await this.$store.dispatch('getProduct', this.$route.params.id)
    this.product = this.$store.state.product;
    for (let i = 1; i <= 10; i++) {
      this.quantityArray.push(i);
    }
  },

  computed: {
    isAddedBtn () {
      return this.product.isAddedBtn;
    }
  },

  methods: {
    addToCart (id) {
      let data = {
        id: id,
        status: true
      }
      this.$store.commit('addToCart', id);
    },
    removeFromCart (id) {
      let data = {
        id: id,
        status: false
      }
      this.$store.commit('removeFromCart', id);
    },
    onSelectQuantity (id) {
      let data = {
        id: id,
        quantity: this.selected
      }
      this.$store.commit('quantity', data);
    },
    saveToFavorite (id) {
      let isUserLogged = this.$store.state.userInfo.isLoggedIn;

      if (isUserLogged) {
        this.$store.commit('addToFavourite', id);
      } else {
        this.$store.commit('showLoginModal', true);
      }
    },
    removeFromFavourite (id) {
      this.$store.commit('removeFromFavourite', id);
    }
  }
};
</script>

