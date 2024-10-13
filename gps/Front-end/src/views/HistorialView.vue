<template>
  <section class="home">
    <div class="overlay"></div>
    <div class="navar">
      <div class="text">
        <h1 class="titulo">Navify</h1>
      </div>

      <div class="actions">
        <!-- Menú desplegable de configuración -->
        <div class="dropdown">
          <button class="dropbtn" @click="toggleDropdown">
            <i class='bx bx-cog confi'></i> Settings
          </button>
          <div class="dropdown-content" :class="{ 'show': dropdownOpen }">
            <a href="#"><i class='bx bx-user-circle iconsub'></i> Perfil</a>
            <a href="#"><i class='bx bx-lock-alt iconsub'></i> Contraseña</a>
            <a href="#"><i class='bx bx-bell iconsub'></i> Notificaciones</a>
            <a href="#"><i class='bx bx-user-x iconsub'></i> Privacidad</a>
          </div>
        </div>
      </div>
    </div>

    <div class="arribaBp">
      <div class="hone2">
        <h1>Historial</h1>
      </div>
      <div id="play-content">
        <button @click="playRecording" class="play-button">Reproducir Historial</button>
      </div>

    </div>

    <div class="tituloo">
      <div class="hone">
        <h1>Historial de Dispositivo</h1>
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
            <li @click="showAlert(item.name)" v-for="item in filteredResults" :key="item.id">{{ item.name }}
              <i class='bx bxs-car icon'></i>
            </li>
          </router-link>
        </ul>
      </div>
      <div id="map" class="map-container"></div>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import L from 'leaflet';
import gpsIcon from '../assets/gps.png';

let map;
let polyline;
let marker;
let playbackInterval;
const playbackSpeed = 1000; // Velocidad de reproducción en milisegundos

// Inicializa el mapa
function initMap() {
  const colombia = [4.5709, -74.2973]; // Latitud y longitud de Colombia
  map = L.map('map').setView(colombia, 6);

  // Cargar capa de mapa base
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
}

// Función para mostrar alertas personalizadas
const showAlert = (name) => {
  if (name === 'Jesus Alvarez') {
    // Alerta con formulario para seleccionar rango de fechas y horas
    Swal.fire({
      title: 'Seleccionar rango de fechas y horas',
      html:
        '<label for="start-date">Fecha inicial:</label>' +
        '<input type="date" id="start-date" class="swal2-input">' +
        '<label for="end-date">Fecha fin:</label>' +
        '<input type="date" id="end-date" class="swal2-input">',
      width: '60%',
      confirmButtonText: 'Ver Historial',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (!startDate || !endDate) {
          Swal.showValidationMessage('Por favor ingrese todas las fechas');
        }
        return { startDate, endDate, };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        showHistory(result.value.startDate, result.value.endDate);
      }
    });
  } else {
    // Alerta simple para buscar dispositivo
    Swal.fire({
      title: name,
      confirmButtonText: 'Buscar Dispositivo',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    });
  }
};

// Función para mostrar historial de coordenadas en el mapa
const showHistory = () => {
  const coordenadas = [
    [10.9878, -74.7889], // Punto 1 (Barranquilla)
    [10.9885, -74.7895], // Punto 2
    [10.9900, -74.7900], // Punto 3
    [10.9920, -74.7910], // Punto 4
    [10.9930, -74.7920]  // Punto 5
  ];

  // Limpiar cualquier polyline existente
  if (polyline) {
    map.removeLayer(polyline);
  }

  // Dibujar polyline con las coordenadas
  polyline = L.polyline(coordenadas, { color: 'red' }).addTo(map);

  // Agregar marcador inicial con el icono de GPS
  const gpsMarker = L.icon({
    iconUrl: gpsIcon,
    iconSize: [40, 40]
  });

  marker = L.marker(coordenadas[0], { icon: gpsMarker }).addTo(map).bindPopup('Inicio');

  // Ajustar el mapa para mostrar el polyline completo
  map.fitBounds(polyline.getBounds());

  // Guardar las coordenadas para la reproducción
  window.recordingCoords = coordenadas;
};

// Función para iniciar la reproducción del recorrido
const playRecording = () => {
  if (!window.recordingCoords) return;

  let index = 0;

  // Limpiar cualquier intervalo de reproducción existente
  if (playbackInterval) {
    clearInterval(playbackInterval);
  }

  // Reproducción de recorrido
  playbackInterval = setInterval(() => {
    if (index < window.recordingCoords.length) {
      const coord = window.recordingCoords[index];
      marker.setLatLng(coord);
      map.setView(coord, map.getZoom()); // Opcional: Ajusta el zoom si es necesario
      index++;
    } else {
      clearInterval(playbackInterval); // Detener cuando termine
    }
  }, playbackSpeed);
};

const dropdownOpen = ref(false);
const searchQuery = ref('');
const devices = ref([
  { id: 1, name: 'Jesus Alvarez' },
  { id: 2, name: 'RTY687' },
  { id: 3, name: 'SJS981' },
  { id: 4, name: 'HDS432' }
]);
const filteredResults = ref([]);

// Función para alternar la visibilidad del dropdown
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

// Función para filtrar resultados según la consulta de búsqueda
function filterResults() {
  const query = searchQuery.value.toLowerCase();
  filteredResults.value = devices.value.filter(item =>
    item.name.toLowerCase().includes(query)
  );
}

// Inicializar resultados filtrados al montar el componente
onMounted(() => {
  filteredResults.value = devices.value;
  initMap(); // Inicializa el mapa Leaflet al montar el componente
});
</script>


<style scoped>
.map-container {
  height: calc(100vh - 60px);
  width: 100%; 
  z-index: 0; 
}


.play-button {
  width: 17%;
  position: absolute;
  bottom: 80px;
  padding: 10px 20px;
  background-color: var(--body-color);
  color: var(--text-color);
  font-weight: 600;
  margin-left: 30px;
  border: 1px solid;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  z-index: 3;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.home {
  height: 100vh;
  overflow: hidden;
}

.home .navar {
  background-color: var(--sidebar-color);
  border-bottom: 3px solid var(--body-color);
  z-index: 2;
}

.home .navar,
.home .titulo,
.home .subtitulo {
  position: relative;
  z-index: 2;
}

.tituloo {
  position: relative;
  z-index: 1;
}

.hone {
  margin-left: 30px;
  width: 17%;
  background-color: var(--sidebar-color);
  height: 280px;
  position: absolute;
  top: 35%;
  z-index: 2;
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto;
  border: 1px solid;
}

.hone h1 {
  text-align: left;
  margin-top: 10px;
  margin-left: 20px;
  font-size: 13px;
  position: relative;
  z-index: 1;
  color: var(--text-color);
}

.hone2 {
  margin-left: 30px;
  background-color: var(--sidebar-color);
  height: 50px;
  position: absolute;
  top: 30%;
  z-index: 2;
  border-radius: 10px;
  padding: 5px 15px;
  overflow-y: auto;
  /* Para permitir el desplazamiento si la lista es larga */
  border: 1px solid;
}

.hone2 h1 {
  text-align: center;
  margin-top: 10px;
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
  fill: var(--text-color);
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
</style>
