import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "@/context/ChallengeContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, List } from "lucide-react";

type ViewMode = 'calendar' | 'list';

export default function Logs() {
  const navigate = useNavigate();
  const { challenge } = useChallenge();
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (!challenge) {
    navigate("/");
    return null;
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getLogForDate = (date: Date) => {
    return challenge.workoutLogs.find((log) => isSameDay(new Date(log.date), date));
  };

  const getDayStatus = (date: Date) => {
    const log = getLogForDate(date);
    if (!log) return null;
    if (log.missed) return 'missed';
    if (log.audited) return 'audited';
    if (log.logged) return 'logged';
    return null;
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'logged': return 'bg-green-600';
      case 'missed': return 'bg-destructive';
      case 'audited': return 'bg-yellow-500';
      default: return 'bg-muted';
    }
  };

  const selectedLog = selectedDate ? getLogForDate(selectedDate) : null;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold uppercase">Logs</h1>
          <div className="flex border-2 border-border">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 ${viewMode === 'calendar' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 border-l-2 border-border ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="border-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="font-bold text-lg">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="border-2"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center text-xs text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {daysInMonth.map((date) => {
                const status = getDayStatus(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isChallengeDay = date >= new Date(challenge.startDate) && date <= new Date(challenge.endDate);
                
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    disabled={!isChallengeDay}
                    className={`aspect-square flex items-center justify-center text-sm border-2 transition-all ${
                      isSelected ? 'border-primary' : 'border-transparent'
                    } ${!isChallengeDay ? 'opacity-30' : 'hover:border-muted-foreground'}`}
                  >
                    <div className="relative">
                      <span>{format(date, "d")}</span>
                      {status && (
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${getStatusColor(status)}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 text-xs text-muted-foreground justify-center">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                <span>Logged</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-destructive rounded-full" />
                <span>Missed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Audited</span>
              </div>
            </div>

            {/* Selected Day Detail */}
            {selectedDate && (
              <div className="mt-6 border-2 border-border p-4">
                <h3 className="font-bold mb-2">{format(selectedDate, "EEEE, MMMM d")}</h3>
                {selectedLog ? (
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Status:</span>{' '}
                      {selectedLog.missed ? 'Missed' : selectedLog.logged ? 'Worked out' : '-'}
                    </p>
                    {selectedLog.workoutType && (
                      <p>
                        <span className="text-muted-foreground">Type:</span>{' '}
                        <span className="capitalize">{selectedLog.workoutType}</span>
                      </p>
                    )}
                    {selectedLog.intensity && (
                      <p>
                        <span className="text-muted-foreground">Intensity:</span>{' '}
                        <span className="capitalize">{selectedLog.intensity}</span>
                      </p>
                    )}
                    {selectedLog.notes && (
                      <p>
                        <span className="text-muted-foreground">Notes:</span>{' '}
                        {selectedLog.notes}
                      </p>
                    )}
                    {selectedLog.audited && (
                      <p>
                        <span className="text-muted-foreground">Audit:</span>{' '}
                        {selectedLog.auditPassed ? 'Passed' : 'Failed'}
                      </p>
                    )}
                    {selectedLog.missed && (
                      <p className="text-destructive">Penalty applied: ₹100</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No log for this day</p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {challenge.workoutLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No logs yet</p>
            ) : (
              [...challenge.workoutLogs]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((log, i) => (
                  <div key={i} className="border-2 border-border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{format(new Date(log.date), "EEEE, MMM d")}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.missed ? 'Missed' : log.logged ? 'Worked out' : '-'}
                          {log.workoutType && ` • ${log.workoutType}`}
                          {log.intensity && ` • ${log.intensity}`}
                        </p>
                        {log.notes && (
                          <p className="text-sm mt-1">{log.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {log.audited && (
                          <span className={`text-xs px-2 py-1 ${log.auditPassed ? 'bg-green-600' : 'bg-destructive'}`}>
                            {log.auditPassed ? 'Audit ✓' : 'Audit ✗'}
                          </span>
                        )}
                        <div className={`w-3 h-3 rounded-full ${
                          log.missed ? 'bg-destructive' : log.audited ? 'bg-yellow-500' : 'bg-green-600'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
