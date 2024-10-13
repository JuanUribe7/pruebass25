// router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TiempoReal from '../views/TiempoReal.vue';  // Asegúrate de que el import apunte al componente correcto
import GeozonasView from '../views/GeozonasView.vue';
import HistorialView from '../views/HistorialView.vue';
import DispositivoView from '../views/DispositivoView.vue';
import ReporteView from '../views/ReporteView.vue';
import Barralateral from '../components/BarraLateral.vue';





const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/Home', // Redirige la ruta raíz '/' a '/Home'
  },
  {
    path: '/Home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/tiempo_real',
    name: 'tiempo_real',
    component: TiempoReal
  },
  {
    path: '/geozona',
    name: 'geozona',
    component: GeozonasView
  },
  {
    path: '/historial',
    name: 'historial',
    component: HistorialView
  },
  {
    path: '/dispositivo',
    name: 'dispositivo',
    component: DispositivoView
  },
  {
    path: '/reporte',
    name: 'reporte',
    component: ReporteView
  },
  {
    path: '/barralateral',
    name: 'Barralateral',
    component: Barralateral
  }
  // Agrega más rutas según sea necesario para tus otras vistas
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
