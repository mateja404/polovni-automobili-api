import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { Resetlink, ResetlinkSchema } from 'src/schemas/resetlink.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Resetlink.name, schema: ResetlinkSchema }]),
    MailerModule,
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}