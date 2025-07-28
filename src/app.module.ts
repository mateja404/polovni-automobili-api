import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth/auth.service';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { Resetlink, ResetlinkSchema } from './schemas/resetlink.schema';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule, 
    MongooseModule.forRoot('mongodb://localhost/polovniautomobili'), 
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
    MongooseModule.forFeature([{ name: Resetlink.name, schema: ResetlinkSchema }]), 
    ConfigModule.forRoot({ isGlobal: true }), UserModule, 
    MailerModule.forRoot({
      transport: {
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: "murkoffcorp11@gmail.com",
          pass: "bhbq gwwi ghuf rydu",
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: '"no-reply" <no-reply@example.com>',
      },
    }),],
  controllers: [AppController, AuthController],
  providers: [AppService, UserService],
})
export class AppModule {}