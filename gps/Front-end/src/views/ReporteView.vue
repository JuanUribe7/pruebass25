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

    <div class="crud">
      <div class="titu">
        <h1><i class='bx bxs-report icoon'></i> Reportes</h1>
      </div>

      <div class="cruds">
        <div class="tituloss">
          <div class="tituloA">
            <h1>Generar reporte</h1>
          </div>
          <div class="tituloB">
            <h1>Seleccionar Reportes</h1>

            <div class="submenu">
              <div class="select">
                <input type="text" readonly :value="selectedDevice || 'Seleccione un dispositivo'"
                  @click="toggleDeviceDropdown" />
                <i class="arrow" @click="toggleDeviceDropdown">&#9660;</i>
              </div>
              <ul v-if="deviceDropdownOpen" class="dropdown-menu">
                <li v-for="device in devices" :key="device" @click="selectDevice(device)">
                  {{ device }}
                  <i class='bx bxs-car iconn'></i>
                </li>
              </ul>
            </div>

            <div class="fechas">
              <div class="derecha">
                <label for="start-date">Fecha inicial:</label>
              </div>
              <div class="centro">
                <label for="end-date">Fecha fin:</label>
              </div>
            </div>

            <div class="dates">
              <div class="derecha2">
                <input type="text" id="start-date" ref="startDatePicker" placeholder="yy/mm/dd" />
              </div>
              <div class="centro2">
                <input type="text" id="end-date" ref="endDatePicker" placeholder="yy/mm/dd" />
              </div>
            </div>
            <div class="botonR" @click="generarG">
              <button>Generar Reportes</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="container-graph">
      <!-- Gráfica de barras -->
      <div class="containerG" v-if="showGraph">
        <Bar :data="chartData" :options="chartOptions" />
      </div>

      <!-- Gráfica de pastel -->
      <div class="containerPie" v-if="showPieChart">
        <Pie :data="pieChartData" :options="pieChartOptions" />
      </div>
    </div>
  </section>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Bar, Pie } from 'vue-chartjs';
import Swal from 'sweetalert2';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const showGraph = ref(false);
const showPieChart = ref(false);
const startDatePicker = ref(null);
const endDatePicker = ref(null);  


function generarG() {

  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  if (!selectedDevice.value) {
    Swal.fire({
      title: "Error",
      text: "Por favor, seleccione un dispositivo.",
      icon: "warning"
    });
    return;
  }

  if (!startDate || !endDate) {
    Swal.fire({
      title: "Error",
      text: "Por favor, seleccione ambas fechas.",
      icon: "warning"
    });
    return;
  }

  showGraph.value = true;
  showPieChart.value = true;
}

// Datos reactivos para la gráfica
const chartData = ref({
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
  datasets: [
    {
      label: 'Ventas',
      backgroundColor: '#42A5F5',
      data: [40, 20, 30, 60, 90],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: '#000000',
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#000000',
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: '#000000',
      },
    },
  },
});

// Datos reactivos para la gráfica de pastel
const pieChartData = ref({
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
  datasets: [
    {
      label: 'Distribución',
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      data: [12, 19, 3, 5, 2],
    },
  ],
});

const pieChartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#000000',
      },
    },

    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.label || '';
          if (context.parsed !== null) {
            label += `: ${context.parsed}`;
          }
          return label;
        },
      },
    },
  },
});

// Datos reactivos para el menú desplegable
const dropdownOpen = ref(false);
const deviceDropdownOpen = ref(false);
const selectedDevice = ref(null);
const devices = ref(['RTY687', 'SJS981', 'HDS432']);

// Métodos
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const toggleDeviceDropdown = () => {
  deviceDropdownOpen.value = !deviceDropdownOpen.value;
};

const selectDevice = (device) => {
  selectedDevice.value = device;
  deviceDropdownOpen.value = false;
};

onMounted(() => {
  flatpickr(startDatePicker.value, {
    dateFormat: "Y-m-d",
  });
  flatpickr(endDatePicker.value, {
    dateFormat: "Y-m-d",
  });
});

</script>

<style scoped>
.home {
  min-height: 160vh;

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
  justify-content: flex-end;
}

.crud {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.titu {
  margin-left: 50px;
  margin-top: 40px;
  display: flex;
}

.listad {
  margin-left: 50px;
  margin-top: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.listad h1 {
  font-weight: 400;
  color: var(--text-colar);
}

.listad .boton {
  margin-right: 50px;
}

.titu h1 {
  color: var(--text-colar);
}

.titu h1 i {
  margin-right: 10px;
}

.cruds {
  margin: 20px 20px;
  border-radius: 10px;
  background-color: var(--sidebar-color);
  height: 400px;
  padding: 15px;
}

.cruds .tituloss {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.cruds .tituloA {
  margin: 10px 20px;
}

.cruds .tituloA h1 {
  color: var(--text-colar);
}

.cruds .tituloB {
  margin: 10px 20px;
}

.cruds .tituloB h1 {
  color: var(--text-colar);
  font-weight: 400;
  font-size: 20px;
}

.cruds .submenu {
  margin-top: 10px;
}

.select {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.select input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--text-colar);
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--sidebar-color);
  color: var(--text-colar);
  font-weight: 500;
}

.select .arrow {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: var(--text-colar);
}

.dropdown-menu {
  position: absolute;
  width: 92.2%;
  border: 1px solid var(--text-colar);
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
  background-color: var(--sidebar-color);
  color: var(--text-colar);
  z-index: 1000;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dropdown-menu li {
  margin-left: 40px;
  padding: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 300;
}

.iconn {
  position: absolute;
  left: 1rem;
  fill: #9e9ea7;
  width: 1rem;
  height: 1rem;
  font-size: 21px;
}

.dropdown-menu li:hover {
  border-radius: 10px;
  background-color: var(--body-color);
}

.cruds .fechas {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.cruds .fechas .derecha {
  margin-left: 0 auto;
  color: var(--text-colar);
}

.cruds .fechas .centro {
  margin: auto;
  color: var(--text-colar);
}

.cruds .dates input{
  width: 100%;
  padding: 10px;
  cursor: pointer; 
}

.cruds .dates {
  margin-top: 20px;
  display: flex;
  align-items: center;
  width: 100%;

}


.arrow {
  pointer-events: none;
}

.cruds .dates ::placeholder{
  color: var(--text-colar);
  font-weight: 200;
}

.cruds .dates input{
  color: var(--text-colar);
}

.cruds .dates .derecha2 {
  margin-left: 0 auto;
  color: var(--text-colar);
}

.cruds .dates .derecha2 input {
  width: 280%;
  height: 40px;
  background-color: var(--body-color);
  border: none;
  padding: 20px;
  border: 1px solid var(--text-colar);
  border-radius: 4px;
}

.cruds .dates .centro2 {
  margin: 0 auto;
  color: var(--text-colar);
}

.cruds .dates .centro2 input {
  width: 280%;
  height: 40px;
  background-color: var(--body-color);
  border: none;
  padding: 20px;
  margin-left: 20px;
  margin-right: -19.5px;
  border: 1px solid var(--text-colar);
  border-radius: 4px;
}

.botonR {
  margin-top: 30px;
}

.botonR button {
  padding: 12.5px 30px;
  border: 1px solid var(--text-colar);
  border-radius: 100px;
  background-color: var(--body-color);
  color: var(--text-colar);
  font-weight: 500;
  cursor: pointer;
}

.container-graph {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.containerG {
  width: 40%;
  height: 440px;
}

.containerPie {
  width: 32%;
  height: 440px;
}

.containerG canvas,
.containerPie canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
