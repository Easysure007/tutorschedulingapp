import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ServerConfig } from './lib/config';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export async function middleware(req: NextRequest) {
    /* 
    *   AUTH TOKEN CAN EITHER COME FROM HEADER
    *   YOU FRONTEND CLIENT MAY PASS THE AUTHORIZATION TOKEN THROUGH EITHER THE 
    *   x-AccessToken header or AccessToken cookie
     */
    let token: string | undefined | null = req.headers.get("X-AccessToken") || req.cookies.get('AccessToken');

    try {
        /**
         * CHECK IF THE REQUEST CONTAINS A TOKEN FOR ROUTES THAT RUN THE MIDDLEWARE
         * 
         */
        if (token) {
            /**
             * VALIDATE IF THE TOKEN IS VALID AND HAS NOT EXPIRED
             */
            const { payload } = await jwtVerify(token, new TextEncoder().encode(ServerConfig.getJWTSecret()));

            /**
             * IF TOKEN IS VALID AND HAS NOT EXPIRED
             * DECRYPT THE USER'S BASIC DETAIL FROM JWT TOKEN FORMAT AND ATTACH IT 
             * TO A COOKIE VARIABLE next-auth-user
             * THIS CAN THEN BE USED TO IDENTIFY THE USER MAKING THE REQUEST
             */
            if (payload) {
                const res = NextResponse.next();
                res.cookies.set('next-auth-user', JSON.stringify(payload))
                return res;
            }
        }
        /**
         * THROW ERROR WHEN TOKEN IS MISSING
         */
        throw new Error("You are not authenticated!")
    } catch (error) {
        console.log(error)
        /**
         * THIS REDIRECTS YOU TO A AN ENDPOINT THAT SIMPLY RETURNS UNAUTHENTICATED ERROR.
         */
        return NextResponse.rewrite(new URL('/api/auth/unauthorized', req.url));
    }

}
/**
 *      THIS MIDDLEWARE LOGIC ONLY APPLY TO ROUTES THAT MATCH THE ONES BELOW
  */
export const config = {
    matcher: [
        '/api/schedule/:path*',
        // '/api/group/:path*',
        // '/api/student',
        // '/api/student/:path*',
        '/api/auth/profile',
        '/api/auth/register',
        '/api/availability/:path*'
    ],

};