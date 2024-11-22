<template>
    <div class="navar">
        <div class="text">
            <h1 class="titulo">{{ displayedText }}</h1>
        </div>

        <div class="actions">
            <!-- Icono de notificación con indicador -->
            <router-link to="#"  @click.prevent="toggleNotificationModal">
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
                    <router-link to="#" class="dropdown-item" @click.prevent="toggleProfileCard">
                        <i class='bx bx-user-circle'></i>
                        <span>Perfil</span>
                    </router-link>
                    <router-link to="#" class="dropdown-item" @click.prevent="togglePaswordCard">
                        <i class='bx bx-lock-alt'></i>
                        <span>Contraseña</span>
                    </router-link>
                    <router-link to="/privacidad" class="dropdown-item">
                        <i class='bx bx-user-x'></i>
                        <span>Privacidad</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <PerfilCard v-if="showProfileCard" @close="toggleProfileCard" />
    <PaswordC v-if="showPaswordCard" @close="togglePaswordCard" />
    <NotificacionN v-if="showNotificationModal" @close="toggleNotificationModal" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import PerfilCard from './PerfilCard.vue';
import PaswordC from './PaswordC.vue';
import NotificacionN from './NotificacionN.vue';
const dropdownOpen = ref(false);
const showProfileCard = ref(false);
const showPaswordCard = ref(false);
const showNotificationModal = ref(false);
const fullText = "Navify";
const displayedText = ref("");
let currentIndex = 0;
let isDeleting = false;
let typingInterval;

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const toggleProfileCard = () => {
    showProfileCard.value = !showProfileCard.value;
    if (dropdownOpen.value) {
        dropdownOpen.value = false;
    }
};

const togglePaswordCard = () => {
    showPaswordCard.value = !showPaswordCard.value;
    if (dropdownOpen.value) {
        dropdownOpen.value = false;
    }
};

const toggleNotificationModal = () => {
    showNotificationModal.value = !showNotificationModal.value;
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
    min-width: 100px;
    /* Ajusta según sea necesario */
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
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.dropdown-content {
    display: none;
    position: absolute;
    margin-right: 30px;
    background-color: var(--sidebar-color);
    min-width: 200px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    animation: fadeInDown 1s ease-out;
}

.hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
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
</style>