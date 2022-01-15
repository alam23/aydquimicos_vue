<template>
    <div class="page-category">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h2 class="is-size-2 has-text-centered">{{ categoria.name }}</h2>
            </div>

            <ProductBox 
                v-for="producto in categoria.productos"
                v-bind:key="producto.id"
                v-bind:producto="producto" />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'
import ProductBox from '@/components/ProductBox'

export default {
    name: 'Categoria',
    components: {
        ProductBox
    },

    data() {
        return {
            categoria: {
                productos: []
            }
        }
    },

    mounted() {
        this.getCategoria()
    },

    watch: {
        $route(to, from) {
            if (to.name === 'Categoria') {
                this.getCategoria()
            }
        }
    },

    methods: {
        async getCategoria() {
            const categoriaSlug = this.$route.params.categoria_slug
            this.$store.commit('setIsLoading', true)
            axios
                .get(`/api/v1/productos/${categoriaSlug}/`)
                .then(response => {
                    this.categoria = response.data
                    document.title = this.categoria.nombre + ' | AyDQuimicos'
                })
                .catch(error => {
                    console.log(error)
                    toast({
                        message: 'Ocurrio un problema. Vuelva a intentarlo',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })
                })
            this.$store.commit('setIsLoading', false)
        }
    }
}
</script>