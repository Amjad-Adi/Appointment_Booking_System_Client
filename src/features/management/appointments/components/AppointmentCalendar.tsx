import { Calendar } from '../../../../../@/components/ui/Calender.tsx';

interface AppointmentCalendarProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    organizationTimeZone: string;
}

export function AppointmentCalendar({
    selectedDate,
    onDateChange,
    organizationTimeZone,
}: AppointmentCalendarProps) {
    return (
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
                if (date) {
                    onDateChange(date);
                }
            }}
            timeZone={organizationTimeZone}
            className="w-full"
        />
    );
}
