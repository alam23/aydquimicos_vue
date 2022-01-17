<template>
    <div class="page-cart">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Carro de compras</h1>
            </div> 
            <div class="column is-12 box">
                <table class="table is-fullwidth" v-if="cartTotalLength">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <CartItem
                            v-for="item in cart.items"
                            v-bind:key="item.producto.id"
                            v-bind:initialItem="item"
                            v-on:removeFromCart="removeFromCart" />
                    </tbody>
                </table>
                <p v-else>No tienes ningún producto en el carro de compras...</p>
            </div>
            <div class="column is-12 box">
                <h2 class="subtitle">Resumen</h2>

                <strong>S/. {{ cartTotalPrice.toFixed(2) }}</strong>, {{ cartTotalLength }} productos

                <hr>

                <router-link to="/cart/checkout" class="button is-dark">Proceder a verificacion</router-link>
            </div>
        </div>       
    </div>
</template>

<script>
import axios from 'axios'
import CartItem from '@/components/CartItem.vue'
export default {
    name: 'Cart',
    components: {
        CartItem
    },
    data() {
        return {
            cart: {
                items: []
            }
        }
    },
    mounted() {
        this.cart = this.$store.state.cart
    },
    methods: {
        removeFromCart(item) {
            this.cart.items = this.cart.items.filter(i => i.producto.id !== item.producto.id)
        }
    },
   
    computed: {
        cartTotalLength() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.cantidad
            }, 0)
        },
        cartTotalPrice() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.producto.precio * curVal.cantidad
            }, 0)
        },
    }
}
</script>