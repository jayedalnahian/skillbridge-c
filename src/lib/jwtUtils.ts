/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtVerify, decodeJwt } from "jose";

const verifyToken = async (token: string, secret: string) => {
    try {
        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jwtVerify(token, secretKey);
        return {
            success: true,
            data: payload
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            error
        };
    }
};

const decodedToken = (token: string) => {
    return decodeJwt(token);
};

export const jwtUtils = {
    verifyToken,
    decodedToken,
};