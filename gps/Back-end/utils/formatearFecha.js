export function formatDate(dateString) {
    const date = new Date(dateString);

    // Obtener componentes de la fecha en UTC
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Meses empiezan desde 0
    const day = String(date.getUTCDate()).padStart(2, '0');

    // Obtener componentes de la hora en UTC
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // Formatear AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convertir a formato de 12 horas

    // Formatear la fecha completa
    return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds} ${ampm}`;
}