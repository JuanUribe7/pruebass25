const formatearFecha = (fechaISO) => {
    // Verificar si la entrada es válida
    if (!fechaISO || typeof fechaISO !== 'string') return 'Fecha no válida';

    // Parsear la fecha
    const fecha = new Date(fechaISO);

    if (isNaN(fecha)) return 'Fecha no válida'; // Validar que sea una fecha válida

    // Convertir la fecha a la zona horaria de Bogotá
    const opciones = { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const fechaBogota = new Intl.DateTimeFormat('en-US', opciones).formatToParts(fecha);

    // Extraer componentes
    const anio = fechaBogota.find(part => part.type === 'year').value;
    const mes = fechaBogota.find(part => part.type === 'month').value;
    const dia = fechaBogota.find(part => part.type === 'day').value;
    let horas = fechaBogota.find(part => part.type === 'hour').value;
    const minutos = fechaBogota.find(part => part.type === 'minute').value;
    const segundos = fechaBogota.find(part => part.type === 'second').value;
    const amPm = fechaBogota.find(part => part.type === 'dayPeriod').value;

    // Formatear la fecha y hora
    return `${anio}/${mes}/${dia} - ${horas}:${minutos}:${segundos} ${amPm}`;
};

module.exports = formatearFecha;