import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { config } from 'src/config';
import {
  AccountStatus,
  AuthProvider,
} from 'src/modules/user-service/user/user.schema';
import { UserService } from 'src/modules/user-service/user/user.service';
import { FacebookLoginDto, GoogleLoginDto } from '../dto/social-auth.dto';
import { AuthService } from './auth.service';

@Injectable()
export class SocialAuthService {
  private readonly logger = new Logger(SocialAuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async googleLogin(payload: GoogleLoginDto) {
    const { googleIdToken } = payload;
    const googleUser = await this.verifyGoogleToken(googleIdToken);

    if (!googleUser) {
      this.logger.warn('Invalid Google Token attempt');
      throw new UnauthorizedException('Invalid Google Token');
    }

    const { email, name, sub: googleId } = googleUser;

    let user = await this.userService.findByEmail(email!);
    if (user) {
      if (!user.googleId) {
        const updatedUser = {
          googleId,
          provider: AuthProvider.GOOGLE,
          verification: { ...user.verification, emailVerified: true },
        };
        await this.userService.update(user._id.toString(), updatedUser as any);
      }
    } else {
      const newUser = {
        email,
        password: crypto.randomBytes(16).toString('hex'),
        profile: { fullName: name },
        googleId,
        provider: AuthProvider.GOOGLE,
        accountStatus: AccountStatus.ACTIVE,
        verification: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          phoneVerified: false,
        },
      };
      user = await this.userService.create(newUser as any);
    }

    return this.authService.issueTokens(user);
  }

  async facebookLogin(payload: FacebookLoginDto) {
    const { facebookAccessToken } = payload;
    const fbUser = await this.verifyFacebookToken(facebookAccessToken);

    if (!fbUser) {
      this.logger.warn('Invalid Facebook Token attempt');
      throw new UnauthorizedException('Invalid Facebook Token');
    }

    const { email, name, id: facebookId } = fbUser;

    if (!email) {
      throw new BadRequestException(
        'Email not provided by Facebook. Please use phone login.',
      );
    }

    let user = await this.userService.findByEmail(email);
    if (user) {
      if (!user.facebookId) {
        const updatedUser = {
          facebookId,
          provider: AuthProvider.FACEBOOK,
          verification: { ...user.verification, emailVerified: true },
        };
        await this.userService.update(user._id.toString(), updatedUser as any);
      }
    } else {
      const newUser = {
        email,
        password: crypto.randomBytes(16).toString('hex'),
        profile: { fullName: name },
        facebookId,
        provider: AuthProvider.FACEBOOK,
        accountStatus: AccountStatus.ACTIVE,
        verification: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          phoneVerified: false,
        },
      };
      user = await this.userService.create(newUser as any);
    }

    return this.authService.issueTokens(user);
  }

  private async verifyGoogleToken(token: string) {
    const client = new OAuth2Client(config.social.google.clientId);
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.social.google.clientId,
      });
      return ticket.getPayload();
    } catch (error) {
      return null;
    }
  }

  private async verifyFacebookToken(token: string) {
    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`,
      );
      return data;
    } catch (error) {
      return null;
    }
  }
}
