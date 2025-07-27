import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async getUserInfo(userId: Types.ObjectId): Promise<any> {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      return user;
    };

    async changeUserPw(userId: Types.ObjectId, email: string): Promise<any> {
      return { email: email };
    };
}