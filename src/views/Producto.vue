<template>
    <div class="page-product">
        <div class="columns is-multiline">
            <div class="column is-9">
                <figure class="image mb-6">
                    <img v-bind:src="producto.get_image">
                </figure>

                <h1 class="title">{{ producto.nombre }}</h1>

                <p>{{ producto.descripcion }}</p>
            </div>

            <div class="column is-3">
                <h2 class="subtitle">Informacion</h2>

                <p><strong>Precio: </strong>S/. {{ producto.precio }}</p>

                <div class="field has-addons mt-6">
                    <div class="control">
                        <input type="number" class="input" min="1" v-model="cantidad">
                    </div>

                    <div class="control">
                        <a class="button is-dark" @click="addToCart()">Agregar a carro</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
    name: 'Producto',
    data(){
        return {
            producto: {},
            usuario_tipo: {},
            cantidad: 1
        }
    },
    mounted() {
        this.getProducto()
    },
    methods: {
        async getProducto() {
            this.$store.commit('setIsLoading', true)

            const categoria_slug = this.$route.params.categoria_slug
            const producto_slug = this.$route.params.producto_slug
            await axios
                .get(`/api/v1/productos/${categoria_slug}/${producto_slug}`)
                .then(response => {
                    this.producto = response.data

                    document.title = this.producto.nombre + ' | AyDQuimicos'
                })
                .catch(error => {
                    console.log(error)
                })
            
            this.$store.commit('setIsLoading', false)
        },
        async addToCart() {
            await axios
                .get(`/api/v1/cliente/`)
                .then(response => {
                    this.usuario_tipo = response.data
                })
                .catch(error => {
                    console.log(error)
                })            
            if(!this.producto.es_arriesgado || this.usuario_tipo.tipo_cliente=='empresa'){
                if (isNaN(this.cantidad) || this.cantidad < 1) {
                    this.cantidad = 1
                }
                const item = {
                    producto: this.producto,
                    cantidad: this.cantidad
                }
                this.$store.commit('addToCart', item) 

                toast({
                    message: 'El producto fue añadido al carro',
                    type: 'is-success',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    position: 'bottom-right',
                })  
            }
            else{
                toast({
                    message: 'Este producto requiere que se verifique como empresa',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    position: 'bottom-right',
                })                  
            }
   
        }
        
    }
}
</script>