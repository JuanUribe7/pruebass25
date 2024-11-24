export function formatDate(dateString) {
    // Expresión regular para extraer las partes de la fecha
    const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.\d{3}\+(\d{2}):(\d{2})$/;
    const match = dateString.match(regex);

    if (match) {
        const [_, year, month, day, hour, minute, second] = match;

        // Convertir a formato de 12 horas
        let ampm = 'a. m.';
        let hour12 = parseInt(hour, 10);
        if (hour12 >= 12) {
            ampm = 'p. m.';
        }
        hour12 = (hour12 % 12) || 12; // Si es 0 horas, convertir a 12

        // Devolver la fecha en el formato que deseas
        return `${day}/${month}/${year} ${hour12}:${minute}:${second} ${ampm}`;
    } else {
        return dateString; // Si no coincide con el formato, retorna la fecha original
    }
}
