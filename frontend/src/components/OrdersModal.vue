<template>
	<div :class="[ openModal ? 'fixed flex' : 'hidden', 'modal' ]">
		<div class="modal-background"></div>
		<div class="modal-wrapper">
			<div class="bg-blue rounded-t-2xl p-5">
				<div class="flex items-center justify-between">
					<p class="text-xl">{{ modalTitle }}</p>
					<button class="delete" aria-label="close" @click="closeModal(false)">X</button>
				</div>
				<div v-if="this.$store.state.userInfo.isAdmin" class="mt-4 flex flex-row justify-between">
					<button class="bg-grey_dark shadow-xl px-4 py-1 rounded-xl" @click="swapToMy">Meus Pedidos</button>
					<button class="bg-grey_dark shadow-xl px-4 py-1 rounded-xl" @click="swapToAll">Todos Os Pedidos</button>
				</div>
			</div>
			<section class="p-5 rounded-b-2xl max-h-[75vh] overflow-auto">
				<div v-if="type==='my'">
					<div class="box flex flex-col bg-blue p-4 rounded-xl" v-for="order in myOrders" :key="order.id">
						<div class="flex flex-row w-full justify-between">
              <p>Pedido: {{ order.id }}</p>
							<p>Status: {{ order.status }}</p>
            </div>
						<div class="flex flex-row w-full justify-between">
						  <p>R$ {{ order.total }}</p>
							<p>Itens: {{ order.products.length }}</p>
						</div>
					</div>
				</div>
				<div v-else>
					<div class="box flex flex-col bg-blue p-4 rounded-xl" v-for="order in orders" :key="order.id">
						<div class="flex flex-row w-full justify-between">
              <p>Pedido: {{ order.id }}</p>
							<p>Status: {{ order.status }}</p>
            </div>
						<div class="flex flex-row w-full justify-between">
						  <p>R$ {{ order.total }}</p>
							<p>Itens: {{ order.products.length }}</p>
						</div>
						<div class="grid grid-cols-2 gap-4 mt-4">
							<button class="rounded-xl p-3 text-white bg-green" @click="sendStatus(order.id, 'confirmed')">Confirmar</button>
							<button class="rounded-xl p-3 text-white bg-red" @click="sendStatus(order.id, 'canceled')">Cancelar</button>
							<button class="rounded-xl p-3 text-white bg-gold" @click="sendStatus(order.id, 'sent')">Enviar</button>
							<button class="rounded-xl p-3 text-white bg-grey_dark" @click="sendStatus(order.id, 'delivered')">Receber</button>
						</div>
					</div>
				</div>
			</section>
			<div class="m-4">
				<button class="rounded-xl p-3 bg-blue text-white w-full" @click="closeModal(true)">{{ closeLabel }}</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Orders',

  data() {
    return {
      type: 'my',
      modalTitle: 'Meus Pedidos',
      cartEmptyLabel: 'Sua lista de pedidos está vazia',
      closeLabel: 'Fechar',
      isCheckoutSection: false,
    };
  },

  computed: {
    myOrders() {
      return this.$store.state.myOrders;
    },
    orders() {
      return this.$store.state.orders;
    },
    openModal() {
      if (this.$store.getters.isOrdersModalOpen) {
				this.getOrders()    
        return true;
      } else {
        return false;
      }
    },
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    },
  },

  methods: {
		getOrders() {
			if (this.$store.state.userInfo.isLoggedIn) {
				this.$store.dispatch('getMyOrders');
				if (this.$store.state.userInfo.isAdmin) {
					this.$store.dispatch('getOrders');
				}
			}
		},
		async sendStatus(id, status) {
      await this.$store.dispatch('updateStatus', {id, status: {status}});
			this.getOrders()
		},
    closeModal() {
      this.$store.commit('showOrdersModal', false);
    },
    swapToMy() {
      this.type = 'my';
      this.modalTitle = 'Meus Pedidos';
    },
    swapToAll() {
      this.type = 'all';
      this.modalTitle = 'Todos os Pedidos';
    },
  },
};
</script>

<style lang="scss" scoped>
  .box {
    @apply flex;
    @apply justify-between;
    @apply mb-3;
  }
</style>

<style lang="scss" scoped>
  .box {
    @apply flex;
    @apply justify-between;
    @apply mb-3;
  }
</style>
