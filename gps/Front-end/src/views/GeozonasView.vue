<template>
  <section class="home">
    <div class="overlay"></div>
    <div class="navar">
      <div class="text">
        <h1 class="titulo">{{ displayedText }}</h1>
      </div>

      <div class="actions">
        <!-- Icono de notificación con indicador -->
        <button class="notification-btn">
          <i class='bx bx-bell'></i>
          <span class="notification-indicator"></span>
        </button>
        
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

    <div class="tituloo">
      <div class="hone">
        <h1>Crear Geozonas</h1>
        <div class="group">
          <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path
                d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
              </path>
            </g>
          </svg>
          <input placeholder="Search" type="search" class="input" v-model="searchQuery" @input="filterResults">
        </div>
        <ul class="device-list">
          <router-link to="#" style="text-decoration: none;">
            <li @click="selectDevice(item)" v-for="item in filteredResults" :key="item.id">{{ item.name }}
              <i class='bx bxs-car icon'></i>
            </li>
          </router-link>
        </ul>

        <button type="button" class="button" @click="deleteLastShape">
          <span class="button__text">Eliminar Geozona</span>
        </button>
      </div>

      <div id="map"  class="map-container"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'; // Estilos de Geoman

const map = ref(null);
const drawnItems = ref(new L.FeatureGroup());
const searchQuery = ref('');
const devices = ref([
  { id: 1, name: 'Jesus Alvarez' },
  { id: 2, name: 'RTY687' },
  { id: 3, name: 'SJS981' },
  { id: 4, name: 'HDS432' }
]);
const filteredResults = ref([]);
const selectedDevice = ref(null);
const deviceShapes = ref({});
const dropdownOpen = ref(false);

const fullText = "Navify";
const displayedText = ref("");
let currentIndex = 0;
let isDeleting = false;
let typingInterval;

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

