import { Controller, Post, Get, Request, UseGuards, Body, Param, Patch, Delete } from '@nestjs/common';
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

    @UseGuards(JwtAuthGuard)
    @Patch("changeuserpw")
    changeUserPw(@Request() req, @Body() body: { newPassword: string }) {
      const userId = new Types.ObjectId(req.user.id);
      return this.userService.changeUserPw(userId, body.newPassword);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("changelanguage")
    changeLanguage(@Request() req, @Body() body: { language: string }): Promise<{ message }> {
      const userId = new Types.ObjectId(req.user.id);
      return this.userService.changeLanguage(userId, body.language);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("deleteaccount")
    deleteAccount(@Request() req): Promise<any> {
      const userId = new Types.ObjectId(req.user.id);
      return this.userService.deleteAccount(userId);
    }
}