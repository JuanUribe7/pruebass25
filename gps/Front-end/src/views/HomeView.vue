<template>
  <section class="home">
    <div class="overlay"></div>
    <div class="navar">
      <div class="text">
        <h1 class="titulo">{{ displayedText }}</h1>
      </div>

      <div class="actions">
        <!-- Icono de notificación con indicador -->
        <router-link to="/reporte2">
          <button class="notification-btn">
          <i class='bx bx-bell'></i>
          <span class="notification-indicator"></span>
        </button>
        </router-link>
        <!-- Menú desplegable de configuración mejorado -->
        <div class="dropdown">
          <button class="dropbtn" @click="toggleDropdown">
            <i class='bx bx-cog confi'></i> Configuración
            <i class='bx bx-chevron-down'></i>
          </button>
          <div class="dropdown-content" :class="{ 'show': dropdownOpen }">
            <a href="#" class="dropdown-item">
              <i class='bx bx-user-circle'></i>
              <span>Perfil</span>
            </a>
            <a href="#" class="dropdown-item">
              <i class='bx bx-lock-alt'></i>
              <span>Contraseña</span>
            </a>
            <a href="#" class="dropdown-item">
              <i class='bx bx-user-x'></i>
              <span>Privacidad</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal mejorado -->
    <div class="hero">
      <h1 class="hero-title">Sistema de Rastreo GPS Avanzado</h1>
      <p class="hero-subtitle">Monitoreo preciso y eficiente para optimizar tu flota de transporte</p>
      <button class="btn-cta" @click="scrollToFeatures">Descubre la Revolución del Rastreo</button>
    </div>
  </section>

  <section class="home" id="home2">
    <div class="features">
      <div class="feature-card">
        <i class='bx bx-bus'></i>
        <h3>Gestión Eficiente de Flota</h3>
        <p>Optimiza rutas y reduce costos operativos hasta en un 25%</p>
      </div>
      <div class="feature-card">
        <i class='bx bx-time-five'></i>
        <h3>Puntualidad Mejorada</h3>
        <p>Aumenta la precisión de los horarios de llegada en un 30%</p>
      </div>
      <div class="feature-card">
        <i class='bx bx-shield-quarter'></i>
        <h3>Seguridad del Pasajero</h3>
        <p>Monitoreo en tiempo real para una experiencia de viaje más segura</p>
      </div>
    </div>

    <!-- Nueva sección de publicidad -->
    <div class="promo-section">
      <h2>¿Por qué elegir nuestro Sistema de Rastreo GPS?</h2>
      <div class="promo-content">
        <div class="promo-text">
          <ul>
            <li>Optimiza rutas y reduce el consumo de combustible hasta en un 20%</li>
            <li>Mejora la puntualidad de los buses en un 30%</li>
            <li>Monitorea el comportamiento de los conductores para aumentar la seguridad</li>
            <li>Proporciona información en tiempo real a los pasajeros sobre llegadas y salidas</li>
            <li>Facilita el mantenimiento preventivo para reducir tiempos de inactividad</li>
          </ul>
        </div>
        <div class="promo-image">
          <img src="../assets/gps-tracking-demo.jpg" alt="Demo del sistema de rastreo GPS">
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const dropdownOpen = ref(false);

const fullText = "Navify";
const displayedText = ref("");
let currentIndex = 0;
let isDeleting = false;
let typingInterval;

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const scrollToFeatures = () => {
  const featuresElement = document.querySelector('#home2');
  if (featuresElement) {
    featuresElement.scrollIntoView({ behavior: 'smooth' });
  }
};


const typeEffect = () => {
  const current = currentIndex;
  
  if (!isDeleting && current < fullText.length) {
    displayedText.value = fullText.slice(0, current + 1);
    currentIndex++;
    if (currentIndex === fullText.length) {
      // Esperar 5 segundos antes de comenzar a borrar
      typingInterval = setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 5000);
      return;
    }
  } else if (isDeleting && current > 0) {
    displayedText.value = fullText.slice(0, current - 1);
    currentIndex--;
  } else {
    isDeleting = false;
    currentIndex = 0;
  }

  const typingSpeed = isDeleting ? 100 : 200;
  typingInterval = setTimeout(typeEffect, typingSpeed);
};


