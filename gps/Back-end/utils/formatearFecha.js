export function formatDate(dateString) {
    const date = new Date(dateString);

    // Convertir la fecha a la zona horaria de Colombia (UTC-5)
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'America/Bogota', // Asegurando la zona horaria de Colombia (UTC-5)
    };

    // Usamos Intl.DateTimeFormat para formatear la fecha de acuerdo a la zona horaria local
    const formatter = new Intl.DateTimeFormat('es-CO', options);
    const formattedDate = formatter.format(date);

    return formattedDate.replace(',', ''); // Eliminar la coma que se agrega por defecto
}
