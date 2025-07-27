import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import refreshConfig from './config/refresh.config';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: 'uzUBcQjgjtVXMEi1kxWBkwoyXtl5JYnb28qQ6mdTv+4=',
        signOptions: { expiresIn: '3h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forFeature(refreshConfig)
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
  exports: [AuthService, JwtModule, ConfigModule],
})
export class AuthModule {}