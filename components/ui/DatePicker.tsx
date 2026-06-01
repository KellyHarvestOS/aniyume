"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaCalendarAlt, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type DatePickerProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
};

type PickerDropdownProps = {
  value: string;
  options: Array<{ label: string; value: number }>;
  onChange: (value: number) => void;
  className?: string;
};

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const pad = (value: number) => String(value).padStart(2, "0");

const toInputValue = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDateValue = (value: string) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatDisplayValue = (value: string) => {
  const date = parseDateValue(value);
  if (!date) return "";
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};

function PickerDropdown({ value, options, onChange, className = "" }: PickerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50 px-2 text-left text-xs font-black text-gray-700 outline-none transition hover:border-[#2EC4B6]/50 dark:border-white/10 dark:bg-black dark:text-gray-200"
      >
        <span className="truncate">{value}</span>
        <FaChevronDown className={`shrink-0 text-[10px] text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-11 z-60 max-h-52 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xl shadow-black/15 dark:border-white/10 dark:bg-[#151515]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-xs font-black transition ${option.label === value
                ? "bg-[#2EC4B6] text-white"
                : "text-gray-600 hover:bg-[#2EC4B6]/10 hover:text-[#2EC4B6] dark:text-gray-300"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DatePicker({ id, value, onChange, placeholder = "ДД.ММ.ГГГГ", hasError = false }: DatePickerProps) {
  const selectedDate = parseDateValue(value);
  const [isOpen, setIsOpen] = useState(false);
  const currentDate = new Date();
  const [viewDate, setViewDate] = useState(() => selectedDate ?? currentDate);
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleMonth = viewDate.getMonth();
  const visibleYear = viewDate.getFullYear();

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 101 }, (_, index) => currentYear - index);
  }, []);

  const monthOptions = useMemo(() => MONTHS.map((month, index) => ({ label: month, value: index })), []);
  const yearOptions = useMemo(() => years.map((year) => ({ label: String(year), value: year })), [years]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(visibleYear, visibleMonth, 1);
    const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;

    return [
      ...Array.from({ length: startOffset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [visibleMonth, visibleYear]);

  const moveMonth = (direction: -1 | 1) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  const selectDay = (day: number) => {
    onChange(toInputValue(new Date(visibleYear, visibleMonth, day)));
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`group flex h-[52px] w-full items-center justify-between rounded-xl border bg-gray-50 px-3 text-left text-xs font-bold text-gray-700 outline-none transition-all focus:ring-2 dark:bg-[#111111] dark:text-gray-200 ${hasError
          ? "border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.12)] focus:ring-red-400/30 dark:border-red-500/70"
          : "border-gray-200 focus:ring-[#2EC4B6]/50 dark:border-white/5"
          }`}
      >
        <span className={value ? "text-gray-700 dark:text-gray-200" : "text-gray-400"}>
          {formatDisplayValue(value) || placeholder}
        </span>
        <FaCalendarAlt className="text-xs text-gray-400 opacity-60 transition-colors group-hover:text-[#2EC4B6]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[60px] z-50 w-[304px] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl shadow-black/15 dark:border-white/10 dark:bg-[#111111]">
          <div className="mb-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="grid h-9 w-9 place-items-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-[#2EC4B6] dark:hover:bg-white/5"
            >
              <FaChevronLeft size={12} />
            </button>

            <PickerDropdown
              value={MONTHS[visibleMonth]}
              options={monthOptions}
              onChange={(month) => setViewDate((current) => new Date(current.getFullYear(), month, 1))}
              className="flex-1"
            />

            <PickerDropdown
              value={String(visibleYear)}
              options={yearOptions}
              onChange={(year) => setViewDate((current) => new Date(year, current.getMonth(), 1))}
              className="w-20"
            />

            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="grid h-9 w-9 place-items-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-[#2EC4B6] dark:hover:bg-white/5"
            >
              <FaChevronRight size={12} />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-gray-400">
            {WEEK_DAYS.map((day) => <span key={day}>{day}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (!day) return <span key={`empty-${index}`} className="h-9" />;

              const dayValue = toInputValue(new Date(visibleYear, visibleMonth, day));
              const isSelected = dayValue === value;

              return (
                <button
                  key={dayValue}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`h-9 rounded-xl text-xs font-black transition ${isSelected
                    ? "bg-[#2EC4B6] text-white shadow-lg shadow-[#2EC4B6]/25"
                    : "text-gray-600 hover:bg-[#2EC4B6]/10 hover:text-[#2EC4B6] dark:text-gray-300"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
