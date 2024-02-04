<template>
	<div :class="[ openModal ? 'fixed flex' : 'hidden', 'modal' ]">
		<div class="modal-background"></div>
		<div class="modal-wrapper">
			<div class="bg-blue flex items-center justify-between rounded-t-2xl p-5">
				<p class="text-xl">{{ modalTitle }}</p>
				<button class="delete" aria-label="close" @click="closeModal(false)">X</button>
			</div>
			<section class="p-5 rounded-b-2xl">
				<div v-if="!isCheckoutSection">
					<div class="box" v-for="product in products" :key="product.id">
						<div>
              <p>{{ product.name }}  {{ product.quantity > 0 ?  ` - Quantity: ${product.quantity}` : ''}}</p>
						  <p>R$ {{ product.price }}</p>
            </div>
            <button class="rounded-xl p-3 text-white bg-red" @click="removeFromCart(product)">{{ removeLabel }}</button>
					</div>
					<div v-if="products.length === 0">
						<p>{{ cartEmptyLabel }}</p>
					</div>
				</div>
				<div v-if="isCheckoutSection">
					<p>Compra realizada :-)</p>
				</div>
			</section>
			<div class="m-4">
				<button v-show="products.length > 0 && !isCheckoutSection" class="rounded-xl p-3 bg-blue text-white w-full" @click="onNextBtn">{{ buyLabel }}</button>
				<button v-if="isCheckoutSection" class="rounded-xl p-3 bg-blue text-white w-full" @click="closeModal(false)">{{ closeLabel }}</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'checkout',

	data () {
		return {
			modalTitle: 'Checkout',
			removeLabel: 'Remover',
			cartEmptyLabel: 'O carrinho tá vazio',
			closeLabel: 'Fechar',
			isCheckoutSection: false
		}
	},

	computed: {
			products () {
				return this.$store.state.cart;
			},
			openModal () {
				if (this.$store.getters.isCheckoutModalOpen) {
					return true;
				} else {
					return false;
				}
			},
			buyLabel () {
				let totalProducts = this.products.length,
						pricesArray = [],
						productLabel = '',
						finalPrice = '',
						quantity = 1;

				this.products.forEach(product => {

					if (product.quantity >= 1) {
						quantity = product.quantity;
					}

					pricesArray.push((product.price * quantity)); // get the price of every product added and multiply quantity
				});

				finalPrice = pricesArray.reduce((a, b) => a + b, 0); // sum the prices

				if (totalProducts > 1) {
					productLabel = 'produtos';
				} else {
					productLabel = 'produto';
				}
				return `Compar ${totalProducts} ${productLabel} por R$ ${finalPrice}`;
		},
		isUserLoggedIn () {
			return this.$store.getters.isUserLoggedIn;
		},
		getCartProducts () {
			return this.$store.state.cart.map((cart) => { return { productId: cart.id, quantity: cart.quantity } } )
		}
	},

	methods: {
		closeModal (reloadPage) {
			this.$store.commit('showCheckoutModal', false);

			if (reloadPage) {
				window.location.reload();
			}
		},
		removeFromCart (product) {
      let data = {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
      }
      this.$store.commit('removeFromCart', data);
    },
		onNextBtn () {
			if (this.isUserLoggedIn) {
				this.isCheckoutSection = true;
				this.$store.dispatch('createOrder', { products: this.getCartProducts });
				this.$store.commit('clearCart', false);
			} else {
				this.$store.commit('showCheckoutModal', false);
				this.$store.commit('showLoginModal', true);
			}
		},
		onPrevBtn () {
			this.isCheckoutSection = false;
		}
	}
}
</script>

<style lang="scss" scoped>
  .box {
    @apply flex;
    @apply justify-between;
    @apply mb-3;
  }
</style>
