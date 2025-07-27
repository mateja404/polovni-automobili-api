import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly jwtService: JwtService, @Inject(refreshConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshConfig>) {}

  async registerUser(email: string, password: string): Promise<{ message: string }> {
    const existingUser = await this.userModel.findOne({ email: email });
    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const newUser = await this.userModel.create({
      email: email,
      password: hashedPw,
    });

    return { message: "Successfully registered" };
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const matchingPassword = await bcrypt.compare(password, user.password);
    if (!matchingPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return { user: { id: user.id, email: user.email } };
  }

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
  }

  async generateTokens(userId: any) {
    const payload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([this.jwtService.signAsync(payload), this.jwtService.signAsync(payload, this.refreshTokenConfig)]);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async validateJwtUser(userId: Types.ObjectId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const currentUser = { id: user.id };
    return currentUser;
  }

  async validateRefreshToken(userId: Types.ObjectId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const currentUser = { id: user.id };
    return currentUser;
  }

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
  }
}