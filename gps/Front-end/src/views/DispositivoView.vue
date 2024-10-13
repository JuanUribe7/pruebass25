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
        <h1><i class='bx bx-car icoon'></i>Mis Dispositivos</h1>
      </div>

      <div class="listad">
        <div>
          <h1>Lista de Dispositivos</h1>
        </div>

        <div class="boton cssbuttons-io-button">
          <button @click="insertarDispositivo()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path>
            </svg>
            <span>Agregar Dispositivo</span>
          </button>
        </div>
      </div>

      <div class="cruds">
        <div class="arriba">
          <div>
            <i class='bx bx-location-plus iconD'></i>
          </div>
          <div class="group">
            <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path
                  d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                </path>
              </g>
            </svg>
            <input placeholder="Search" type="search" class="input" v-model="searchTerm">
          </div>
        </div>

        <div class="tabla">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Dispositivo</th>
                <th>Responsable</th>
                <th>Fecha de expiración</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dispositivo, index) in filteredDispositivos" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ dispositivo.nombre }}</td>
                <td>{{ dispositivo.responsable }}</td>
                <td>{{ dispositivo.fechaExpiracion }}</td>
                <td>
                  <i class='bx bx-edit iconD' @click="editarDispositivo(index)"></i>
                  <i class='bx bx-trash iconD' @click="eliminarDispositivo(index)"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';

const dropdownOpen = ref(false);
const searchTerm = ref('');
const dispositivos = ref([
  { nombre: 'Jesus Alvarez', responsable: 'N/A', fechaExpiracion: '2025-06-12' },
  { nombre: 'RTY687', responsable: 'N/A', fechaExpiracion: '2025-10-21' },
  { nombre: 'SJS981', responsable: 'N/A', fechaExpiracion: '2026-04-10' },
  { nombre: 'HDS432', responsable: 'N/A', fechaExpiracion: '2027-09-21' }
]);

// Computed property para filtrar los dispositivos
const filteredDispositivos = computed(() => {
  return dispositivos.value.filter(dispositivo =>
    dispositivo.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Alternar visibilidad del dropdown
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Insertar un nuevo dispositivo
const insertarDispositivo = () => {
  Swal.fire({
    title: 'Agregar Dispositivo',
    html:
      `<input id="nombre" class="swal2-input" placeholder="Nombre del dispositivo">
       <input id="responsable" class="swal2-input" placeholder="Responsable">
       <input id="fechaExpiracion" class="swal2-input" placeholder="Fecha de expiración" type="date">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Agregar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nombre = document.getElementById('nombre').value;
      const responsable = document.getElementById('responsable').value;
      const fechaExpiracion = document.getElementById('fechaExpiracion').value;
      
      if (!nombre || !responsable || !fechaExpiracion) {
        Swal.showValidationMessage('Por favor completa todos los campos');
      }
      return { nombre, responsable, fechaExpiracion };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { nombre, responsable, fechaExpiracion } = result.value;
      dispositivos.value.push({ nombre, responsable, fechaExpiracion });
      
      Swal.fire({
        title: '¡Bien hecho!',
        text: '¡Dispositivo agregado correctamente!',
        icon: 'success'
      });
    }
  });
};

// Editar un dispositivo existente
const editarDispositivo = (index) => {
  const dispositivo = dispositivos.value[index];

  Swal.fire({
    title: 'Editar Dispositivo',
    html:
      `<input id="nombre" class="swal2-input" placeholder="Nombre del dispositivo" value="${dispositivo.nombre}">
       <input id="responsable" class="swal2-input" placeholder="Responsable" value="${dispositivo.responsable}">
       <input id="fechaExpiracion" class="swal2-input" placeholder="Fecha de expiración" type="date" value="${dispositivo.fechaExpiracion}">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar cambios',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nombre = document.getElementById('nombre').value;
      const responsable = document.getElementById('responsable').value;
      const fechaExpiracion = document.getElementById('fechaExpiracion').value;
      
      if (!nombre || !responsable || !fechaExpiracion) {
        Swal.showValidationMessage('Por favor completa todos los campos');
      }
      
      return { nombre, responsable, fechaExpiracion };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { nombre, responsable, fechaExpiracion } = result.value;
      dispositivos.value[index] = { nombre, responsable, fechaExpiracion };
        
      Swal.fire({
        title: '¡Bien hecho!',
        text: '¡Dispositivo editado correctamente!',
        icon: 'success'
      });
    }
  });
};

// Eliminar un dispositivo
const eliminarDispositivo = (index) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esta acción.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      dispositivos.value.splice(index, 1);
      
      Swal.fire(
        '¡Eliminado!',
        'El dispositivo ha sido eliminado.',
        'success'
      );
    }
  });
};
</script>



<style scoped>
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
  justify-content: flex-end;
}

.crud {
  display: flex;
  flex-direction: column;
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

.cssbuttons-io-button button {
  display: flex;
  align-items: center;
  font-family: inherit;
  font-weight: 500;
  font-size: 16px;
  padding: 0.5em 1.4em;
  color: var(--text-colar);
  background: var(--body-color);
  border: 1px solid;
  border-radius: 20em;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.cssbuttons-io-button button svg {
  margin-right: 6px;
}

.cssbuttons-io-button button:hover {
  box-shadow: 0 0.5em 1.5em -0.5em #d5010198;
}

.cssbuttons-io-button button:active {
  box-shadow: 0 0.3em 1em -0.5em #14a73e98;
}

.cruds {
  margin: 20px 20px;
  border-radius: 10px;
  background-color: var(--sidebar-color);
  height: 500px;
  padding: 15px;

}

.cruds .arriba {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group {
  display: flex;
  line-height: 28px;
  align-items: center;
  position: relative;
  max-width: 190px;
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
  background-color: var(--sidebar-color);
  color: var(--text-colar);
  transition: .3s ease;
}

.input::placeholder {
  color: var(--text-colar);
}

.icon {
  position: absolute;
  left: 1rem;
  fill: var(--text-colar);
  width: 1rem;
  height: 1rem;
}

.iconD {
  font-size: 30px;
  color: var(--text-colar);
}

.cruds .tabla {
  margin: 20px 10px;
  background-color: var(--body-color);
  height: 400px;
  padding: 10px 10px;
  background-color: var(--sidebar-color);
}

table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: center;
  color: var(--text-colar);

}
</style>
