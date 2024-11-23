<template>
  <div class="home">
    <div class="overlay"></div>
    <NavBar />
    <div id="map" class="map-container"></div>
    <div class="btns">
      <button id="saveRoute" class="boton">Guardar Ruta</button>
      <button id="clearRoute" class="boton">Volver a Crear</button>
      <button @click="loadRoute" class="boton">Cargar Ruta</button>
    </div>
    <div class="hone2">
      <h1>Rutas</h1>
    </div>
    <div class="tituloo">
      <div class="hone">
        <h1>Seleccionar Ruta</h1>
        <div class="group">
          <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path
                d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
              </path>
            </g>
          </svg>
          <input placeholder="Buscar" type="search" class="input" v-model="searchQuery" @input="filterResults">
        </div>
        <div class="device-list-container">
          <ul class="device-list">
            <li @click="selectRoute(route)" v-for="route in filteredResults" :key="route._id">
              <i class='bx bxs-map'></i>
              {{ route.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NavBar from '../components/NavBar.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

let map;
let waypoints = [];
let routeControl = null;
const searchQuery = ref('');
const routes = ref([]);
const filteredResults = ref([]);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

onMounted(() => {
  cargarRutas();
  map = L.map('map').setView([10.9685, -74.7813], 20);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  map.on('click', function(e) {
    const latlng = e.latlng;
    waypoints.push(latlng);
    L.marker(latlng).addTo(map);

    if (waypoints.length > 1) {
      if (routeControl) {
        map.removeControl(routeControl);
      }
      routeControl = L.Routing.control({
        waypoints: waypoints,
        createMarker: function() { return null; },
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim()
      }).addTo(map);
    }
  });

  const saveRouteButton = document.getElementById('saveRoute');
  if (saveRouteButton) {
    saveRouteButton.addEventListener('click', async function() {
      if (waypoints.length > 1) {
        const route = waypoints.map(point => ({ lat: point.lat, lng: point.lng }));
        try {
          const response = await axios.post('http://3.12.147.103/routes/save-route', { name: 'Mi Ruta', waypoints: route });
          console.log('Ruta guardada:', response.data);
          alert('Ruta guardada');
          cargarRutas();
        } catch (error) {
          console.error('Error al guardar la ruta:', error.message);
          if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
            alert(`Error al guardar la ruta: ${error.response.data.error}`);
          } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error('Error request:', error.request);
            alert('Error al guardar la ruta: No se recibió respuesta del servidor.');
          } else {
            // Algo pasó al configurar la solicitud
            console.error('Error message:', error.message);
            alert(`Error al guardar la ruta: ${error.message}`);
          }
        }
      } else {
        alert('Agrega al menos dos puntos para crear una ruta.');
      }
    });
  }

  const clearRouteButton = document.getElementById('clearRoute');
  if (clearRouteButton) {
    clearRouteButton.addEventListener('click', function() {
      waypoints = [];
      if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
      }
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    });
  }
});

const cargarRutas = async () => {
  try {
    const response = await fetch('http://3.12.147.103/routes');
    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    const data = await response.json();
    routes.value = data;
    console.log('Rutas Cargadas:', routes.value);
    filteredResults.value = routes.value;
  } catch (error) {
    console.error('Error al cargar rutas:', error);
  }
};

const filterResults = () => {
  const query = searchQuery.value.toLowerCase();
  filteredResults.value = routes.value.filter(route => {
    return route.name.toLowerCase().includes(query);
  });
};

const selectRoute = async (route) => {
  console.log('Ruta seleccionada:', route);
  try {
    const response = await axios.get(`http://3.12.147.103/routes/get-route/${route._id}`);
    const routeData = response.data.waypoints;
    waypoints = routeData.map(point => L.latLng(point.lat, point.lng));
    if (routeControl) {
      map.removeControl(routeControl);
    }
    routeControl = L.Routing.control({
      waypoints: waypoints,
      createMarker: function() { return null; },
      routeWhileDragging: true,
      geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map);
  } catch (error) {
    console.error('Error al cargar la ruta:', error.message);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      alert(`Error al cargar la ruta: ${error.response.data.error}`);
    } else if (error.request) {
      console.error('Error request:', error.request);
      alert('Error al cargar la ruta: No se recibió respuesta del servidor.');
    } else {
      console.error('Error message:', error.message);
      alert(`Error al cargar la ruta: ${error.message}`);
    }
  }
};

const loadRoute = async () => {
  try {
    const response = await axios.get('http://3.12.147.103/routes/get-route/ID_DE_LA_RUTA');
    const route = response.data.waypoints;
    waypoints = route.map(point => L.latLng(point.lat, point.lng));
    if (routeControl) {
      map.removeControl(routeControl);
    }
    routeControl = L.Routing.control({
      waypoints: waypoints,
      createMarker: function() { return null; },
      routeWhileDragging: true,
      geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map);
  } catch (error) {
    console.error('Error al cargar la ruta:', error.message);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      alert(`Error al cargar la ruta: ${error.response.data.error}`);
    } else if (error.request) {
      console.error('Error request:', error.request);
      alert('Error al cargar la ruta: No se recibió respuesta del servidor.');
    } else {
      console.error('Error message:', error.message);
      alert(`Error al cargar la ruta: ${error.message}`);
    }
  }
};
</script>

<style scoped>
.map-container {
  height: calc(100vh - 60px);
  width: 100%; 
  z-index: 0; 
}

.home {
  height: 100vh;
  overflow: hidden; 
  position: relative;
}

