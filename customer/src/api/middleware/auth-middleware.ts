import { NextFunction, Request, Response } from 'express';
import { ValidateRequest } from '../../types';
import { ValidateSignature } from '../../utils';

export const UserAuth = async (req: Request, res: Response, next: NextFunction) => {

    
    let ValidateRequest = req as ValidateRequest
    
    const isAuthorized = await ValidateSignature(ValidateRequest);
    

    if(isAuthorized){
        return next();
    }

    return res.status(403).json({ message: 'Not Authorized' })
    
}