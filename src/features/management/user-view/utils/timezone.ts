export function getTimeZoneName(timeZone: string): string {
    try {
        return (
            new Intl.DateTimeFormat('en-US', {
                timeZone,
                timeZoneName: 'long',
            })
                .formatToParts(new Date())
                .find((part) => part.type === 'timeZoneName')?.value ?? timeZone
        );
    } catch {
        return timeZone;
    }
}

export function formatTimeInTimeZone(value: string | Date, timeZone: string): string {
    return new Intl.DateTimeFormat([], {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).format(new Date(value));
}

export function formatDateInTimeZone(value: string | Date, timeZone: string): string {
    return new Intl.DateTimeFormat([], {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    }).format(new Date(value));
}

export function formatDateTimeInTimeZone(value: string | Date, timeZone: string): string {
    return new Intl.DateTimeFormat([], {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).format(new Date(value));
}

/**
 * Returns the current date/time as a datetime-local value
 * in the organization's timezone.
 *
 * Example:
 * Asia/Jerusalem -> "2026-09-17T09:30"
 */
export function getCurrentDateTimeInTimeZone(timeZone: string): string {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(new Date());

    const values = Object.fromEntries(
        parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]),
    );

    return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

/**
 * Gets the timezone offset, in milliseconds, for a given instant.
 */
function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(date);

    const values = Object.fromEntries(
        parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]),
    );

    const asUTC = Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day),
        Number(values.hour),
        Number(values.minute),
        Number(values.second),
    );

    return asUTC - date.getTime();
}

/**
 * Converts a datetime-local value representing a time
 * in the organization's timezone into an ISO UTC string.
 *
 * Example:
 * "2026-09-17T06:30" + "Asia/Jerusalem"
 * -> "2026-09-17T03:30:00.000Z"
 */
export function organizationLocalToUTC(value: string, timeZone: string): string | undefined {
    if (!value) {
        return undefined;
    }

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);

    if (!match) {
        return undefined;
    }

    const [, year, month, day, hour, minute, second = '00'] = match;

    const localAsUTC = Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
    );

    let utcTimestamp = localAsUTC;

    /*
     * Recalculate once after applying the initial offset.
     */
    utcTimestamp -= getTimeZoneOffsetMs(new Date(utcTimestamp), timeZone);

    /*
     * Recalculate using the resulting instant because
     * the offset can change around DST boundaries.
     */
    utcTimestamp -=
        getTimeZoneOffsetMs(new Date(utcTimestamp), timeZone) -
        getTimeZoneOffsetMs(new Date(localAsUTC), timeZone);

    const result = new Date(utcTimestamp);

    if (Number.isNaN(result.getTime())) {
        return undefined;
    }

    return result.toISOString();
}

/**
 * Converts a Date instant into a datetime-local string
 * representing that instant in the specified timezone.
 *
 * Example:
 * A UTC instant displayed in Asia/Jerusalem:
 * -> "2026-09-17T09:30"
 */
export function organizationDateToLocalDateTime(value: Date, timeZone: string): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(value);

    const getPart = (type: string) => parts.find((part) => part.type === type)?.value;

    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hour = getPart('hour');
    const minute = getPart('minute');

    if (!year || !month || !day || !hour || !minute) {
        throw new Error(`Unable to convert date to timezone "${timeZone}".`);
    }

    return `${year}-${month}-${day}T${hour}:${minute}`;
}
