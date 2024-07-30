import { Response } from 'express';
import cookie from 'cookie';



export const setTokenCookie = (res: Response, token: any) => {
    res.setHeader('Set-Cookie', cookie.serialize('userToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', 
      maxAge: 60 * 60 * 24 * 5, // 5 days
      sameSite: 'strict',
      path: '/',
    }));
  };

  export const logout = (req: Request, res: Response) => {
    res.setHeader('Set-Cookie', cookie.serialize('userToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Ensure it's secure in production
      maxAge: -1, // Expire the cookie immediately
      sameSite: 'strict',
      path: '/',
    }));
  
    res.status(200).json({ message: 'Logout successful' });
  };
  
