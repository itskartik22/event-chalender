import React, { useEffect, useState } from "react";
import { addMonths, subMonths, format } from "date-fns";
import CalendarGrid from "@/components/CalenderGrid";
import EventSidebar from "@/components/EventSidebar";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const CalendarPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const events = useSelector((state: RootState) => state.event)

  useEffect(() => {}, [events]);
  const handleDayClick = (day: Date) => {
    console.log(day);
    setSelectedDay(day);
  };

  const handleMonthChange = (increment: number) => {
    setCurrentMonth((prev) =>
      increment > 0 ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  return (
    <div className="flex">
      <div>
        <EventSidebar
          events={events}
          selectedDay={selectedDay}
        />
      </div>
      <div className="w-full p-2 flex flex-col justify-center flex-1">
        <div className="flex gap-2 justify-between items-center border px-4 py-2 rounded">
          <h2 className="text-xl font-bold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="">
            <div className="flex gap-2">
              <button
                onClick={() => handleMonthChange(-1)}
                className="p-2 bg-gray-200 rounded"
              >
                <IoIosArrowBack />
              </button>
              <button
                onClick={() => handleMonthChange(1)}
                className="p-2 bg-gray-200 rounded"
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
        <CalendarGrid
          currentMonth={currentMonth}
          onDayClick={handleDayClick}
          events={events}
          selectedDay={selectedDay}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
