import { useState, useEffect } from 'react';
import { useTrustedTime } from '@/hooks/useTrustedTime';
import { Clock } from 'lucide-react';

interface CountdownPillProps {
  onExpire?: () => void;
  visible: boolean;
}

function formatTime(ms: number): string {
  if (ms <= 0) return '00:00:00';
  
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function CountdownPill({ onExpire, visible }: CountdownPillProps) {
  const { getTimeLeftToday, getTrustedNow } = useTrustedTime();
  const [timeLeft, setTimeLeft] = useState(getTimeLeftToday());
  const [isExpired, setIsExpired] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      const remaining = getTimeLeftToday();
      setTimeLeft(remaining);
      
      if (remaining <= 0 && !isExpired) {
        setIsExpired(true);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, getTimeLeftToday, onExpire, isExpired]);

  // Handle fade out when not visible
  useEffect(() => {
    if (!visible && !isExiting) {
      setIsExiting(true);
      const timeout = setTimeout(() => setIsExiting(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [visible, isExiting]);

  if (!visible && !isExiting) return null;

  const isUrgent = timeLeft < 60 * 60 * 1000; // Less than 1 hour
  const isCritical = timeLeft < 15 * 60 * 1000; // Less than 15 minutes

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 
        transition-all duration-300
        ${isExiting || !visible ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        ${isCritical ? 'border-destructive bg-destructive/10 text-destructive animate-pulse' : 
          isUrgent ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : 
          'border-border bg-muted/50'}
      `}
    >
      <Clock className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider opacity-70">Time left today</span>
        <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
}

export function LoggedSuccessPill() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-green-500 bg-green-500/10 text-green-500">
      <span className="font-medium text-sm">Logged for today ✓</span>
    </div>
  );
}

export function MissedDayPill() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-destructive bg-destructive/10 text-destructive">
      <span className="font-medium text-sm">Missed today — ₹100 deducted</span>
    </div>
  );
}
