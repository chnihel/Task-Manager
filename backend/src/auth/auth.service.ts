import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import * as argon2 from "argon2"

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService
  ) { }



  async signIN(data: CreateAuthDto) {
    const user = await this.userService.findUserByEmail(data.email)
    if (!user) {
      throw new BadRequestException(`User with email ${data.email} is not exist`)
    }

    const passwordVerify = await argon2.verify(user.password, data.password)
    if (!passwordVerify) {
      throw new BadRequestException(`User with password ${data.password} is not valid`)
    }

    const tokens = await this.getTokens(user._id, user.name)
    await this.updateRefreshToken(user._id, tokens.refreshToken)
    const { refreshToken, ...userWithoutRefreshToken } = user.toObject();

    return { user: userWithoutRefreshToken, accessToken: tokens.accessToken }
  }

  async getTokens(userID: any, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userID, username
        },
        {
          secret: this.configService.get<string>('JWT_Access_Secret'),
          expiresIn: '15m'
        }
      ),

      this.jwtService.signAsync(
        {
          sub: userID, username
        },
        {
          secret: this.configService.get<string>('JWT_Refresh_Secret'),
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken }
  }

  async updateRefreshToken(userID: any, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken)
    await this.userService.UpdateUser(userID, { refreshToken: hashedRefreshToken })
  }


  async forgetPassword(email: string) {
    try {
      const user = await this.userService.findUserByEmail(email)
      if (!user) {
        throw new BadRequestException(`User with email ${email} not exist`)
      } else {
        const token = await this.jwtService.signAsync({ id: user._id }, { secret: this.configService.get<string>('JWT_Access_Secret'), expiresIn: '5m' })
        await this.userService.updateToken(user._id, token)
        const option = {
          to: user.email,
          subject: 'forget-password',
          context: { token: token },
          html: `<h1>Update your password<a href=http://localhost:3000/${token}>Click Here</a></h1>`
        }

        await this.mailerService.sendMail(option)
        return { success: true, message: 'You can change ur password', data: user }
      }
    } catch (error) {
      return error

    }
  }

  async resetPassword(newPassword: string, token: string) {
    try {
      const verifyToken = await this.jwtService.verify(token, { secret: this.configService.get<string>('JWT_Access_Secret') })
      if (!verifyToken) {
        throw new BadRequestException(`Invalid Token`)
      }
      const user = await this.userService.getOneUser(verifyToken.id)
      if (!user) {
        throw new BadRequestException(`User with token ${token} not exist`)
      }
      const hashedPassword = await argon2.hash(newPassword)

      console.log('hashed password', hashedPassword)

      user.password = hashedPassword

      console.log('new password', user.password)
      await this.userService.UpdateUser(user.id, { password: hashedPassword, refreshToken: undefined })

      const updateUser = await this.userService.getOneUser(user.id)
      console.log('message: updated password', updateUser.password)

      return { success: true, message: "Password Updated Successfully", data: user }
    } catch (error) {
      return error
    }
  }

  async logout(userId: string) {
    return this.userService.UpdateUser(userId, { refreshToken: undefined });
  }
}
