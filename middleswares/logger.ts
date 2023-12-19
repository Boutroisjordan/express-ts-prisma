import express, { Application, Request, Response, NextFunction, RequestHandler } from "express";

const myLogger : RequestHandler  =(res, req, next) => {
  console.log('LOGGED')
  next();
}
// const myLogger  = () => {
//   console.log('LOGGED')
//   // next();
// }

export default myLogger;