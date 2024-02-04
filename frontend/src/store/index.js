import { createStore } from 'vuex'
import { useToast } from 'vue-toastification'
import { AxiosError } from 'axios'

import { axiosAdapter } from '../routers/axiosAdapter'
import { loader } from './loader'
import router from '../routers'

const toast = useToast()

class VuexStore extends createStore {
  constructor (config) {
    super(config)
    this.$axios = axiosAdapter
    this.$toast = toast
    this.$router = router
  }
}

export const store = new VuexStore({
  modules: {
    loader,
  },
  state () {
    return {
      cart:  [],
      product: null,
      products: [],
      orders: [],
      myOrders: [],
      userInfo: {
        isAdmin: false,
        isLoggedIn: false,
        isSignedUp: false,
        hasSearched: false,
        name: '',
        productTitleSearched: ''
      },
      systemInfo: {
        openLoginModal: false,
        openSignupModal: false,
        openCheckoutModal: false,
        openCreateProductModal: false,
        openEditProductModal: false,
        openOrdersModal: false
      }
    }
  },
  getters: {
    productsAdded: state => {
      return state.products.filter(el => {
        return el.isAddedToCart;
      });
    },
    productsAddedToFavourite: state => {
      return state.products.filter(el => {
        return el.isFavourite;
      });
    },
    getProductById: state => id => {
      return state.products.find(product => product.id == id);
    },
    isAddedToCart: state => id => {
      return !!state.cart.find((cart) => cart.id === id)
    },
    isUserLoggedIn: state => {
      return state.userInfo.isLoggedIn;
    },
    isUserSignedUp: state => {
      return state.userInfo.isSignedUp;
    },
    getUserName: state => {
      return state.userInfo.name || sessionStorage.getItem('name');
    },
    isLoginModalOpen: state => {
      return state.systemInfo.openLoginModal;
    },
    isSignupModalOpen: state => {
      return state.systemInfo.openSignupModal;
    },
    isCheckoutModalOpen: state => {
      return state.systemInfo.openCheckoutModal;
    },
    isCreateProductModalOpen: state => {
      return state.systemInfo.openCreateProductModal;
    },
    isEditProductModalOpen: state => {
      return state.systemInfo.openEditProductModal;
    },
    isOrdersModalOpen: state => {
      return state.systemInfo.openOrdersModal;
    },
    quantity: state => {
      return state.products.quantity;
    }
  },
  mutations: {
    addToCart: (state, data) => {
      state.cart.push(data)
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    removeFromCart: (state, data) => {
      state.cart.forEach((cart, index) => {
        if (cart.id === data.id) {
          state.cart.splice(index, 1)
        }
      });
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    clearCart: (state) => {
      state.cart = []
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    isUserLoggedIn: (state, isUserLoggedIn) => {
      state.userInfo.isLoggedIn = isUserLoggedIn;
    },
    isUserSignedUp: (state, isSignedUp) => {
      state.userInfo.isSignedUp = isSignedUp;
    },
    setHasUserSearched: (state, hasSearched) => {
      state.userInfo.hasSearched = hasSearched;
    },
    setUserName: (state, name) => {
      state.userInfo.name = name;
    },
    setProductTitleSearched: (state, titleSearched) => {
      state.userInfo.productTitleSearched = titleSearched;
    },
    showLoginModal: (state, show) => {
      state.systemInfo.openLoginModal = show;
    },
    showSignupModal: (state, show) => {
      state.systemInfo.openSignupModal = show;
    },
    showCheckoutModal: (state, show) => {
      state.systemInfo.openCheckoutModal = show;
    },
    showCreateProductModal: (state, show) => {
      state.systemInfo.openCreateProductModal = show;
    },
    showEditProductModal: (state, show) => {
      state.systemInfo.openEditProductModal = show;
    },
    showOrdersModal: (state, show) => {
      state.systemInfo.openOrdersModal = show;
    },
    addToFavourite: (state, id) => {
      state.products.forEach(el => {
        if (id === el.id) {
          el.isFavourite = true;
        }
      });
    },
    removeFromFavourite: (state, id) => {
      state.products.forEach(el => {
        if (id === el.id) {
          el.isFavourite = false;
        }
      });
    },
    quantity: (state, data) => {
      state.products.forEach(el => {
        if (data.id === el.id) {
          el.quantity = data.quantity;
        }
      });
    },
    SET_USER(state, user) {
      state.userInfo.name = user.name
      state.userInfo.token = user.token
      state.userInfo.isAdmin = user.isAdmin === 'true' || user.isAdmin === true
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_PRODUCT(state, product) {
      state.product = product
    },
    SET_CART(state, cart) {
      state.cart = cart
    },
    SET_LOGOUT(state) {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('name')
      sessionStorage.removeItem('isAdmin')
      state.userInfo.isUserLoggedIn = false
      this.$router.push('/')
      window.location.reload()
    },
    SET_ORDERS(state, orders) {
      state.orders = orders
    },
    SET_MY_ORDERS(state, orders) {
      state.myOrders = orders
    },
  },
  actions: {
    async login({ commit }, login) {
      try {
        const { data } = await this.$axios.post("/api/auth/login", login)
        commit('isUserLoggedIn', true);
        sessionStorage.setItem('token', `Bearer ${data.token}`)
        sessionStorage.setItem('name', data.name)
        sessionStorage.setItem('isAdmin', data.isAdmin)
        this.$axios.defaults.headers.common.authorization = `Bearer ${data.token}`
        if (data.token) commit("SET_USER", data)
      } catch (error) {
        if (error instanceof AxiosError) {
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
      }
    },

    async register({ commit }, register) {
      try {
        const { data } = await this.$axios.post("/api/auth/register", register)
        this.$toast.success(data.message, {
          position: "top-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
      }
    },

    async getImage({ }, url) {
      try {
        return await this.$axios.get(url, {
          responseType: 'blob'
        })  
      } catch (error) {
        console.error(error)
      }
    },

    async createProduct({ commit, dispatch }, product) {
      try {
        const { data } = await this.$axios.post("/api/products", product)
        this.$toast.success(data.message, {
          position: "top-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
      }
    },

    async editProduct({ commit, dispatch }, {product, id}) {
      try {
        const { data } = await this.$axios.put("/api/products/" + id, product)
        this.$toast.success(data.message, {
          position: "top-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
      }
    },

    async uploadImage({ commit, dispatch }, {id, file }) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const { data } = await this.$axios.post("/api/products/upload/" + id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        this.$toast.success(data.message, {
          position: "top-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
      }
    },
  
    async getProductsList({ commit }) {
      const res = await this.$axios.get("/api/products")
      commit("SET_PRODUCTS", res.data)
    },

    async deleteProduct({ commit }, id) {
      try {
        const res = await this.$axios.delete("/api/products/" + id)
        commit("SET_PRODUCT", res.data)
      } catch (error) {
        if (error instanceof AxiosError) {
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
      }
    },

    async getProduct({ commit }, id) {
      try {
        const res = await this.$axios.get("/api/products/" + id)
        commit("SET_PRODUCT", res.data)
      } catch (error) {
        if (error instanceof AxiosError) {
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
      }
    },

    async createOrder({ commit, dispatch }, products) {
      try {
        const { data } = await this.$axios.post("/api/orders", products)
        this.$toast.success(data.message, {
          position: "top-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
      }
    },

    async getOrders({ commit }) {
      const res = await this.$axios.get("/api/orders")
      commit("SET_ORDERS", res.data)
    },

    async getMyOrders({ commit }) {
      const res = await this.$axios.get("/api/orders?search=my")
      commit("SET_MY_ORDERS", res.data)
    },

    async updateStatus({ commit, dispatch }, {status, id}) {
      try {
        const { data } = await this.$axios.put("/api/orders/" + id, status)
        this.$toast.success(data.message, {
          position: "top-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            timeout: 5000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        }
      }
    },
  }
})
