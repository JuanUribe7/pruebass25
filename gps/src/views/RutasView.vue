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
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

onMounted(() => {
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

  document.getElementById('saveRoute').addEventListener('click', async function() {
    if (waypoints.length > 1) {
      const route = waypoints.map(point => ({ lat: point.lat, lng: point.lng }));
      try {
        const response = await axios.post('http://3.12.147.103/routes/save-route', { name: 'Mi Ruta', waypoints: route });
        console.log('Ruta guardada:', response.data);
        alert('Ruta guardada');
      } catch (error) {
        alert('Error al guardar la ruta:', error.message);
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

  document.getElementById('clearRoute').addEventListener('click', function() {
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
});

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
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  gap: 10px;
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
</style>