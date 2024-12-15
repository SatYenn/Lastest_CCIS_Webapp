import React from 'react';
import DatePicker from 'react-datepicker';
import { fr } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import { cn } from '../../lib/utils';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  maxDate?: Date;
  minDate?: Date;
  placeholderText?: string;
  className?: string;
  error?: string;
}

export function CustomDatePicker({
  value,
  onChange,
  maxDate = new Date(),
  minDate = new Date(1900, 0, 1),
  placeholderText = "Sélectionnez une date",
  className,
  error
}: DatePickerProps) {
  return (
    <div>
      <DatePicker
        selected={value}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        locale={fr}
        maxDate={maxDate}
        minDate={minDate}
        placeholderText={placeholderText}
        className={cn(
          "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500",
          error && "border-red-500",
          className
        )}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        isClearable
        autoComplete="off"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}