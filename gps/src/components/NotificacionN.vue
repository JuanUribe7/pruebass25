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
                <li @click="clearNotifications"><i class='bx bxs-message-alt-x'></i> Limpiar</li>
                <li><router-link to="/reporte2"><i class='bx bxs-book-open'></i> Abrir Notificación</router-link></li>
            </ul>
        </div>

        <div>
            <ul class="notification-list">
                <li v-for="alert in alerts" :key="alert._id">
                    <router-link to="#"> {{ alert.alertName }}</router-link>
                </li>
            </ul>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import iziToast from 'izitoast';

const alerts = ref([]);
const showMenu = ref(false);

const toggleMenu = () => {
    showMenu.value = !showMenu.value;
};


const cargarAlertas = async () => {
    try {
        // Hacer la solicitud para obtener alertas por IMEI
        const response = await fetch(`http://3.12.147.103/notificaciones`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            return;
        }
        const data = await response.json();
        console.log(data); // Verifica los datos recibidos

        // Filtrar las nuevas alertas que no están en el estado actual
        const nuevasAlertas = data.filter(alerta => !alerts.value.some(a => a._id === alerta._id));
        if (nuevasAlertas.length > 0) {
            alerts.value = [...alerts.value, ...nuevasAlertas];
        }

        // Mostrar alerta si hay una alerta en la respuesta
        if (data.alert) {
            iziToast.warning({
                title: 'Alerta',
                message: data.alert.alertName,
                position: 'topRight',
                timeout: 5000 // Mostrar la alerta durante 5 segundos
            });
        }
    } catch (error) {
        console.error('Error al cargar alertas:', error);
    }
};

const cargarNotificaciones = async () => {
    try {
        const response = await fetch('http://3.12.147.103/notificaciones');
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            return;
        }
        const data = await response.json();
        alerts.value = data;
    } catch (error) {
        console.error('Error al cargar notificaciones:', error);
    }
};


const clearNotifications = async () => {
    try {
        await fetch('http://3.12.147.103/notificaciones', {
            method: 'DELETE'
        });
        alerts.value = [];
    } catch (error) {
        console.error('Error al eliminar notificaciones:', error);
    }
};
onMounted(() => {
    cargarNotificaciones();
    cargarAlertas();


    // Configurar WebSocket para recibir notificaciones en tiempo real
    let ws = new WebSocket('ws://3.12.147.103');

    ws.onmessage = (event) => {
    const notificacion = JSON.parse(event.data);

    // Verifica si la notificación ya existe antes de agregarla
    if (!alerts.value.some(alert => alert._id === notificacion._id)) {
        alerts.value.push(notificacion);
    }
};

ws.onclose = () => {
    console.log('WebSocket cerrado. Reintentando...');
    setTimeout(() => {
        // Reintentar conexión
        const newWs = new WebSocket('ws://3.12.147.103');
        ws = newWs;
    }, 5000);
};

    ws.onerror = (error) => {
        console.error('Error en WebSocket:', error);
    };
});

// Llama a la función cargarAlertas y cargarNotificaciones cuando el componente se monta

</script>

<style scoped>
.notification-container {
    position: fixed;
    top: 10%; /* Ajusta la posición superior según sea necesario */
    right: 10%; /* Ajusta la posición derecha según sea necesario */
    z-index: 100;
    background-color: var(--body-color);
    height: auto; /* Ajusta la altura automáticamente según el contenido */
    width: 400px;
    border-radius: 20px;
    max-height: 80vh; /* Limita la altura máxima al 80% de la altura de la ventana */
    overflow-y: auto; /* Habilita el desplazamiento si el contenido excede la altura máxima */
}

.notification-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
}

.notification-header h1 {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-color);
    position: relative;
}

.menu-dots {
    cursor: pointer;
    margin-left: 10px;
    font-size: 30px;
    display: flex;
    align-items: center;
    color: var(--text-color);
    margin-bottom: 10px;
}

.menu-modal {
    position: absolute;
    top: 70px;
    right: 26px;
    border: none;
    background-color: var(--body-color);
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 101;
    width: 50%;
    border-top-right-radius: 0px;
}

.menu-modal svg {
    position: absolute;
    top: -10px;
    right: 9px;
    fill: var(--body-color);
}

.menu-modal ul {
    list-style: none;
    padding: 0;
    height: 30%;
}

.menu-modal li {
    padding: 10px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    color: var(--text-color);
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
}

.menu-modal li a {
    text-decoration: none;
    color: var(--text-color);
    display: flex;
    align-items: center;
}

.menu-modal li i {
    margin-top: 3px;
    margin-right: 10px;
    font-size: 17px;
}

.notification-list {
    max-height: 300px; /* Ajusta la altura máxima para permitir el desplazamiento */
    overflow-y: auto; /* Habilita el desplazamiento vertical */
}

.notification-list li {
    padding: 10px;
    margin: 10px;
    height: 50px;
    border-radius: 10px;
    background: rgb(233,233,235);
    background: linear-gradient(90deg, rgba(233,233,235,1) 0%, rgba(255,218,218,1) 35%, rgba(219,249,255,1) 100%);
}

.notification-list li a {
    text-decoration: none;
    color: var(--text-color); /* Asegúrate de que el color del texto sea visible */
}
</style>