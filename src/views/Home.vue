<template>
  <div class="home">
    <section class="hero is-medium is-dark mb-6">
        <div class="hero-body has-text-centered">
            <p class="title mb-6">
                Bienvenido a A&D Quimicos y Diversos SAC
            </p>
            <p class="subtitle">
                Venta de quimicos y diversos online
            </p>
        </div>
    </section>
    <div class="columns is-multiline">
      <div class="column is-12">
          <h2 class="is-size-2 has-text-centered">Ultimos productos</h2>
      </div>

      <ProductBox 
          v-for="producto in ultimosProductos"
          v-bind:key="producto.id"
          v-bind:producto="producto" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import ProductBox from '@/components/ProductBox'

export default {
  name: 'Home',
  data() {
    return {
      ultimosProductos: []
    }
  },
  components: {
    ProductBox
  },
  mounted() {
    this.getUltimosProductos()

    document.title = 'Menu Principal | AyDQuimicos'
  },
  methods: {
    async getUltimosProductos() {
      this.$store.commit('setIsLoading', true)
      await axios
        .get('/api/v1/ultimos-productos/')
        .then(response => {
          this.ultimosProductos = response.data
        })
        .catch(error => {
          console.log(error)
        })

      this.$store.commit('setIsLoading', false)
    }
  }
}
</script>
