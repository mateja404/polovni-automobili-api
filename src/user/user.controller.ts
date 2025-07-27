import { Controller, Post, Get, Request, UseGuards, Body, Param } from '@nestjs/common';
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
    @Get("protected")
    getProtectedRoute(@Request() req) {
      return "protected";
    }

    @Post("submitemail")
    sendEmail(@Body() body: { email: string }) {
      return this.userService.sendEmail(body.email);
    }

    @Get("checklink/:id")
    checkLink(@Param("id") linkId: string) {
      return this.userService.checkLinkId(linkId)
    }
}