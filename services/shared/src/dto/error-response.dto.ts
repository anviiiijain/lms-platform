export class ErrorResponseDto {
    statusCode: number;
    message: string;
    error?: string;
    timestamp?: string;
    path?: string;
  
    constructor(statusCode: number, message: string, error?: string) {
      this.statusCode = statusCode;
      this.message = message;
      this.error = error;
      this.timestamp = new Date().toISOString();
    }
  }