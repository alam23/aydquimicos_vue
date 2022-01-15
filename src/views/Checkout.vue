<template>
    <div class="page-checkout">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Checkout</h1>
            </div>

            <div class="column is-12 box">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="item in cart.items"
                            v-bind:key="item.producto.id"
                        >
                            <td>{{ item.producto.nombre }}</td>
                            <td>S/. {{ item.producto.precio }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>S/. {{ getItemTotal(item).toFixed(2) }}</td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colspan="2">Total</td>
                            <td>{{ cartTotalLength }}</td>
                            <td>S/. {{ cartTotalPrice.toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Detalles de envío</h2>

                <p class="has-text-grey mb-4">* Todos los campos son requeridos</p>

                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>Nombre*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="first_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>Apellido*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="last_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>E-mail*</label>
                            <div class="control">
                                <input type="email" class="input" v-model="email">
                            </div>
                        </div>

                        <div class="field">
                            <label>Celular*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="phone">
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="field">
                            <label>Direccion*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address">
                            </div>
                        </div>

                        <div class="field">
                            <label>Codigo Zip*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="zipcode">
                            </div>
                        </div>

                        <div class="field">
                            <label>Lugar*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="place">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </div>

                <hr>

                <div id="card-element" class="mb-5"></div>

                <template v-if="cartTotalLength">
                    <hr>

                    <button class="button is-dark" @click="submitForm">Pagar con Stripe</button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Checkout',
    data() {
        return {
            cart: {
                items: []
            },
            stripe: {},
            card: {},
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            zipcode: '',
            place: '',
            errors: []
        }
    },
    mounted() {
        document.title = 'Checkout | A&D Quimicos'
        this.cart = this.$store.state.cart
        if (this.cartTotalLength > 0) {
            this.stripe = Stripe('pk_test_51KIIOSBOyv72CtvYiP0425lrjDGt8z0UlJPPbgBQ4yoJYqgl0E43Fu9O6zs59joZlabRF7WCjToDHdhpQeYHp1M200IDeTzTmG')
            const elements = this.stripe.elements();
            this.card = elements.create('card', { hidePostalCode: true })
            this.card.mount('#card-element')
        }
    },
    methods: {
        getItemTotal(item) {
            return item.quantity * item.producto.precio
        },
        submitForm() {
            this.errors = []
            if (this.first_name === '') {
                this.errors.push('El campo nombre esta vacío!')
            }
            if (this.last_name === '') {
                this.errors.push('El campo apellido esta vacío!')
            }
            if (this.email === '') {
                this.errors.push('El campo email esta vacío!')
            }
            if (this.phone === '') {
                this.errors.push('El campo celular esta vacío!')
            }
            if (this.address === '') {
                this.errors.push('El campo dirección esta vacío!')
            }
            if (this.zipcode === '') {
                this.errors.push('El campo código zip esta vacío!')
            }
            if (this.place === '') {
                this.errors.push('El campo lugar esta vacío!')
            }
            if (!this.errors.length) {
                this.$store.commit('setIsLoading', true)
                this.stripe.createToken(this.card).then(result => {                    
                    if (result.error) {
                        this.$store.commit('setIsLoading', false)
                        this.errors.push('Ocurrio un problema con Stripe. Por favor vuelva a intentar')
                        console.log(result.error.message)
                    } else {
                        this.stripeTokenHandler(result.token)
                    }
                })
            }
        },
        async stripeTokenHandler(token) {
            const items = []
            for (let i = 0; i < this.cart.items.length; i++) {
                const item = this.cart.items[i]
                const obj = {
                    producto: item.producto.id,
                    quantity: item.quantity,
                    precio: item.producto.precio * item.quantity
                }
                items.push(obj)
            }
            const data = {
                'nombre': this.first_name,
                'apellido': this.last_name,
                'email': this.email,
                'direccion': this.address,
                'codigo_zip': this.zipcode,
                'lugar': this.place,
                'celular': this.phone,
                'items': items,
                'stripe_token': token.id
            }
            await axios
                .post('/api/v1/checkout/', data)
                .then(response => {
                    this.$store.commit('clearCart')
                    this.$router.push('/cart/ProcesoExitoso')
                })
                .catch(error => {
                    this.errors.push('Something went wrong. Please try again')
                    console.log(error)
                })
                this.$store.commit('setIsLoading', false)
        }
    },
    computed: {
        cartTotalPrice() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.producto.precio * curVal.quantity
            }, 0)
        },
        cartTotalLength() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.quantity
            }, 0)
        }
    }
}
</script>