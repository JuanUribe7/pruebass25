<template>
    <div class="home">
        <div class="overlay"></div>
        <NavBar />

        <div id="map" class="map-container"></div>
    </div>

    
</template>

<script setup>
import { onMounted } from 'vue';
import NavBar from '../components/NavBar.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
let map;


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

function initMap() {
  var colombia = { lat: 10.9685, lng: -74.7813 };
  const mapOptions = {
    center: colombia,
    zoom: 12.4
    
  };
  
  // Crear el objeto de mapa de Leaflet
  map = L.map('map').setView([colombia.lat, colombia.lng], mapOptions.zoom);

  // Agregar una capa de mapa
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

}

onMounted(() => {
  initMap();
});
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
</style>
