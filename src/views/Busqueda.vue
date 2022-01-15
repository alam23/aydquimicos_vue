<template>
    <div class="page-search">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Buscar</h1>

                <h2 class="is-size-5 has-text-grey">Término de busqueda: "{{ query }}"</h2>
            </div>

            <ProductBox 
                v-for="producto in productos"
                v-bind:key="producto.id"
                v-bind:producto="producto" />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import ProductBox from '@/components/ProductBox.vue'
export default {
    name: 'Busqueda',
    components: {
        ProductBox
    },
    data() {
        return {
            productos: [],
            query: ''
        }
    },
    mounted() {
        document.title = 'Busqueda | AyDQuimicos'
        let uri = window.location.search.substring(1)
        let params = new URLSearchParams(uri)

        if (params.get('query')) {
            this.query = params.get('query')
            this.realizarBusqueda()
        }
    },
    methods: {
        async realizarBusqueda(){
            this.$store.commit('setIsLoading', true)
            await axios
                .post('/api/v1/productos/busqueda/', {'query': this.query})
                .then(response => {
                    this.productos = response.data
                })
                .catch(error => {
                    console.log(error)
                })
            this.$store.commit('setIsLoading', false)            
        }
    }

}
</script>