.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 460px;
  right: 700px;
  z-index: 1000;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  gap: 10px;
  margin-top: 50px;
}

.boton {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 12px;
}
.home {
  height: 100vh;
  overflow: hidden;
}

.actions {
  align-items: center;
  display: flex;
}

.dropdown {
  display: inline-block;
  position: relative;
}

.dropdown-content {
  background-color: var(--sidebar-color);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: none;
  margin-right: 30px;
  min-width: 200px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 3;
}

.dropdown-content.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.dropdown-item {
  align-items: center;
  color: var(--text-colar);
  display: flex;
  padding: 12px 16px;
  text-decoration: none;
  transition: background-color 0.2s, transform 0.2s;
}

.dropdown-item:hover {
  background-color: var(--body-color);
  color: var(--text-colar);
  transform: translateX(5px);
}

.dropdown-item i {
  font-size: 1.2em;
  margin-right: 12px;
  text-align: center;
  width: 20px;
}

.dropdown-item span {
  font-weight: 500;
}

.dropdown-item:not(:last-child) {
  border-bottom: 1px solid rgba(var(--text-colar-rgb), 0.1);
}

.dropbtn {
  align-items: center;
  background-color: var(--sidebar-color);
  border: none;
  border-radius: 5px;
  color: var(--text-colar);
  cursor: pointer;
  display: flex;
  font-size: 16px;
  gap: 5px;
  padding: 10px 15px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.dropbtn:hover {
  background-color: var(--body-color);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.home .actions {
  align-items: center;
  display: flex;
}

.home .navar {
  background-color: var(--sidebar-color);
  border-bottom: 3px solid var(--body-color);
}

.home .text {
  position: relative;
  z-index: 2;
}

.notification-btn {
  background: none;
  border: none;
  color: var(--text-colar);
  cursor: pointer;
  font-size: 1.7rem;
  margin-right: 15px;
  margin-top: 10px;
  position: relative;
}

.notification-indicator {
  background-color: var(--text-colar);
  border-radius: 50%;
  height: 15px;
  position: absolute;
  right: -1px;
  width: 15px;
}

.titulo {
  display: inline-block;
  min-width: 100px;
}

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
  font-size: 10px;
  padding: 8px;
  text-align: center;
}

.iframe-container {
  align-items: center;
  display: flex;
  height: 650px;
  justify-content: center;
  position: relative;
  width: 100%;
}

.iframe-container iframe {
  position: relative;
  z-index: 0;
}

.tituloo {
  display: flex;
  justify-content: flex-start;
  position: relative;
  z-index: 1;
}

.hone2 {
  margin-left: 30px;
  background-color: var(--sidebar-color);
  height: 50px;
  position: absolute;
  top: 25%;
  z-index: 2;
  border-radius: 10px;
  padding: 5px 15px;
  border: 1px solid;
}

.hone2 h1 {
  text-align: center;
  margin-top: 10px;
  font-size: 15px;
  color: var(--text-color);
}

.hone {
  margin-left: 30px;
  width: 17%;
  background-color: var(--sidebar-color);
  height: 280px;
  position: absolute;
  top: 30%;
  z-index: 2;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid;
}

.hone h1 {
  margin-top: 10px;
  font-size: 16px;
  text-align: center;
  color: var(--text-color);
}

.group {
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: 28px;
  margin-top: 10px;
  max-width: 250px;
  position: relative;
}

.input {
  background-color: var(--body-color);
  border: 2px solid;
  border-radius: 8px;
  color: var(--text-color);
  height: 40px;
  line-height: 28px;
  outline: none;
  padding: 0 1rem;
  padding-left: 2.5rem;
  transition: .3s ease;
  width: 100%;
}

.input::placeholder {
  color: var(--text-color);
}

.icon {
  fill: #9e9ea7;
  font-size: 21px;
  height: 1rem;
  left: 1rem;
  position: absolute;
  width: 1rem;
}

.icoon {
  fill: #9e9ea7;
  font-size: 21px;
  height: 1rem;
  right: 4rem;
  position: relative;
  width: 1rem;
  font-size: 21px;
}

.device-list-container {
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 10px;
}

.device-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.device-list li {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  color: var(--text-color);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.device-list li:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.device-list li i {
  margin-right: 10px;
  font-size: 21px;
  flex-shrink: 0;
}

.device-list-container::-webkit-scrollbar {
  width: 6px;
}

.device-list-container::-webkit-scrollbar-track {
  background: var(--sidebar-color);
}

.device-list-container::-webkit-scrollbar-thumb {
  background-color: var(--body-color);
  border-radius: 3px;
}

.generate-route-btn{
  padding: 4px;
  border-radius: 5px;
  border: 1px solid var(--text-color);
  margin-right: 5px;
  color: var(--text-color);
  background-color: var(--sidebar-color);
  font-weight: 600;
  cursor: pointer;
}

.dark-mode-table {
  background-color: #333;
  color: #fff;
  border: 1px solid #444;
}

.dark-mode-table th,
.dark-mode-table td {
  border: 1px solid #444;
}

.dark-mode-table th {
  background-color: #444;
}

.dark-mode-table tr:nth-child(even) {
  background-color: #555;
}

.dark-mode-table tr:nth-child(odd) {
  background-color: #666;
}

.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  margin: 15% auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 500px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

.device-list-modal {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}

.device-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 5px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.device-item:hover {
  background-color: #f0f0f0;
}

.create-button {
  background-color: #4CAF50; /* Verde */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.create-button:hover {
  background-color: #45a049; /* Verde más oscuro */
}

</style>
