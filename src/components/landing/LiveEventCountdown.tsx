
interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface LiveEventCountdownProps {
  timeLeft: CountdownTime;
}

export default function LiveEventCountdown({ timeLeft }: LiveEventCountdownProps) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      <div className="text-center">
        <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.days}</div>
        <div className="text-xs text-gray-500 mt-1">Days</div>
      </div>
      <div className="text-center">
        <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.hours}</div>
        <div className="text-xs text-gray-500 mt-1">Hours</div>
      </div>
      <div className="text-center">
        <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.minutes}</div>
        <div className="text-xs text-gray-500 mt-1">Min</div>
      </div>
      <div className="text-center">
        <div className="bg-gray-100 border border-gray-300 text-gray-900 text-lg font-bold py-2 px-2 rounded">{timeLeft.seconds}</div>
        <div className="text-xs text-gray-500 mt-1">Sec</div>
      </div>
    </div>
  );
}
