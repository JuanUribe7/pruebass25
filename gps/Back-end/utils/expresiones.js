const formatearFecha = (fechaISO) => {
    // Verificar si la entrada es válida
    if (!fechaISO || typeof fechaISO !== 'string') return 'Fecha no válida';

    // Parsear la fecha
    const fecha = new Date(fechaISO);

    if (isNaN(fecha)) return 'Fecha no válida'; // Validar que sea una fecha válida

    // Extraer componentes
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes es base 0
    const dia = String(fecha.getDate()).padStart(2, '0');
    let horas = fecha.getHours();
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');

    // Determinar AM o PM
    const amPm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12 || 12; // Convertir a formato de 12 horas

    // Formatear la fecha y hora
    return `${anio}/${mes}/${dia} - ${horas}:${minutos}:${segundos} ${amPm}`;
};

module.exports = formatearFecha;