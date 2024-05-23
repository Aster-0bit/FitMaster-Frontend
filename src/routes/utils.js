
export const getDayInfo = () => {
  const daysOfWeek = [
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miércoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sábado' },
    { id: 7, name: 'Domingo' }
  ];
  const date = new Date();
  const dayOfWeek = date.getDay();
  const dayInfo = daysOfWeek[(dayOfWeek + 6) % 7]; 
  return dayInfo;
};
