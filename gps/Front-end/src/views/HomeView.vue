<template>
  <section class="home">
    <!-- Overlay para efecto de superposición -->
    <div class="overlay"></div>

    <!-- Barra de navegación -->
    <div class="navar" style="background-color: var(--sidebar-color);
                               border-bottom: 3px solid var(--body-color);">
      <div class="text">
        <h1 class="titulo">Navify</h1>
      </div>

      <div class="actions">
        <!-- Botón de pantalla completa (comentado por ahora) -->
        <!--
        <button id="fullscreen-btn" class="icon-btn" @click="toggleFullscreen">
          <i :class="fullscreenIconClass"></i>
        </button>
        -->

        <!-- Menú desplegable de configuración -->
        <div class="dropdown">
          <button class="dropbtn" @click="toggleDropdown">
            <i class='bx bx-cog confi'></i> Settings 
          </button>
          <!-- Contenido del menú desplegable -->
          <div class="dropdown-content" :class="{ 'show': dropdownOpen }">
            <a href="#"><i class='bx bx-user-circle iconsub'></i> Perfil</a>
            <a href="#"><i class='bx bx-lock-alt iconsub'></i> Contraseña</a>
            <a href="#"><i class='bx bx-bell iconsub'></i> Notificaciones</a>
            <a href="#"><i class='bx bx-user-x iconsub'></i> Privacidad</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal de la sección -->
    <div class="tituloo">
      <div>
        <h1 class="hone">GPS Tracking Service</h1> 
        <h1 class="hone2">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1> 
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  name: 'HomeView',
  setup() {
    // Variables reactivas
    const dropdownOpen = ref(false);
    const fullscreenIconClass = ref('fas fa-expand');
    const isSidebarClosed = ref(false);
    const isDarkMode = ref(false);

    // Calculated property para texto de modo claro/oscuro
    const modeText = computed(() => (isDarkMode.value ? 'Light mode' : 'Dark mode'));

    // Función para alternar el modo de pantalla completa
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
          .then(() => {
            fullscreenIconClass.value = 'fas fa-compress';
          })
          .catch((err) => {
            console.error(`Error trying to enable full-screen mode: ${err.message} (${err.name})`);
          });
      } else {
        document.exitFullscreen()
          .then(() => {
            fullscreenIconClass.value = 'fas fa-expand';
          })
          .catch((err) => {
            console.error(`Error trying to disable full-screen mode: ${err.message} (${err.name})`);
          });
      }
    };

    // Función para alternar el estado del menú desplegable
    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    // Función para alternar el estado de la barra lateral (aunque no se usa en esta sección)
    const toggleSidebar = () => {
      isSidebarClosed.value = !isSidebarClosed.value;
    };

    // Función para alternar el modo claro/oscuro
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.body.classList.toggle('dark', isDarkMode.value);
    };

    // Función para cerrar la barra lateral al hacer clic fuera de ella
    const closeSidebarOnClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const toggle = document.querySelector('.toggle');
      if (!sidebar.contains(event.target) && !toggle.contains(event.target)) {
        isSidebarClosed.value = true;
      }
    };

    // Evento para añadir y quitar el listener al montar y desmontar el componente
    onMounted(() => {
      document.addEventListener('click', closeSidebarOnClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', closeSidebarOnClickOutside);
    });

    // Devolución de variables y funciones para el componente
    return {
      dropdownOpen,
      fullscreenIconClass,
      isSidebarClosed,
      isDarkMode,
      modeText,
      toggleFullscreen,
      toggleDropdown,
      toggleSidebar,
      toggleDarkMode,
    };
  },
};
</script>



<style scoped>
.home {
  position: relative;
  height: 100vh;
  background-image: url('../assets/fondo7.jpg');
  background-size: cover;
  transition: var(--tran-05);
}

.home .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

}

.home .navar,
.home .titulo,
.home .subtitulo {
  position: relative;
  z-index: 2;
}

body.dark .home {
  background-image: url('../assets/fondo1_1.jpg');
}

body.dark .home .overlay {
  background-color: rgba(0, 0, 0, 0.6);
  /* Ajusta la opacidad según necesites */
}

.home .text {
  font-size: 10px;
  font-weight: bold;
  color: var(--text-color);
  padding: 10px 0px 10px 0px;

}

.home .navar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  width: 100%;
  min-height: 30px;
  max-height: 50px;
  height: 50px;
  background-color: var(--body-color);
}

.home .navar .actions {
  display: flex;
  align-items: center;
}

.home .navar .titulo {
  margin-left: 40px;
  font-size: 20px;

}

.home .iconoOne .noti {
  font-size: 30px;
  color: var(--text-color);
}

.home .iconoOneO .noti {
  font-size: 25px;
  color: var(--text-color);
  margin-right: 20px;
}

.home .tituloo {
  display: flex;
  height: 70vh;
  flex-direction: column;
  justify-content: center;
}

.home .hone {
  display: inline;
  position: relative;
  z-index: 3;
  font-size: 60px;
  margin-top: 70px;
  margin-left: 50px;
  font-weight: bold;
  color: var(--text-colar);
  width: 30%;
  -webkit-text-stroke: 0.1vw rgb(255, 255, 255);
}

.home .hone2 {
  font-size: 20px;
  margin-left: 60px;
  font-weight: bold;
  color: var(--text-colar);
  position: relative;
  z-index: 2;
  -webkit-text-stroke: 0.5px rgb(255, 255, 255);

}

@keyframes cursor {
  50% {
    border-color: transparent;
  }
}

@keyframes typing {
  from {
    width: 0;
  }
}

.sidebar.close~.home {
  left: 78px;
  height: 100vh;
  width: calc(100% - 78px);
  overflow-y: hidden;
}

body.dark .home .text {
  color: var(--text-color);
}

.home .confi {
  font-size: 25px;
  color: var(--text-color);
}
</style>
