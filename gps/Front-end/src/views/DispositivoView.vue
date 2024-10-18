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


    <div class="crud">
      <div class="titu">
        <h1><i class='bx bx-car icoon'></i> Mis Dispositivos</h1>
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
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                </path>
              </g>
            </svg>
            <input placeholder="Buscar" type="search" class="input" v-model="searchTerm">
          </div>
        </div>

        <div class="tabla">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Dispositivo</th>
                <th>Responsable</th>
                <th>IMEI</th>
                <th>Status</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dispositivo, index) in filteredDispositivos" :key="dispositivo._id">
                <td>{{ index + 1 }}</td>
                <td>{{ dispositivo.deviceName }}</td>
                <td>{{ dispositivo.responsible }}</td>
                <td>{{ dispositivo.imei }}</td>
                <td>{{ dispositivo.status }}</td>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';

// Estado para el dropdown y la búsqueda
const dropdownOpen = ref(false);
const searchTerm = ref('');
const dispositivos = ref([]); // Cambiado a un array vacío

const fullText = "Navify";
const displayedText = ref("");
let currentIndex = 0;
let isDeleting = false;
let typingInterval;

// Efecto de tipo de texto
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

// Cargar dispositivos desde la base de datos
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3001/devices');
    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    const data = await response.json();
    console.log('Respuesta de la API:', data); // Añadir este log
    dispositivos.value = data; // Asegúrate de que data es un array de dispositivos
  } catch (error) {
    console.error('Error al cargar dispositivos:', error);
  }
});

// Computed property para filtrar los dispositivos
const filteredDispositivos = computed(() => {
  return dispositivos.value.filter(dispositivo =>
    dispositivo.deviceName.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Alternar visibilidad del dropdown
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Insertar un nuevo dispositivo
const insertarDispositivo = async () => {
  const { value: imei } = await Swal.fire({
    title: 'Agregar Dispositivo',
    html: ` 
      <input id="nombre" class="swal2-input" placeholder="Nombre del dispositivo">
      <input id="responsable" class="swal2-input" placeholder="Responsable">
      <input id="imei" class="swal2-input" placeholder="IMEI">
      <input id="estatus" class="swal2-input" placeholder="Estatus">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Agregar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nombre = document.getElementById('nombre').value;
      const responsable = document.getElementById('responsable').value;
      const imei = document.getElementById('imei').value;
      const estatus = document.getElementById('estatus').value;

      // Validar que todos los campos estén completos
      if (!nombre || !responsable || !imei || !estatus) {
        Swal.showValidationMessage('Por favor, complete todos los campos.');
        return false; // Evita que se continúe si hay un error
      }

      // Comprobar si el IMEI ya existe
      const existingDevice = dispositivos.value.find(device => device.imei === imei);
      if (existingDevice) {
        Swal.showValidationMessage('El IMEI ya está en uso.');
        return false; // Evita que se continúe si el IMEI ya existe
      }

      return { deviceName: nombre, responsible: responsable, imei, status: estatus };
    }
  });

  // Si se confirma, agregar el dispositivo
  if (imei) {
    fetch('http://localhost:3001/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(imei) // Usar el objeto devuelto
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al agregar dispositivo');
      }
      return response.json();
    })
    .then(data => {
      dispositivos.value.push(data); 
      Swal.fire('¡Dispositivo agregado!', '', 'success');
    })
    .catch((error) => {
      console.error('Error al agregar dispositivo:', error);
      Swal.fire('Error', 'No se pudo agregar el dispositivo', 'error');
    });
  }
};


// Editar un dispositivo
const editarDispositivo = (index) => {
  const dispositivo = dispositivos.value[index];

  Swal.fire({
    title: 'Editar Dispositivo',
    html: ` 
      <input id="nombre" class="swal2-input" placeholder="Nombre" value="${dispositivo.deviceName}">
      <input id="responsable" class="swal2-input" placeholder="Responsable" value="${dispositivo.responsible}">
      <input id="imei" class="swal2-input" placeholder="IMEI" value="${dispositivo.imei}">
      <input id="estatus" class="swal2-input" placeholder="Estatus" value="${dispositivo.status}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nombre = document.getElementById('nombre').value;
      const responsable = document.getElementById('responsable').value;
      const imei = document.getElementById('imei').value;
      const estatus = document.getElementById('estatus').value;

      // Validar que todos los campos estén completos
      if (!nombre || !responsable || !imei || !estatus) {
        Swal.showValidationMessage('Por favor, complete todos los campos.');
        return false; // Evita que se continúe si hay un error
      }

      console.log('Datos a editar:', { deviceName: nombre, responsible: responsable, imei, status: estatus });

      return { deviceName: nombre, responsible: responsable, imei, status: estatus }; 
    }
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:3001/devices/${dispositivo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result.value)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al editar dispositivo');
        }
        return response.json();
      })
      .then(data => {
        // Actualizar el dispositivo en la lista
        dispositivos.value.splice(index, 1, data); 
        console.log('Dispositivo editado:', data); // Verificar el dispositivo editado
        Swal.fire('¡Dispositivo editado!', '', 'success');
      })
      .catch((error) => {
        console.error('Error al editar dispositivo:', error);
        Swal.fire('Error', 'No se pudo editar el dispositivo', 'error');
      });
    }
  });
};

// Eliminar un dispositivo
const eliminarDispositivo = (index) => {
  const dispositivo = dispositivos.value[index];

  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar el dispositivo ${dispositivo.deviceName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:3001/devices/${dispositivo._id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar dispositivo');
        }
        return response.json();
      })
      .then(() => {
        dispositivos.value.splice(index, 1); 
        console.log('Dispositivo eliminado:', dispositivo); // Verificar el dispositivo eliminado
        Swal.fire('¡Dispositivo eliminado!', '', 'success');
      })
      .catch((error) => {
        console.error('Error al eliminar dispositivo:', error);
        Swal.fire('Error', 'No se pudo eliminar el dispositivo', 'error');
      });
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
  max-height: 400px;
  padding: 10px 10px;
  background-color: var(--sidebar-color);
  overflow-y: auto; 
}

table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: center;
  padding: 15px;
  color: var(--text-colar);

}
</style>
