export function formatDate(dateString) {
    const date = new Date(dateString);

    // Obtener la diferencia de la zona horaria local en minutos y aplicarla
    const offset = date.getTimezoneOffset(); // Diferencia en minutos entre UTC y la hora local
    const localDate = new Date(date.getTime() - offset * 60000); // Ajustar la fecha a la hora local

    // Obtener componentes de la fecha ajustada a la hora local
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Meses empiezan desde 0
    const day = String(localDate.getDate()).padStart(2, '0');

    // Obtener componentes de la hora ajustada a la hora local
    let hours = localDate.getHours();
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const seconds = String(localDate.getSeconds()).padStart(2, '0');

    // Formatear AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convertir a formato de 12 horas

    // Formatear la fecha completa
    return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds} ${ampm}`;
}
