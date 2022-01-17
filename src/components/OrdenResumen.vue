<template>
    <div class="box mb-4">
        <h3 class="is-size-4 mb-6">Orden #{{ orden.id }}</h3>

        <h4 class="is-size-5">Productos</h4>

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
                    v-for="item in orden.items"
                    v-bind:key="item.producto.id"
                >
                    <td>{{ item.producto.nombre }}</td>
                    <td>${{ item.producto.precio }}</td>
                    <td>{{ item.cantidad }}</td>
                    <td>${{ getItemTotal(item).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'OrdenResumen',
    props: {
        orden: Object
    },
    methods: {
        getItemTotal(item) {
            return item.cantidad * item.producto.precio
        },
        orderTotalLength(orden) {
            return orden.items.reduce((acc, curVal) => {
                return acc += curVal.quantity
            }, 0)
        },
    }
}
</script>