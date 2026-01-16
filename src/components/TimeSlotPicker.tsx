"use client";

import { Clock } from "lucide-react";

interface TimeSlotPickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

// Mock available time slots
const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export default function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onSelectTime,
}: TimeSlotPickerProps) {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  if (!selectedDate) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-900">Available Times</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <Clock className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-center">Select a date to see available times</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <Clock className="w-5 h-5 text-emerald-600" />
        <h3 className="font-semibold text-gray-900">Available Times</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">{formatDate(selectedDate)}</p>

      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map((time) => {
          const isSelected = selectedTime === time;
          return (
            <button
              key={time}
              onClick={() => onSelectTime(time)}
              className={`
                py-3 px-4 rounded-xl text-sm font-medium transition-all
                ${isSelected
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200"
                }
              `}
            >
              {time}
            </button>
          );
        })}
      </div>

      {selectedTime && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-emerald-600 font-medium text-center">
            Selected: {formatDate(selectedDate)} at {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
}
