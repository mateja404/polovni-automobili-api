import { Controller, Post, Get, Request, UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Types } from "mongoose";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get("userinfo")
    getUserInfo(@Request() req): Promise<any> {
      const typeSafeId = new Types.ObjectId(req.user.id);
      return this.userService.getUserInfo(typeSafeId);
    }

    @UseGuards(JwtAuthGuard)
    @Post("changepw")
    changeUserPw(@Request() req, @Body() body: { email: string }) {
      return this.userService.changeUserPw(req.user.id, body.email)
    }
}