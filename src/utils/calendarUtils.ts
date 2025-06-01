
export interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}

export const generateCalendarUrls = (event: CalendarEvent) => {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startDateStr = formatDate(event.startDate);
  const endDateStr = formatDate(event.endDate);
  
  const encodedTitle = encodeURIComponent(event.title);
  const encodedDescription = encodeURIComponent(event.description);
  const encodedLocation = event.location ? encodeURIComponent(event.location) : '';

  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startDateStr}/${endDateStr}&details=${encodedDescription}&location=${encodedLocation}`,
    
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodedTitle}&startdt=${startDateStr}&enddt=${endDateStr}&body=${encodedDescription}&location=${encodedLocation}`,
    
    yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodedTitle}&st=${startDateStr}&et=${endDateStr}&desc=${encodedDescription}&in_loc=${encodedLocation}`,
  };
};

export const generateIcsFile = (event: CalendarEvent) => {
  const formatIcsDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wilbe//Event//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatIcsDate(event.startDate)}`,
    `DTEND:${formatIcsDate(event.endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    event.location ? `LOCATION:${event.location}` : '',
    `UID:${Date.now()}@wilbe.com`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');

  return icsContent;
};

export const downloadIcsFile = (event: CalendarEvent) => {
  const icsContent = generateIcsFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
