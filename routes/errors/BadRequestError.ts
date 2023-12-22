export class BadRequestError extends Error {
  constructor(entity?: string, message = `Bad Request: required ${entity} `) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}