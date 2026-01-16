"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MiniCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export default function MiniCalendar({ selectedDate, onSelectDate }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate the max selectable date (14 days from today)
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 14);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateSelectable = (date: Date | null) => {
    if (!date) return false;
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly >= today && dateOnly <= maxDate;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const todayDate = new Date();
    return (
      date.getDate() === todayDate.getDate() &&
      date.getMonth() === todayDate.getMonth() &&
      date.getFullYear() === todayDate.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);

  // Check if we can navigate to previous/next month
  const canGoPrevious = currentMonth.getMonth() >= today.getMonth() &&
    currentMonth.getFullYear() >= today.getFullYear();
  const canGoNext = currentMonth.getMonth() <= maxDate.getMonth() ||
    currentMonth.getFullYear() < maxDate.getFullYear();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const selectable = isDateSelectable(date);
          const selected = isDateSelected(date);
          const todayDate = isToday(date);

          return (
            <button
              key={index}
              onClick={() => date && selectable && onSelectDate(date)}
              disabled={!selectable}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                ${!date ? "invisible" : ""}
                ${selectable && !selected
                  ? "hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer text-gray-700"
                  : ""}
                ${!selectable && date ? "text-gray-300 cursor-not-allowed" : ""}
                ${selected
                  ? "bg-emerald-500 text-white font-semibold shadow-md"
                  : ""}
                ${todayDate && !selected
                  ? "ring-2 ring-emerald-500 ring-offset-1 font-semibold"
                  : ""}
              `}
            >
              {date?.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded ring-2 ring-emerald-500" />
          <span>Today</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}
