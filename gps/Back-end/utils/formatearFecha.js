export function formatDate(dateString) {
    // Crear un objeto Date desde el string ISO
    const date = new Date(dateString);

    // Obtener los componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses empiezan en 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Determinar si es AM o PM
    const ampm = date.getHours() >= 12 ? 'p. m.' : 'a. m.';
    const hour12 = (date.getHours() % 12) || 12; // Convertir a formato de 12 horas

    // Construir la fecha con el formato deseado
    let formattedDate = `${day}/${month}/${year} ${hour12}:${minutes}:${seconds} ${ampm}`;

    // Devuelve la fecha formateada
    return formattedDate;
}
