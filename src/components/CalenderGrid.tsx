import React from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
type EventTime = {
  start: string;
  end: string;
};

enum EventType {
  Personal = "Personal",
  Work = "Work",
  Others = "Others",
}

type Event = {
  id: string;
  name: string;
  date: string; // In format "yyyy-MM-dd"
  time?: EventTime
  type: EventType,
  description?: string
};

type EventMap = {
  [key: string]: Event[];
};
type CalendarGridProps = {
  currentMonth: Date;
  onDayClick: (day: Date) => void;
  events: EventMap;
  selectedDay: Date;
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  onDayClick,
  events,
  selectedDay,
}) => {

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  console.log(selectedDay, "selectedDay");

  return (
    <div className="w-auto grid grid-cols-7 gap-1 p-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
        <div
          key={index}
          className={`font-semibold p-2 border text-right rounded-t-md ${
            index == 0 && "text-red-600"
          }`}
        >
          {day}
        </div>
      ))}

      {/* Calendar Days */}
      {days.map((day) => {
        const dayKey = format(day, "yyyy-MM-dd");
        const isCurrentMonth = isSameMonth(day, currentMonth);
        const eventsByDay = events[dayKey] || [];
        console.log(day, "day")
        return (
          <div
            key={dayKey}
            className={`w-auto h-28 p-2 rounded-lg border overflow-auto ${
              isCurrentMonth
                ? "hover:bg-gray-200 cursor-pointer"
                : "text-gray-400"
            } ${isToday(day) ? "border border-blue-500" : ""} ${
              format(selectedDay, "d MM") === format(day, "d MM") ? "bg-blue-200" : ""
            }`}
            onClick={() => onDayClick(day)}
          >
            <span className="block text-lg text-right">{format(day, "d")}</span>
            <div className="flex flex-col gap-[1px] overflow-hidden">
              {eventsByDay.length > 0 &&
                eventsByDay.map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded-sm text-white ${
                      event.type === "Work"
                        ? "bg-red-500"
                        : event.type === "Personal"
                        ? "bg-green-500"
                        : "bg-slate-500"
                    }`}
                  >
                    {event.name}
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarGrid;
