import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export default registerAs("jwt", (): JwtModuleOptions => ({
    secret: 'uzUBcQjgjtVXMEi1kxWBkwoyXtl5JYnb28qQ6mdTv+4=',
    signOptions: {
        expiresIn: "1h"
    }
}))