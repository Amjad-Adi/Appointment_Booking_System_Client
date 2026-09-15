import { Calendar } from '../../../../../@/components/ui/Calender.tsx';

interface AppointmentCalendarProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export function AppointmentCalendar({ selectedDate, onDateChange }: AppointmentCalendarProps) {
    return (
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
                if (date) {
                    onDateChange(date);
                }
            }}
            timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
            className="w-full"
        />
    );
}
