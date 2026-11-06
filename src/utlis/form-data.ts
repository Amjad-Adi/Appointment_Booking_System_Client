export function toFormData(values: Record<string, unknown>): FormData {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        if (value instanceof File) {
            formData.append(key, value);
            return;
        }

        if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
            return;
        }

        formData.append(key, String(value));
    });

    return formData;
}
