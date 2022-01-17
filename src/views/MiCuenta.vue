<template>
    <div class="page-my-account">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Mi Cuenta</h1>
            </div>

            <div class="column is-12">
                <button @click="logout()" class="button is-danger">Cerrar sesión</button>
            </div>

            <hr>

            <div class="column is-12">
                <h2 class="subtitle">Mis pedidos</h2>

                <OrdenResumen
                    v-for="orden in ordenes"
                    v-bind:key="orden.id"
                    v-bind:orden="orden" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import OrdenResumen from '@/components/OrdenResumen.vue'
export default {
    name: 'MiCuenta',
    components: {
        OrdenResumen
    },
    data() {
        return {
            ordenes: []
        }
    },
    mounted() {
        document.title = 'Mi cuenta | Djackets'
        this.getMyOrders()
    },
    methods: {
        logout() {
            axios.defaults.headers.common["Authorization"] = ""
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("userid")
            this.$store.commit('removeToken')
            this.$router.push('/')
        },
        async getMyOrders() {
            this.$store.commit('setIsLoading', true)
            await axios
                .get('/api/v1/ordenes/')
                .then(response => {
                    this.ordenes = response.data
                })
                .catch(error => {
                    console.log(error)
                })
            this.$store.commit('setIsLoading', false)
        }
    }
}
</script>