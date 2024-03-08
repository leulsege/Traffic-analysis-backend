import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/appError'

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err)
    else if (err.code === 11000) err = handleDuplicateFieldsDB(err)
    else if (err.name === 'ValidationError') {
      err = handleValidationErrorDB(err)
    } else if (err.name === 'JsonWebTokenError') err = handleJWTError()
    else if (err.name === 'TokenExpiredError') err = handleJWTExpiredError()

    sendErrorProd(err, res)
  }
}

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
  })
}

const sendErrorProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    console.error('ERROR 💥', err)

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    })
  }
}

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err: any) => {
  const keyValue = err.keyValue
  const field = Object.keys(keyValue)[0]
  const value = keyValue[field]

  const message = `Duplicate ${field} value: ${value} . Please use another ${field}.`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err: any) => {
  // const errors = Object.values(err.errors).map((el: any) => el.message)
  const message = `Invalid input data for${err.message.split(':')[1]}`
  return new AppError(message, 401)
}

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401)

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401)

export default errorHandler
