import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express"
import { ExtractJwt, Strategy } from "passport-jwt"

type JWTPayload = {
    sub: string
    username: string
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        const jwtRefreshSecret = process.env.JWT_Refresh_Secret
        if (!jwtRefreshSecret) {
            throw new Error('JWT_Refresh_Secret is not defined in environment variables')
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtRefreshSecret,
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: JWTPayload) {
        const authHeader = req.get('Authorization')
        if (!authHeader) {
            throw new UnauthorizedException('Authorization Header is missing')
        }

        const refreshToken = authHeader.replace('Bearer', '').trim()

        return { ...payload, refreshToken }
    }
}