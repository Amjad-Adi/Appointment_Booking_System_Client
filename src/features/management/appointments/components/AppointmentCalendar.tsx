import { Calendar } from '../../../../../@/components/ui/Calender.tsx';

interface AppointmentCalendarProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    organizationTimeZone: string;
    appointmentDates: Date[];
    onMonthChange: (date: Date) => void;
}

export function AppointmentCalendar({
    selectedDate,
    onDateChange,
    organizationTimeZone,
    appointmentDates,
    onMonthChange,
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
            onMonthChange={onMonthChange}
            timeZone={organizationTimeZone}
            modifiers={{
                hasAppointment: appointmentDates,
            }}
            className="w-full"
        />
    );
}
