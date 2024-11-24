export function formatDate(dateString) {
    // Convertir la fecha recibida (ya ajustada a UTC-5) en un objeto Date
    const date = new Date(dateString);

    // Verificamos si la fecha tiene el ajuste de zona horaria correcto
    // Si ya está en UTC-5 no necesitas hacer más conversiones

    // Obtener los componentes de la fecha con formato en hora de Bogotá
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'America/Bogota', // Zona horaria de Bogotá (UTC-5)
    };

    // Usamos Intl.DateTimeFormat para formatear la fecha en la zona horaria de Bogotá
    const formatter = new Intl.DateTimeFormat('es-CO', options);
    const formattedDate = formatter.format(date);

    return formattedDate.replace(',', ''); // Eliminar la coma innecesaria
}
