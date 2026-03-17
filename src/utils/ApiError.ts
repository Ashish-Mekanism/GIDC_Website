export interface ApiErrorType {
    statusCode: number;
    message: string;
    errors: Record<string, unknown>;
    isOperational: boolean;
    stack: string;
  }
  class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public errors: Record<string, unknown>;
    public success: boolean;
  
    constructor(
      statusCode: number,
      message: string,
      errors: Record<string, unknown> = {},
      isOperational: boolean = true,
      stack: string = ''
    ) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      this.errors = errors;
      this.success = false;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export default ApiError;
  