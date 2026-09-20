export class Toast {
    loading: string;
    success: string;
    error: string;
    constructor(loading: string, success: string, error: string) {
        this.loading = loading;
        this.success = success;
        this.error = error;
    }
}
