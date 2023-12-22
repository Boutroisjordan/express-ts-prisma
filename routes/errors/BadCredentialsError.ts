// export class AlreadyTakenError extends Error {
//   constructor(entity: string, message = `${entity} already Taken`) {
//     super(message);
//     this.name = this.constructor.name;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

export class BadCrendentialsError extends Error {
  constructor(message = `Bad Credentials`) {
    super(message);
    this.name = 'BadCredentials';
    Error.captureStackTrace(this, this.constructor);
  }
}
