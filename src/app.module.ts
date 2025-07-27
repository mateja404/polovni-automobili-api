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

@Module({
  imports: [AuthModule, MongooseModule.forRoot('mongodb://localhost/polovniautomobili'), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), ConfigModule.forRoot({ isGlobal: true }), UserModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, UserService],
})
export class AppModule {}