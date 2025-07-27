import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthJwtPaylod } from "../types/auth-jwtPayload";
import { AuthService } from "../auth.service";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
            secretOrKey: 'BWyJ9stWfyH0y2g8fKeuIipYKpTsapvkToDYTiIAVv4=',
            ignoreExpiration: false,
        });
    }

    validate(payload: AuthJwtPaylod) {
        const userId = payload.sub;
        return this.authService.validateRefreshToken(userId);
    }
}