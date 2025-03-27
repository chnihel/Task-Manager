import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

type JWTPayload = {
    sub: string
    username: string
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        const jwtAccessSecret = process.env.JWT_Access_Secret
        if (!jwtAccessSecret) {
            throw new Error('JWT_Access_Secret is not deined in environment variables')
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtAccessSecret
        })
    }

    validate(payload: JWTPayload) {
        return payload
    }
}