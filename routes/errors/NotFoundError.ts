export class NotFoundError extends Error {
  constructor(entity: string, message = `${entity} not found`) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}