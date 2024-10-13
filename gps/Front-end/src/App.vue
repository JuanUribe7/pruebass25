<template>
    <LoginM v-if="!isAuthenticated" @loginSuccess="isAuthenticated = true" />
    <BarraLateral v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BarraLateral from './components/BarraLateral.vue';
import LoginM from './components/LoginM.vue';

const isAuthenticated = ref(false);

onMounted(() => {
  // Verifica si el usuario ya está autenticado en sessionStorage
  if (sessionStorage.getItem('isAuthenticated') === 'true') {
    isAuthenticated.value = true;
  }
});
</script>

<style>
</style>
