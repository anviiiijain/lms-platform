import { type ExceptionFilter, Catch, type ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common"
import type { Response } from "express"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log("[v0] Gateway HTTP Filter caught exception:", {
      name: exception.name,
      message: exception.message,
      error: exception.error,
      hasErrorProperty: !!exception.error,
      type: typeof exception.error,
    })

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let message = "Internal server error"
    let error = "Error"

    // Handle HttpException from local controllers
    if (exception instanceof HttpException) {
      console.log("[v0] Handling as HttpException")
      statusCode = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      message = typeof exceptionResponse === "string" ? exceptionResponse : (exceptionResponse as any).message
      error = (exceptionResponse as any).error || exception.name
    }
    // Handle RPC exceptions from microservices
    else if (exception.error) {
      console.log("[v0] Handling as RPC exception:", exception.error)
      const rpcError = exception.error
      statusCode = rpcError.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      message = rpcError.message || "Microservice error"
      error = rpcError.error || "RpcError"
    }
    // Handle validation pipe errors
    else if (exception.response) {
      console.log("[v0] Handling as validation error")
      statusCode = exception.status || HttpStatus.BAD_REQUEST
      message = exception.response.message || exception.message
      error = exception.response.error || "ValidationError"
    }
    // Handle generic errors
    else if (exception.message) {
      console.log("[v0] Handling as generic error")
      message = exception.message
      error = exception.name || "Error"
    }

    console.error("[Gateway HTTP Exception Filter]", {
      statusCode,
      message,
      error,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    })

    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
