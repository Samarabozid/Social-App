import jwt ,{ JwtPayload, Secret, SignOptions, VerifyOptions } from "jsonwebtoken";

// Generate token
export const generateToken = (
    payload: string | Buffer | object, 
    secrectOrPrivateKey: Secret = process.env.JWT_SECRET as string, 
    options?: SignOptions): string => {
    return jwt.sign(payload, secrectOrPrivateKey, options);
}

// Verify token
export const verifyToken = (
    token: string | undefined, 
    secretOrPublicKey:Secret = process.env.JWT_SECRET as string,
    options?: VerifyOptions): JwtPayload => {
    return jwt.verify(token!, secretOrPublicKey, options) as JwtPayload;
}