onUnmounted(() => {
  clearTimeout(typingInterval);
});

onMounted(() => {
  typeEffect();
});
</script>

<style scoped>
.home {
  position: relative;
  min-height: 100vh;
  background-image: url('../assets/fondo7.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
}

#home2{
  min-height: 140vh;
}


.home .navar {
  background-color: var(--sidebar-color);
  border-bottom: 3px solid var(--body-color);
}

.home .text {
  position: relative;
  z-index: 2;
}

.home .actions {
  display: flex;
  align-items: center;
}

.actions {
  display: flex;
  align-items: center;
}

.notification-btn {
  background: none;
  border: none;
  color: var(--text-colar);
  font-size: 1.7rem;
  cursor: pointer;
  margin-right: 15px;
  margin-top: 10px;
  position: relative;
}

.notification-indicator {
  position: absolute;
  right: -1px;
  width: 15px;
  height: 15px;
  background-color: var(--text-colar);
  border-radius: 50%;
}

.titulo {
  display: inline-block;
  min-width: 100px; /* Ajusta según sea necesario */
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: var(--sidebar-color);
  color: var(--text-colar);
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.dropbtn:hover {
  background-color: var(--body-color);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.dropdown-content {
  display: none;
  position: absolute;
  margin-right: 30px;
  background-color: var(--sidebar-color);
  min-width: 200px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  z-index: 3;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-content.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.dropdown-item {
  color: var(--text-colar);
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: background-color 0.2s, transform 0.2s;
}

.dropdown-item:hover {
  background-color: var(--body-color);
  transform: translateX(5px);
  color: var(--text-colar);
}

.dropdown-item i {
  margin-right: 12px;
  font-size: 1.2em;
  width: 20px;
  text-align: center;
}

.dropdown-item span {
  font-weight: 500;
}

/* Separador entre elementos */
.dropdown-item:not(:last-child) {
  border-bottom: 1px solid rgba(var(--text-colar-rgb), 0.1);
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
  text-align: center;
  position: relative;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.6);
  min-height: 100vh;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  animation: fadeInDown 1s ease-out;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  animation: fadeInUp 1s ease-out 0.5s both;
}

.btn-cta {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: var(--sidebar-color);
  color: var(--text-color);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 1s ease-out 1s both;
}

.btn-cta:hover {
  background-color: var(--sidebar-color);
  transform: translateY(-3px);
}

.features {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 4rem 0px;
  background-color: var(--sidebar-color);
  position: relative;
  z-index: 2;
  min-height: 50vh;
  min-width: auto;
}

.feature-card {
  background-color: var(--sidebar-color);
  border-radius: 10px;
  padding: 2rem;
  margin: 1rem;
  width: 300px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
}

.feature-card i {
  font-size: 3rem;
  color: var(--text-colar);
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.feature-card p {
  color: var(--text-color);
}

.promo-section {
  background-color: var(--sidebar-color);
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  z-index: 2;
}

.promo-section h2 {
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 2rem;
}

.promo-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.promo-text {
  flex: 1;
  max-width: 500px;
  text-align: left;
}

.promo-text ul {
  list-style-type: none;
  padding: 0;
}

.promo-text li {
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  padding-left: 30px;
  position: relative;
}

.promo-text li::before {
  content: '✓';
  color: #4CAF50;
  position: absolute;
  left: 0;
}

.promo-image {
  flex: 1;
  max-width: 500px;
}

.promo-image img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

/* Animaciones */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para el modo oscuro */
body.dark .features,
body.dark .promo-section {
  background-color: rgba(30, 30, 30, 0.95);
}

body.dark .feature-card,
body.dark .promo-section h2,
body.dark .promo-text li {
  color: #f0f0f0;
}

body.dark .feature-card p,
body.dark .promo-text li {
  color: #ccc;
}

body.dark .home {
  background-image: url('../assets/fondo1_1.jpg');
}
</style>