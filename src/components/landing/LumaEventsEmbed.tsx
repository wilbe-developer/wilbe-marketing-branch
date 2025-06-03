
interface LumaEventsEmbedProps {
  className?: string;
}

export default function LumaEventsEmbed({ 
  className = "" 
}: LumaEventsEmbedProps) {
  return (
    <div className={`rounded-lg border shadow-sm bg-white overflow-hidden h-64 sm:h-96 ${className}`}>
      <div className="relative w-full h-full">
        <iframe
          src="https://lu.ma/embed/calendar/cal-DLkKXePQ5aA3GHL/events?light=true"
          className="absolute inset-0 w-full h-full"
          style={{ border: "none" }}
          allowFullScreen
          loading="lazy"
          title="Upcoming Wilbe Events"
        />
      </div>
    </div>
  );
}
