<template>
  <div :class="[ openModal ? 'fixed flex' : 'hidden', 'modal' ]">
    <div class="modal-background"></div>
    <div class="modal-wrapper shadow-lg">
      <div class="bg-blue flex items-center justify-between rounded-t-2xl p-5">
          <p v-if="!isUserLoggedIn" class="text-xl">{{ modalTitle }}</p>
          <p v-if="isUserLoggedIn" class="text-xl">{{ modalTitleLoggedIn }}</p>
          <button class="delete" aria-label="close" @click="closeModal">X</button>
      </div>
      <form @submit="checkForm" action="#" method="post">
        <section class="p-5 rounded-b-2xl bg-black_light">
          <div v-if="isUserLoggedIn">
            <div class="m-4">
              <input
                :class="[highlightNameWithError ? 'input border-red' : 'input']"
                type="text"
                placeholder="Nome do produto"
                name="nameName"
                v-model="name"
                @keyup="checkNameOnKeyUp(name)"
              />
              <p v-if="highlightNameWithError" class="text-red">{{ nameRequiredLabel }}</p>
            </div>
            <div class="m-4">
              <textarea
                class="input resize-none"
                type="text"
                placeholder="Descrição do produto"
                name="descriptionName"
                v-model="description"
              />
            </div>
            <div class="m-4">
              <input
                :class="[highlightPriceWithError ? 'input border-red' : 'input']"
                type="number"
                placeholder="Preço do produto"
                name="priceName"
                v-model="price"
                @keyup="checkPriceOnKeyUp(price)"
              />
              <p v-if="highlightPriceWithError" class="text-red">{{ priceRequiredLabel }}</p>
            </div>
          </div>
          <div v-if="!isUserLoggedIn" class="level">
            <div class="text-center">
              <div>
                <p class="title">{{ $store.state.userInfo.name }}</p>
                <p class="heading">Você não tem acesso a funcionalidade!</p>
              </div>
            </div>
          </div>
          <div class="m-4 flex justify-center">
            <button v-if="isUserLoggedIn" type="submit" class="rounded-xl p-3 bg-blue text-white w-full">{{ loginBtnLabel }}</button>
            <button v-if="!isUserLoggedIn" type="button" class="rounded-xl p-3 bg-grey_light text-grey_dark" @click="closeModal">{{ btnLoggedInLabel }}</button>
          </div>
        </section>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateProductModal',

  data () {
    return {
      modalTitle: 'Sem acesso',
      modalTitleLoggedIn: 'Editar Produto!',
      loginBtnLabel: 'Atualizar',
      nameRequiredLabel: 'Nome required',
      priceRequiredLabel: 'Preço required',
      btnLoggedInLabel: 'Fechar',
      name: this.$store.state.product?.name,
      description: this.$store.state.product?.description,
      price: this.$store.state.product?.price,
      highlightNameWithError: null,
      highlightPriceWithError: null
    };
  },

  computed: {
    getName () {
      return this.$store.state.product?.name
    },
    getPrice () {
      return this.$store.state.product?.price
    },
    getDescription () {
      return this.$store.state.product?.description
    },
    isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn;
    },
    openModal () {
      if (this.$store.getters.isEditProductModalOpen) {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    clean() {
      this.name = ''
      this.description = ''
      this.price = 0
      this.highlightNameWithError = false
      this.highlightPriceWithError = false
    },
    closeModal () {
      this.$store.commit('showEditProductModal', false);
    },
    async checkForm (e) {
      e.preventDefault();

      if (!this.name) {
        this.highlightNameWithError = true;
      } else {
        this.highlightNameWithError = false;
      }

      if (!this.price) {
        this.highlightPriceWithError = true;
      } else {
        this.highlightPriceWithError = false;
      }

      if (this.name && this.price) {
        this.highlightNameWithError = false;
        this.highlightPriceWithError = false;
        await this.$store.dispatch('editProduct', { product: { name: this.name, price: parseInt(this.price), description: this.description }, id: this.$store.state.product?.id})
        this.clean()
        this.closeModal()
        window.location.reload()
      }
    },
    checkNameOnKeyUp (nameValue) {
      if (nameValue) {
        this.highlightNameWithError = false;
      } else {
        this.highlightNameWithError = true;
      }
    },
    checkPriceOnKeyUp (priceValue) {
      if (priceValue) {
        this.highlightPriceWithError = false;
      } else {
        this.highlightPriceWithError = true;
      }
    }
  }
};
</script>

<style lang="scss">
  .fa-exclamation-circle {
    @apply text-red;
  }
  .fa-check {
    @apply text-green;
  }
</style>


