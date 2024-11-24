export function formatDate(dateString) {
    const date = new Date(dateString);

    // Obtener componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses empiezan desde 0
    const day = String(date.getDate()).padStart(2, '0');

    // Obtener componentes de la hora
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Formatear AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convertir a formato de 12 horas

    // Formatear la fecha completa
    return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds} ${ampm}`;
}
