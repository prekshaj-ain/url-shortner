class ApiResponse {
  readonly statusCode: number;
  readonly data?: object;
  readonly message: string;
  readonly success: boolean;
  constructor(statusCode: number, data: object, message = "Success") {
    if (statusCode < 100 || statusCode >= 600) {
      throw new Error("Invalid status code");
    }
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
