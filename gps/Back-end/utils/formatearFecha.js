export function formatDate(dateString) {
    const date = new Date(dateString);

    // Ajustar manualmente a UTC-5 (Colombia)
    const localDate = new Date(date.getTime() - 5 * 60 * 60 * 1000); // UTC -5 en milisegundos

    // Obtener componentes de la fecha ajustada
    const year = localDate.getUTCFullYear();
    const month = String(localDate.getUTCMonth() + 1).padStart(2, '0'); // Meses empiezan desde 0
    const day = String(localDate.getUTCDate()).padStart(2, '0');

    // Obtener componentes de la hora ajustada
    let hours = localDate.getUTCHours();
    const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(localDate.getUTCSeconds()).padStart(2, '0');

    // AM/PM y conversión de formato de 24 horas a 12 horas
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Asegurar que las 12 AM/PM sean correctas

    // Formatear la fecha completa
    return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds} ${ampm}`;
}
