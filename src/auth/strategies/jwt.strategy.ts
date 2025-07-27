import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthJwtPaylod } from "../types/auth-jwtPayload";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'uzUBcQjgjtVXMEi1kxWBkwoyXtl5JYnb28qQ6mdTv+4=',
            ignoreExpiration: false,
        });
    }

    validate(payload: AuthJwtPaylod) {
        const userId = payload.sub;
        return this.authService.validateJwtUser(userId);
    }
}