import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from "uuid";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly mailService: MailerService) {}

    async getUserInfo(userId: Types.ObjectId): Promise<any> {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      return user;
    };

    async changeUserPw(email: string): Promise<any> {
      const user = await this.userModel.findOne({ email: email });
      if (!user) {
        throw new UnauthorizedException("User not found");
      }
      const linkId = uuidv4();
      const message = `Forgot your password? \nReset it in in provided link http://localhost:3000/forgotpassword/reset/${linkId} \nIf you didn't forget your password, please ignore this email!`;

      if (user.language === "rs") {
        this.mailService.sendMail({
          from: 'Polovni Automobili <recipeapi@murkoff.com>',
          to: user.email,
          subject: `Urgent! Recipes API forgot password`,
          text: message,
        });
      } else {
        this.mailService.sendMail({
          from: 'Used Cars <recipeapi@murkoff.com>',
          to: user.email,
          subject: `Urgent! Recipes API forgot password`,
          text: message,
        });
      }
      return { email: email };
    };
}