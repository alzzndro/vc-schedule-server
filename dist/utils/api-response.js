export class ApiResponse {
    success;
    message;
    data;
    meta;
    constructor({ success = true, message, data, meta, }) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }
}
//# sourceMappingURL=api-response.js.map