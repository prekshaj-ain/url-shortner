class ApiError extends Error {
  readonly statusCode: number;
  readonly message: string;
  readonly errors: string[];
  readonly data: null;
  readonly success: false;
  readonly stack?: string | undefined;
  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    if (statusCode < 100 || statusCode >= 600) {
      throw new Error("Invalid HTTP status code");
    }
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
