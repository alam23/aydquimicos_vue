<template>
    <tr>
        <td><router-link :to="item.producto.get_absolute_url">{{ item.producto.nombre }}</router-link></td>
        <td>S/. {{ item.producto.precio }}</td>
        <td>
            {{ item.cantidad }}
            <a @click="decrementQuantity(item)">-</a>
            <a @click="incrementQuantity(item)">+</a>            
        </td>
        <td>S/. {{ getItemTotal(item).toFixed(2) }}</td>
        <td><button class="delete" @click="removeFromCart(item)"></button></td>
    </tr>
</template>

<script>
export default {
    name: 'CartItem',
    props: {
        initialItem: Object
    },
    data() {
        return {
            item: this.initialItem
        }
    },
    methods: {
        getItemTotal(item) {
            return item.cantidad * item.producto.precio
        },
        decrementQuantity(item) {
            item.cantidad -= 1
            if (item.cantidad === 0) {
                this.$emit('removeFromCart', item)
            }
            this.updateCart()
        },
        incrementQuantity(item) {
            item.cantidad += 1
            this.updateCart()
        },
        updateCart() {
            localStorage.setItem('cart', JSON.stringify(this.$store.state.cart))
        },
        removeFromCart(item) {
            this.$emit('removeFromCart', item)
            this.updateCart()
        },
    },
}
</script>