<template>
    <div class="notification-container">
        <div class="notification-header">
            <h1>Notificaciones</h1>
            <span class="menu-dots" @click="toggleMenu">...</span>
        </div>
        <div v-if="showMenu" class="menu-modal">
            <svg aria-hidden="true" height="12" viewBox="0 0 21 12" width="21" class="xem7dle x10l6tqk xng853d xdlq8gc"
                style="transform: scale(-1, -1) translate(-9.5px, 0px);">
                <path d="M21 0c-2.229.424-4.593 2.034-6.496 3.523L5.4 10.94c-2.026 2.291-5.434.62-5.4-2.648V0h21Z">
                </path>
            </svg>
            <ul>
                <li><router-link to="#"><i class='bx bxs-message-alt-x'></i> Limpiar</router-link></li>
                <li><router-link to="/reporte2"><i class='bx bxs-book-open'></i> Abrir Notificación</router-link></li>
            </ul>
        </div>

        <div>
            <ul class="notification-list">
                <li v-for="(notification, index) in notifications.slice(0, 7)" :key="index">
                    <router-link to="#"> {{ notification }}</router-link>
                </li>
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import iziToast from 'izitoast';

const alerts = ref([]);
const showMenu = ref(false);
const notifications = ref(['Notificación 1', 'Notificación 2', 'Notificación 3', 'Notificación 4', 'Notificación 4', 'Notificación 4', 'Notificación 4']); // Ejemplo de notificaciones

const toggleMenu = () => {
    showMenu.value = !showMenu.value;
};
</script>

<style scoped>
.notification-container {
    position: fixed;
    position: absolute;
    top: 48%;
    left: 80%;
    transform: translate(-50%, -50%);
    z-index: 100;
    background-color: var(--body-color);
    height: 600px;
    width: 400px;
    border-radius: 20px;
}

.notification-header {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    background: #ffffff;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 8px;
}

.title i {
    font-size: 24px;
    color: #4a7bff;
}

.unread-count {
    background: #4a7bff;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.menu-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: all 0.3s ease;
}

.menu-button:hover {
    background: #f5f5f5;
}

.menu-button.active {
    color: #4a7bff;
    background: #eef2ff;
}

.menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 150;
}

.menu-panel {
    position: absolute;
    top: 80px;
    right: 24px;
    width: 200px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 101;
    width: 50%;
    border-top-right-radius: 0px;

}

.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    color: #666;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.menu-item:hover {
    background: #f5f5f5;
    color: #4a7bff;
}

.notifications-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.notifications-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.notification-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    margin-bottom: 8px;
    background: white;
    border-radius: 16px;
    transition: all 0.3s ease;
    animation: slideIn 0.5s ease forwards;
    border: 1px solid #f0f0f0;
}

.notification-item:hover {
    transform: translateX(4px);
}

.notification-item.unread {
    background: #f8faff;
    border-color: #e5edff;
}

.notification-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #eef2ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4a7bff;
    font-size: 20px;
}

.notification-content {
    flex: 1;
}

.notification-text {
    color: #1a1a1a;
    font-size: 14px;
    margin-bottom: 4px;
}

.notification-time {
    color: #999;
    font-size: 12px;
}

.notification-action {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: #999;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    opacity: 0;
}

.notification-item:hover .notification-action {
    opacity: 1;
}

.notification-list {
    max-height: 300px; /* Ajusta la altura máxima para permitir el desplazamiento */
    overflow-y: auto; /* Habilita el desplazamiento vertical */
}

.notification-list li {
    max-height: 200px;
    overflow-y: auto;
    padding: 10px;
    margin: 10px;
    height: 50px;
    border-radius: 10px;
    background: rgb(233,233,235);
    background: linear-gradient(90deg, rgba(233,233,235,1) 0%, rgba(255,218,218,1) 35%, rgba(219,249,255,1) 100%);
}
.notification-list li a {
    text-decoration: none;
    color: transparent;
}
</style>