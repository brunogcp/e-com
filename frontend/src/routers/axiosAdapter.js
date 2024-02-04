import Axios from 'axios'

import { store } from '../store'

export const Adapter = () => {
  const instance = Axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
  })
  const getToken = () => sessionStorage.getItem('token')
  const setToken = (token) => {
    instance.defaults.showLoader = true
    instance.defaults.timeout = 120000 // 120 segundos
    instance.defaults.headers.common.authorization = token ? `Bearer ${token}` : sessionStorage.getItem('token')
    return instance
  }

  const deleteToken = () => {
    instance.defaults.headers.common.authorization = ''
    return instance
  }
  const setBaseURL = (url) => {
    instance.defaults.baseURL = url
    return instance
  }

  const create = (config) => {
    return Axios.create(config)
  }

  const init = () => {
    setToken(null)
  }

  const generateCancelToken = () => {
    return Axios.CancelToken.source()
  }
  init()
  return { ...instance, generateCancelToken, create, getToken, setToken, deleteToken, setBaseURL }
}

export const axiosAdapter = Adapter()

axiosAdapter.interceptors.request.use(
  config => {
      if (config.showLoader) {
          store.dispatch('loader/pending');
      }
      return config;
  },
  error => {
      if (error.config.showLoader) {
          store.dispatch('loader/done');
      }
      return Promise.reject(error);
  }
);

axiosAdapter.interceptors.response.use(
  response => {
      if (response.config.showLoader) {
          store.dispatch('loader/done');
      }

      return response;
  },
  error => {
      let response = error.response;

      if (response.config.showLoader) {
          store.dispatch('loader/done');
      }

      if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        const response = {
          response: {
            data: {
              message: `A requisição excedeu o tempo limite!
               Por favor verifique a conexão com a internet e tente novamente!`
            }
          },
          status: 408,
          statusText: 'timeout'
        }
        return Promise.reject(response)
      }

      return Promise.reject(error);
  }
);
