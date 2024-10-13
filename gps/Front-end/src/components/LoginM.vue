<template>
  <div class="cont">
    <div class="contenedor1">
      <div class="logo">
        <img :src="require('../assets/earth1.gif')" alt="earth logo">
        <h1>Los Populares</h1>
      </div>

      <div class="formu">
        <form class="box" @submit.prevent="login">
          <h1 ref="typedText" class="typed-text">{{ displayText }}</h1>
          <input type="text" v-model="email" placeholder="Email" required>
          <input type="password" v-model="password" placeholder="Password" required>
          <input type="submit" value="Iniciar Sesión" class="btn1">
        </form>
      </div>
    </div>
    <div class="contenedor2"></div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import Swal from 'sweetalert2';
import '../styles_App/login.css';

const emit = defineEmits(['loginSuccess']);
const email = ref('');
const password = ref('');
const displayText = ref('');
const text = "Iniciar sesión en Navify GPS"; 
let index = 0;

const login = async () => {
    try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.value, password: password.value }),
        });

        const data = await response.json();

        if (response.ok) {
            // Maneja el inicio de sesión exitoso
            sessionStorage.setItem('isAuthenticated', 'true');
            emit('loginSuccess');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Credenciales incorrectas',
                text: data.message || 'Por favor, verifica tu usuario y contraseña',
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            text: 'No se pudo conectar con el servidor. Intenta nuevamente.',
        });
    }
};


const typeWriter = () => {
  if (index < text.length) {
    displayText.value += text.charAt(index);
    index++;
    setTimeout(typeWriter, 100);
  } else {
    setTimeout(() => {
      displayText.value = "";
      index = 0;
      typeWriter();
    }, 5000);
  }
};

onMounted(() => {
  typeWriter();
});
</script>
