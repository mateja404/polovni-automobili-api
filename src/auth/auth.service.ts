import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly jwtService: JwtService, @Inject(refreshConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshConfig>, private readonly mailService: MailerService) {}

  async registerUser(email: string, password: string): Promise<{ message: string }> {
    const existingUser = await this.userModel.findOne({ email: email });
    if (existingUser) {
      throw new ConflictException("User already exists");
    };

    const hashedPw = await bcrypt.hash(password, 12);
    const newUser = await this.userModel.create({
      email: email,
      password: hashedPw,
    });

    return { message: "Successfully registered" };
  };

  async validateLocalUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedException("User not found");
    };

    const matchingPassword = await bcrypt.compare(password, user.password);
    if (!matchingPassword) {
      user.loginAttempts += 1;
      throw new UnauthorizedException("Invalid credentials");
    }
    if (user.loginAttempts >= 3) {
      const returnMessage = user.language === "rs" ? "Nalog je zaključan" : "Account is locked";
      const stringId = String(user._id);
      const userId = new Types.ObjectId(stringId);
      await this.sendUnclockEmail(userId);
      throw new UnauthorizedException(returnMessage);
    };

    return { user: { id: user.id, email: user.email } };
  };

  async login(userId: Types.ObjectId, email: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    return {
      user: {
        id: userId,
        email: email,
      },
      accessToken: accessToken,
      refreshToken: refreshToken
    };
  };

  async generateTokens(userId: any) {
    const payload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([this.jwtService.signAsync(payload), this.jwtService.signAsync(payload, this.refreshTokenConfig)]);

    return { accessToken: accessToken, refreshToken: refreshToken };
  };

  async validateJwtUser(userId: Types.ObjectId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const currentUser = { id: user.id };
    return currentUser;
  };

  async validateRefreshToken(userId: Types.ObjectId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const currentUser = { id: user.id };
    return currentUser;
  };

  async refreshToken(userId: Types.ObjectId, email:string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    return {
      user: {
        id: userId,
        email: email,
      },
      accessToken: accessToken,
      refreshToken: refreshToken
    };
  };

  async sendUnclockEmail(userId: Types.ObjectId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    };

    const linkId = uuidv4();
    const message = user.language === "rs" ? `Vaš nalog je zaključan \nOtključajte ga na sledećem linku link http://localhost:3000/forgotpassword/reset/${linkId} \nU slučaju da Vaš nalog nije zaključan, ignorišite ovaj email!` : `Your account is locked \nUnlock it in in provided link http://localhost:3000/forgotpassword/reset/${linkId} \nIn case your account is not locked, please ignore this email!`;

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
      };
  };
};