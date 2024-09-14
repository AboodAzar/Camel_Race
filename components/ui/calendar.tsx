"use client";

import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type CalendarEvent = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

type CalendarProps = {
  events: CalendarEvent[];
};

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const generateDaysArray = (month: number, year: number) => {
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month - 1, i + 1));
    };

    setDays(generateDaysArray(currentMonth.getMonth() + 1, currentMonth.getFullYear()));
  }, [currentMonth]);

  const changeMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  };

  const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    return date >= startDate && date <= endDate;
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) =>
      isDateInRange(day, new Date(event.startDate), new Date(event.endDate))
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth("prev")}
          className={buttonVariants({ variant: "outline" }) + " h-10 w-10 flex items-center justify-center"}
        >
          <FaChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-xl font-semibold">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={() => changeMonth("next")}
          className={buttonVariants({ variant: "outline" }) + " h-10 w-10 flex items-center justify-center"}
        >
          <FaChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => {
          const dayKey = day.toISOString().split("T")[0];
          const eventsForDay = getEventsForDay(day);
          const firstEvent = eventsForDay[0];
          const hasEvents = eventsForDay.length > 0;
          const isCurrentDay = isToday(day);

          return (
            <div
              key={dayKey}
              className={cn(
                "relative p-6 border rounded-lg text-center cursor-pointer",
                {
                  "bg-yellow-100": hasEvents,
                  "bg-yellow-300": isCurrentDay,
                }
              )}
              onClick={() => setSelectedDay(day)}
            >
              <div className="text-lg font-semibold">{day.getDate()}</div>
              {firstEvent && (
                <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-white text-xs p-1">
                  {firstEvent.name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Always-visible div below the calendar showing details */}
      <div className="mt-6 p-4 border rounded-lg bg-yellow-50">
        <h2 className="text-lg font-medium mb-2">
          Events on {selectedDay ? selectedDay.toDateString() : "No day selected"}
        </h2>
        <ul>
          {selectedDay ? (
            getEventsForDay(selectedDay).length > 0 ? (
              getEventsForDay(selectedDay).map((event) => (
                <li key={event.id}>
                  <strong>{event.name}</strong> - {new Date(event.startDate).toLocaleDateString()} to{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </li>
              ))
            ) : (
              <li>No events for this day.</li>
            )
          ) : (
            <li>Select a day to view events.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export { Calendar };