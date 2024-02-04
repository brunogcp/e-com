<template>
  <div :class="[detail ? 'detail' : '']" class="rounded-2xl shadow-custom bg-blue p-4 h-fill flex flex-col">
    <div>
      <div class="mb-4 flex flex-row justify-between">
        <button v-if="detail" class="rounded-xl p-3 text-white bg-green shadow-lg" @click="editProduct(product?.id)">Editar Produto</button>
        <button class="rounded-xl p-3 text-white bg-blue shadow-lg" @click="triggerFileInput">Upload Imagem</button>
        <input type="file" ref="fileInput" @change="uploadImage" class="hidden" />
        <button v-if="detail" class="rounded-xl p-3 text-white bg-red shadow-lg" @click="deleteProduct(product?.id)">Deletar Produto</button>
      </div>
      <div class="img-wrapper rounded-t-2xl flex flex-0 justify-center">
        <router-link
          :to="{
            name: 'Products-Detail',
            params: {
              id: product?.id,
            }
          }"
        >
          <img v-if="product.imageUrl" class="rounded-2xl w-[320px] h-[240px]" :src="image" alt="Placeholder image">  
          <img v-else class="rounded-2xl w-[320px] h-[240px]" src="https://bulma.io/images/placeholders/640x480.png" alt="Placeholder image">
        </router-link>
      </div>
    </div>
    <div class="text-wrapper p-4 flex-1 flex flex-col flex-wrap align-stretch justify-between items-stretch">
      <div class="flex items-center justify-between mb-3">
        <div class="media-content">
          <router-link
              :to="{
                name: 'Products-Detail',
                params: {
                  id: product?.id,
                }
              }"
            >
            <span :class="[detail ? 'text-3xl' : 'text-lg']" class="font-medium">{{ product?.name }}</span>
          </router-link>
        </div>
      </div>
      <div class="content is-clearfix">
        <p :class="[detail ? 'text-2xl' : 'text-base']">{{ product?.description }}</p>
        <div class="flex justify-center mt-4">
          <p class="text-3xl font-medium">
            <strong>{{ `R$ ${product?.price}` }}</strong>
          </p>
        </div>
        <div class="flex justify-between mt-5 items-center">
          <select class="p-2 border-2 rounded-2xl" @change="onSelectQuantity(product?.id)" v-model="selected">
            <option
              v-bind:key="quantity"
              v-for="quantity in quantityArray"
              :value="quantity"
            >
              {{ quantity }}
            </option>
          </select>
          <button class="rounded-xl p-3 text-white bg-green shadow-lg" v-if="!this.$store.getters.isAddedToCart(product?.id)" @click="addToCart(product?.id)">{{ addToCartLabel }}</button>
          <button class="rounded-xl p-3 text-white bg-red shadow-lg" v-if="this.$store.getters.isAddedToCart(product?.id)" @click="removeFromCart(product?.id, false)">{{ removeFromCartLabel }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'products',
  props: ['product', 'detail'],

  data () {
    return {
      addToCartLabel: 'Adicionar ao Carrinho',
      viewDetailsLabel: 'Details',
      removeFromCartLabel: 'Remove from cart',
      addToFavouriteLabel: 'Add to favourite',
      removeFromFavouriteLabel: 'Remove from favourite',
      selected: 1,
      quantityArray: [],
      image: 'https://bulma.io/images/placeholders/640x480.png'
    }
  },

  async mounted () {
    for (let i = 1; i <= 10; i++) {
      this.quantityArray.push(i);
    }

    if (this.$props.product?.quantity > 1) {
      this.selected = this.$props.product?.quantity;
    }
    await this.getImage()
  },

  computed: {
    isUserLogged () {
      return this.$store.getters.isUserLoggedIn;
    },
    imageUrl () {
      return import.meta.env.VITE_API_BASE_URL + '/' + this.product.imageUrl
    },
    getProduct () {
      return this.product
    }
  },

  unmounted () {
    URL.revokeObjectURL(this.image)
  },
  
  watch: {
    async getProduct () {
      await this.getImage()
    }
  },

  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async uploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;
      await this.$store.dispatch('uploadImage', { id: this.product.id, file });
      await this.getImage();
    },
    async getImage () {
      if (this.product.imageUrl) {
        const data = await this.$store.dispatch('getImage', this.imageUrl)
        if (data) {
          this.image = URL.createObjectURL(data.data);
        }
      }
    },
    addToCart (id) {
      let data = {
        id: id,
        name: this.product.name,
        quantity: this.selected,
        price: this.product.price,
      }
      this.$store.commit('addToCart', data);
    },
    async deleteProduct (id) {
      await this.$store.dispatch('deleteProduct', id);
      await this.$store.dispatch('getProductsList', id);
      this.$router.push('/products')
    },
    async editProduct (id) {
      this.$store.commit('showEditProductModal', true);
    },
    removeFromCart (id) {
      let data = {
        id: id,
        name: this.product.name,
        quantity: this.selected,
        price: this.product.price,
      }
      this.$store.commit('removeFromCart', data);
    },
    onSelectQuantity (id) {
      let data = {
        id: id,
        quantity: this.selected
      }
      this.$store.commit('quantity', data);
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail {
    @apply flex;
    @apply flex-col;
    @apply lg:flex-row;
    @apply m-5;
    @apply shadow-2xl;

    .img-wrapper {
      flex: 1;

      img {
        @apply lg:rounded-none;
        @apply lg:rounded-tl-2xl;
        @apply lg:rounded-bl-2xl;
      }
    }

    .text-wrapper {
      flex: 2;
    }
  }
</style>
