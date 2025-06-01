
interface LumaEventsEmbedProps {
  height?: string;
  className?: string;
}

export default function LumaEventsEmbed({ 
  height = "400px", 
  className = "" 
}: LumaEventsEmbedProps) {
  return (
    <div className={`rounded-lg border shadow-sm bg-white overflow-hidden ${className}`}>
      <div className="relative w-full" style={{ height }}>
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
