<template>
  <div class="mb-16">
    <nav
      class="flex justify-between fixed w-full top-0 bg-blue z-10 shadow-xl p-2 px-3"
      role="navigation"
      aria-label="main navigation"
    >
      <router-link to="/" class="navbar-item">
        <h1 class="title w-40 h-12"></h1>
      </router-link>

      
      <div class="flex items-center">
        <div v-if="isUserLoggedIn" class="mx-2 hidden sm:flex">
          <div>
            Bem-Vindo {{ getUserName }}
          </div>
        </div>

        <div class="mx-2">
          <div class="cursor-pointer" @click="showCheckoutModal">
            <span :class="[numProductsAdded > 0 ? 'p-2 bg-black_light text-white rounded-xl' : 'p-2 bg-blue text-white rounded-xl']">{{ numProductsAdded }}</span>
            <span class="icon ml-2">
              <i class="fa fa-shopping-cart"></i>
            </span>
          </div>
        </div>

        <div class="mx-2">
          <button v-if="!isUserLoggedIn" @click="onShowDropdown">
            <span class="icon">
              <i class="fa fa-user"></i>
            </span>
          </button>
          <div class="flex flex-row gap-2 min-w-[12rem]" v-if="isUserLoggedIn">
            <button class="cursor-pointer button !bg-black_light hover:!text-white" @click="showOrdersModal">
              Pedidos
            </button>
            <button class="cursor-pointer button !bg-grey_dark hover:!text-white" @click="logOut">
              Sair
            </button>
          </div>
          <div v-if="showDropdown && isUserLoggedIn" class="dropdown w-54 h-28">
            <router-link :to="{ name: 'user-wishlist' }" class="button text-center">
              <span class="text-lg">{{ wishlistLabel }}</span>
            </router-link>
            <button @click="logout" class="button">
              <span class="text-lg">{{ logoutLabel }}</span>
            </button>
          </div>
          <div v-if="showDropdown && !isUserLoggedIn" class="dropdown">
            <button v-if="!isUserLoggedIn" class="button" @click="showLoginModal">
              <span class="text-lg">Already registered?<br /> {{ loginLabel }}</span>
              <i class="fa fa-sign-in"></i>
            </button>
            <button v-if="!isUserLoggedIn" class="button" @click="showSignupModal">
              <span class="text-lg">New User?<br /> {{ signupLabel }}</span>
              <i class="fa fa-user-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  export default {
    name: 'Header',

    data () {
      return {
        isCheckoutActive: false,
        showDropdown: false,
        logoutLabel: 'Log out',
			  loginLabel: 'Log in',
			  signupLabel: 'Sign up',
        wishlistLabel: 'Wishlist',
      }
    },

    computed: {
      numProductsAdded () {
        return this.$store.state.cart.length;
      },
      isUserLoggedIn () {
        return this.$store.getters.isUserLoggedIn;
      },
      getUserName () {
        let name = this.$store.getters.getUserName;

        if (name === '') {
          return 'user';
        } else {
          return name;
        }
      }
    },

    mounted() {
      window.addEventListener("blur", this.closeDropdown, true);
    },
    destroyed() {
      window.removeEventListener("blur", this.closeDropdown);
    },

    methods: {
      logOut() {
        this.$store.commit('SET_LOGOUT')
      },
      closeDropdown() {
        setTimeout(() => {
          this.showDropdown = false;
        }, 100);
      },
      showCheckoutModal () {
        this.$store.commit('showCheckoutModal', true);
      },
      showLoginModal () {
        this.$store.commit('showLoginModal', true);
      },
      showSignupModal () {
        this.$store.commit('showSignupModal', true);
      },
      showOrdersModal () {
        this.$store.commit('showOrdersModal', true);
      },
      onShowDropdown () {
        this.showDropdown = !this.showDropdown
      },
      logout () {
        this.$store.commit('isUserLoggedIn', false);
        this.$store.commit('isUserSignedUp', false);
        this.$store.commit('removeProductsFromFavourite');

        // redirect to homepage
        this.$router.push({ name: 'index' });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .title {
    background: url('/vue.svg') no-repeat;
    background-position: 50% 50%;
    width: 3rem;
    height: 3rem;
  }
  .dropdown {
    @apply absolute;
    @apply p-3;
    @apply bg-blue;
    @apply right-0;
    @apply shadow-lg;
    @apply rounded-xl;
    @apply flex;
    @apply flex-col;
    @apply gap-2;
  }

  .button {
    @apply w-full;
    @apply shadow-2xl;
    @apply bg-blue;
    @apply hover:bg-blue_light;
    @apply hover:text-black;
    @apply hover:font-bold;
    @apply p-2;
    @apply rounded-lg;
  }
</style>