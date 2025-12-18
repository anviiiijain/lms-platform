import { 
    Catch, 
    ExceptionFilter, 
    ArgumentsHost, 
    HttpException, 
    HttpStatus 
  } from '@nestjs/common';
  import { RpcException } from '@nestjs/microservices';
  import { Observable, throwError } from 'rxjs';
  
  @Catch()
  export class RpcExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): Observable<any> {
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let error = 'Error';
  
      // Handle NestJS HTTP exceptions
      if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
        const response = exception.getResponse();
        message = typeof response === 'string' ? response : (response as any).message;
        error = (response as any).error || exception.name;
      }
      // Handle Prisma errors
      else if (exception.code) {
        switch (exception.code) {
          case 'P2002':
            statusCode = HttpStatus.CONFLICT;
            message = 'Duplicate entry. Resource already exists.';
            error = 'ConflictError';
            break;
          case 'P2025':
            statusCode = HttpStatus.NOT_FOUND;
            message = 'Resource not found.';
            error = 'NotFoundError';
            break;
          case 'P2003':
            statusCode = HttpStatus.BAD_REQUEST;
            message = 'Foreign key constraint failed.';
            error = 'ForeignKeyError';
            break;
          default:
            message = 'Database error occurred.';
            error = 'DatabaseError';
        }
      }
      // Handle generic errors
      else if (exception.message) {
        message = exception.message;
      }
  
      console.error('[RPC Exception Filter]', {
        statusCode,
        message,
        error,
        stack: exception.stack,
      });
  
      // Throw RpcException with structured error
      return throwError(() => new RpcException({
        statusCode,
        message,
        error,
        timestamp: new Date().toISOString(),
      }));
    }
  }