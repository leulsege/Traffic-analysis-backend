import { Request, Response, NextFunction } from 'express';
declare const asyncError: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export default asyncError;
