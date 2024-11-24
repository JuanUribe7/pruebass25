function formatearFecha(fechaInicial) {
    // Convertir a un objeto Date
    const fecha = new Date(fechaInicial);

    // Obtener componentes de la fecha
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours() % 12 || 12).padStart(2, '0'); // Formato de 12 horas
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');
    const ampm = fecha.getHours() >= 12 ? 'PM' : 'AM';

    // Combinar en el formato deseado
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds} ${ampm}`;
}

// Ejemplo de uso
const fechaInicial = "2024-11-24T12:27:21.000+00:00";
console.log(formatearFecha(fechaInicial));