// Función para alternar la visibilidad del dropdown
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}
const initMap = () => {
  map.value = L.map('map').setView([10.96854, -74.78132], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map.value);

  // Añadir el grupo de elementos dibujados al mapa
  drawnItems.value.addTo(map.value);

  // Activar Geoman
  map.value.pm.addControls({
    position: 'topleft',
    drawPolygon: true,
    drawPolyline: true,
    drawRectangle: true,
    drawCircle: true,
    drawMarker: false,
    editMode: true,
    deleteMode: true,
  });

  // Evento cuando se crea una nueva geometría
  map.value.on('pm:create', (e) => {
    const layer = e.layer; // La capa dibujada

    if (!selectedDevice.value) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un dispositivo antes de crear una geozona.',
        icon: 'warning',
        confirmButtonText: 'Cerrar'
      });

      // Elimina la capa dibujada si no hay dispositivo seleccionado
      map.value.removeLayer(layer);
      return;
    }

    // Pregunta si el usuario quiere crear la geozona
    Swal.fire({
      title: 'Confirmar Creación de Geozona',
      text: `¿Desea crear una geozona para el dispositivo ${selectedDevice.value.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        drawnItems.value.addLayer(layer);
        storeShape(layer); // Almacena la forma dibujada

        Swal.fire({
          title: 'Geozona Creada',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
      } else {
        // Elimina la capa dibujada si el usuario cancela
        map.value.removeLayer(layer);
        Swal.fire({
          title: 'Cancelado',
          text: 'La creación de la geozona ha sido cancelada.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
        });
      }
    });
  });

  // Evento al eliminar una geometría
  map.value.on('pm:remove', (e) => {
    console.log('Forma eliminada:', e.layer);
  });
};

const storeShape = (layer) => {
  if (!selectedDevice.value) return;

  // Inicializa el array si no existe para el dispositivo seleccionado
  if (!deviceShapes.value[selectedDevice.value.id]) {
    deviceShapes.value[selectedDevice.value.id] = [];
  }
  
  // Almacena la capa en el dispositivo correspondiente
  deviceShapes.value[selectedDevice.value.id].push(layer);
};

const selectDevice = (device) => {
  // Limpiar las geozonas dibujadas anteriores
  drawnItems.value.clearLayers();

  // Establecer el dispositivo seleccionado
  selectedDevice.value = device;

  // Agregar las geozonas del dispositivo seleccionado al mapa
  if (deviceShapes.value[device.id]) {
    deviceShapes.value[device.id].forEach(layer => {
      drawnItems.value.addLayer(layer);
    });
  }

  Swal.fire({
    title: 'Dispositivo Seleccionado',
    text: device.name,
    confirmButtonText: 'Crear Geozona',
    showCancelButton: true,
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isDismissed) {
      // Si se presiona cancelar, mostrar aviso de no selección de dispositivo
      selectedDevice.value = null;
    }
  });
};

const deleteLastShape = () => {
  if (!selectedDevice.value || !deviceShapes.value[selectedDevice.value.id]) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No hay formas asociadas a este dispositivo.',
    });
    return;
  }

  const shapesForDevice = deviceShapes.value[selectedDevice.value.id];
  if (shapesForDevice.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Sin Geozonas',
      text: 'Este dispositivo no tiene geozonas creadas.',
    });
    return;
  }

  const lastShape = shapesForDevice.pop();
  if (lastShape) {
    map.value.removeLayer(lastShape);
    Swal.fire({
      icon: 'success',
      title: 'Geozona Eliminada',
      text: 'La última geozona creada ha sido eliminada.',
    });
  }
};


const filterResults = () => {
  const query = searchQuery.value.toLowerCase();
  filteredResults.value = devices.value.filter(item =>
    item.name.toLowerCase().includes(query)
  );
};

onMounted(() => {
  filteredResults.value = devices.value; // Inicializa la lista filtrada
  initMap(); // Inicializa el mapa
  typeEffect();
});

onUnmounted(() => {
  clearTimeout(typingInterval);
});

</script>



<style scoped>
#map {
  height: calc(100vh - 60px);
  width: 100%; 
  z-index: 0; 
}

.coordinates-table {
  border-collapse: collapse;
  width: 100%;
}

.coordinates-table,
.coordinates-table th,
.coordinates-table td {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  font-size: 10px;
}

.home {
  height: 100vh;
  overflow: hidden;
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

.iframe-container {
  position: relative;
  width: 100%;
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.iframe-container iframe {
  position: relative;
  z-index: 0;
}

.tituloo {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
}

.hone {
  margin-right: 20px;
  width: 17%;
  background-color: var(--sidebar-color);
  height: 340px;
  position: absolute;
  top: 25%;
  z-index: 10;
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto;
  border: 1px solid;
  overflow-x: hidden;
}

.hone h1 {
  text-align: left;
  margin-top: 10px;
  margin-left: 20px;
  font-size: 15px;
  position: relative;
  z-index: 1;
  color: var(--text-color);
}

.group {
  display: flex;
  line-height: 28px;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 250px;
  margin-top: 10px;
}

.input {
  width: 100%;
  height: 40px;
  line-height: 28px;
  padding: 0 1rem;
  padding-left: 2.5rem;
  border: 2px solid;
  border-radius: 8px;
  outline: none;
  background-color: var(--body-color);
  color: var(--text-color);
  transition: .3s ease;
}

.input::placeholder {
  color: var(--text-color);
}

.icon {
  position: absolute;
  left: 1rem;
  fill: #9e9ea7;
  width: 1rem;
  height: 1rem;
  font-size: 21px;
}

.device-list {
  list-style: none;
  padding: 0;
  margin: 20px;
}

.device-list li {
  color: var(--text-color);
  padding: 5px 0;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  margin-left: 20px;
}

.button {
  --main-focus: #2d8cf0;
  --font-color: #323232;
  --bg-color-sub: #dedede;
  --bg-color: #eee;
  --main-color: #323232;
  position: relative;
  width: 190px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid;
  box-shadow: 4px 4px var(--body-color);
  background-color: var(--body-color);
  border-radius: 10px;
  overflow: hidden;
}

.button,
.button__text {
  transition: all 0.3s;
}

.button .button__text {
  transform: translateX(33px);
  color: var(--text-color);
  font-weight: 600;
}


.button:hover {
  background: var(--body-color);

}

.button:hover .button__text {
  color: var(--text-color);
}

.button:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px var(--main-color);
}
</style>