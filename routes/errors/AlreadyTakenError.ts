// export class AlreadyTakenError extends Error {
//   constructor(entity: string, message = `${entity} already Taken`) {
//     super(message);
//     this.name = this.constructor.name;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

export class AlreadyTakenError extends Error {
  constructor(entity: string, message = `${entity} already taken`) {
    super(message);
    this.name = 'AlreadyTakenError';
    Error.captureStackTrace(this, this.constructor);
  }
}
