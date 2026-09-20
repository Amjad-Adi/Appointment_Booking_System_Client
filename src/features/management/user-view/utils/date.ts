export function formatDateForApi(date: Date, timeZone?: string): string {
    if (!timeZone) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date);

    const year = parts.find((part) => part.type === 'year')?.value;

    const month = parts.find((part) => part.type === 'month')?.value;

    const day = parts.find((part) => part.type === 'day')?.value;

    if (!year || !month || !day) {
        throw new Error(`Unable to format date in timezone "${timeZone}".`);
    }

    return `${year}-${month}-${day}`;
}

export function formatDateTimeForInput(date: Date, timeZone?: string): string {
    if (!timeZone) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(date);

    const getPart = (type: string) => parts.find((part) => part.type === type)?.value;

    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hour = getPart('hour');
    const minute = getPart('minute');

    if (!year || !month || !day || !hour || !minute) {
        throw new Error(`Unable to format datetime in timezone "${timeZone}".`);
    }

    return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function localDateTimeToISO(value: string, timeZone?: string): string {
    if (!timeZone) {
        return new Date(value).toISOString();
    }

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);

    if (!match) {
        throw new Error(`Invalid local datetime: ${value}`);
    }

    const [, year, month, day, hour, minute] = match;

    /*
     * Start with an approximate UTC instant, then determine
     * what local clock time that instant represents in the
     * requested timezone.
     */
    let utcMillis = Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
    );

    for (let i = 0; i < 3; i++) {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        }).formatToParts(new Date(utcMillis));

        const getPart = (type: string) =>
            Number(parts.find((part) => part.type === type)?.value ?? 0);

        const actualMillis = Date.UTC(
            getPart('year'),
            getPart('month') - 1,
            getPart('day'),
            getPart('hour'),
            getPart('minute'),
        );

        const requestedMillis = Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute),
        );

        utcMillis += requestedMillis - actualMillis;
    }

    return new Date(utcMillis).toISOString();
}
