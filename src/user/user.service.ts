import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from "uuid";
import { MailerService } from '@nestjs-modules/mailer';
import { Resetlink, ResetlinkDocument } from 'src/schemas/resetlink.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, @InjectModel(Resetlink.name) private resetModel: Model<ResetlinkDocument>, private readonly mailService: MailerService) {}

    async getUserInfo(userId: Types.ObjectId): Promise<any> {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      return user;
    };

    async sendEmail(email: string): Promise<any> {
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

      const newLink = await this.resetModel.create({
        userId: user._id,
        resetLink: linkId
      });

      const returnMessage = user.language === "rs" ? "Reset link je poslat na Vaš email" : "Check your inbox for reset link"
      return { message: returnMessage };
    };

    async checkLinkId(linkId: string) {
      const existingLink = await this.resetModel.findOne({ resetLink: linkId });
      if (!existingLink) {
        throw new NotFoundException("Link not found");
      }
      if (existingLink.isActivated === true) {
        throw new ConflictException("Link is already activated");
      }

      existingLink.isActivated = true;
      await existingLink.save();

      return { message: "ok" };
    }
};