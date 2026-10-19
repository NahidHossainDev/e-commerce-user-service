import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { config } from 'src/config';
import {
  AccountStatus,
  AuthProvider,
} from 'src/modules/user-service/user/user.schema';
import { UserService } from 'src/modules/user-service/user/user.service';
import { FacebookLoginDto, GoogleLoginDto } from '../dto/social-auth.dto';
import { generateRandomPassword } from '../helper/helper';
import { AuthService } from './auth.service';

@Injectable()
export class SocialAuthService {
  private readonly logger = new Logger(SocialAuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  generateGoogleAuthUrl(options?: {
    callbackUrl?: string;
    redirectUri?: string;
  }): string {
    const clientId = config.social.google.clientId;
    if (!clientId) {
      throw new BadRequestException(
        'Google Client ID is not configured on the backend.',
      );
    }

    const redirectUri =
      options?.redirectUri ||
      config.social.google.callbackUrl ||
      `${config.social.frontendAppUrl}/api/auth/google/callback`;

    const stateObj = {
      callbackUrl: options?.callbackUrl || '/',
      ts: Date.now(),
    };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64url');

    const client = new OAuth2Client(
      clientId,
      config.social.google.clientSecret,
      redirectUri,
    );

    return client.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'email', 'profile'],
      prompt: 'select_account',
      response_type: 'code',
      state,
      redirect_uri: redirectUri,
    });
  }

  generateFacebookAuthUrl(options?: {
    callbackUrl?: string;
    redirectUri?: string;
  }): string {
    const appId = config.social.facebook.appId;
    if (!appId) {
      throw new BadRequestException(
        'Facebook App ID is not configured on the backend.',
      );
    }

    const redirectUri =
      options?.redirectUri ||
      config.social.facebook.callbackUrl ||
      `${config.social.frontendAppUrl}/api/auth/facebook/callback`;

    const stateObj = {
      callbackUrl: options?.callbackUrl || '/',
      ts: Date.now(),
    };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64url');

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email,public_profile',
      state,
    });

    return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;
  }

  async googleLogin(payload: GoogleLoginDto) {
    const { googleIdToken, code, redirectUri } = payload;
    let googleUser: any = null;

    if (code) {
      const clientId = config.social.google.clientId;
      const clientSecret = config.social.google.clientSecret;
      if (!clientSecret) {
        this.logger.error('GOOGLE_CLIENT_SECRET is missing in backend .env');
        throw new BadRequestException(
          'Google Client Secret is missing. Please set GOOGLE_CLIENT_SECRET in backend .env',
        );
      }

      const effectiveRedirectUri =
        redirectUri ||
        config.social.google.callbackUrl ||
        `${config.social.frontendAppUrl}/api/auth/google/callback`;

      const client = new OAuth2Client(
        clientId,
        clientSecret,
        effectiveRedirectUri,
      );

      try {
        const { tokens } = await client.getToken(code);
        if (!tokens.id_token) {
          throw new UnauthorizedException(
            'No ID token received from Google code exchange.',
          );
        }

        const ticket = await client.verifyIdToken({
          idToken: tokens.id_token,
          audience: clientId,
        });
        googleUser = ticket.getPayload();
      } catch (error: any) {
        const errorDetail =
          error?.response?.data?.error_description ||
          error?.message ||
          'Failed to exchange authorization code with Google.';
        this.logger.error(`Google code exchange failed: ${errorDetail}`);
        throw new UnauthorizedException(errorDetail);
      }
    } else if (googleIdToken) {
      googleUser = await this.verifyGoogleToken(googleIdToken);
    } else {
      throw new BadRequestException(
        'Either code or googleIdToken must be provided.',
      );
    }

    if (!googleUser || !googleUser.email) {
      this.logger.warn('Invalid Google Token attempt');
      throw new UnauthorizedException('Invalid Google Token or user profile');
    }

    const {
      email,
      name,
      sub: googleId,
      picture,
      given_name,
      family_name,
      locale,
      email_verified,
    } = googleUser;

    const googleProfile = {
      id: googleId,
      email,
      fullName: name,
      firstName: given_name,
      lastName: family_name,
      avatarUrl: picture,
      locale,
      emailVerified: Boolean(email_verified),
      syncedAt: new Date(),
    };

    let user = await this.userService.findByEmail(email);
    if (user) {
      const updates: any = {
        'socialData.google': googleProfile,
      };
      if (!user.googleId) {
        updates.googleId = googleId;
        updates.provider = AuthProvider.GOOGLE;
        updates.verification = { ...user.verification, emailVerified: true };
      }
      if (!user.profile?.imageUrl && picture) {
        updates['profile.imageUrl'] = picture;
      }
      await this.userService.update(user._id.toString(), updates);
    } else {
      const newUser = {
        email,
        password: generateRandomPassword(),
        profile: {
          fullName: name as string,
          ...(picture ? { imageUrl: picture } : {}),
        },
        googleId,
        provider: AuthProvider.GOOGLE,
        accountStatus: AccountStatus.ACTIVE,
        verification: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          phoneVerified: false,
        },
        socialData: {
          google: googleProfile,
        },
      };
      user = await this.userService.create(newUser);
    }

    return this.authService.issueTokens(user);
  }

  async facebookLogin(payload: FacebookLoginDto) {
    const { facebookAccessToken, code, redirectUri } = payload;
    let fbUser: any = null;

    if (code) {
      const appId = config.social.facebook.appId;
      const appSecret = config.social.facebook.appSecret;
      if (!appSecret) {
        this.logger.error('FACEBOOK_APP_SECRET is missing in backend .env');
        throw new BadRequestException(
          'Facebook App Secret is missing. Please set FACEBOOK_APP_SECRET in backend .env',
        );
      }
      const effectiveRedirectUri =
        redirectUri ||
        config.social.facebook.callbackUrl ||
        `${config.social.frontendAppUrl}/api/auth/facebook/callback`;

      try {
        const params = new URLSearchParams({
          client_id: appId,
          redirect_uri: effectiveRedirectUri,
          code,
        });
        if (appSecret) {
          params.set('client_secret', appSecret);
        }

        const tokenRes = await axios.get(
          `https://graph.facebook.com/v21.0/oauth/access_token?${params.toString()}`,
        );
        const accessToken = tokenRes.data?.access_token;
        if (!accessToken) {
          throw new UnauthorizedException(
            'No access token received from Facebook code exchange.',
          );
        }
        fbUser = await this.verifyFacebookToken(accessToken);
      } catch (error: any) {
        this.logger.error(
          `Facebook code exchange failed: ${error?.response?.data?.error?.message || error?.message}`,
        );
        throw new UnauthorizedException(
          error?.response?.data?.error?.message ||
            'Failed to exchange authorization code with Facebook.',
        );
      }
    } else if (facebookAccessToken) {
      fbUser = await this.verifyFacebookToken(facebookAccessToken);
    } else {
      throw new BadRequestException(
        'Either code or facebookAccessToken must be provided.',
      );
    }

    if (!fbUser) {
      this.logger.warn('Invalid Facebook Token attempt');
      throw new UnauthorizedException('Invalid Facebook Token');
    }

    const { email, name, id: facebookId } = fbUser;
    const fbAvatarUrl = fbUser.picture?.data?.url;

    if (!email) {
      throw new BadRequestException(
        'Email not provided by Facebook. Please use phone login.',
      );
    }

    const facebookProfile = {
      id: facebookId,
      email,
      fullName: name,
      avatarUrl: fbAvatarUrl,
      syncedAt: new Date(),
    };

    let user = await this.userService.findByEmail(email);
    if (user) {
      const updates: any = {
        'socialData.facebook': facebookProfile,
      };
      if (!user.facebookId) {
        updates.facebookId = facebookId;
        updates.provider = AuthProvider.FACEBOOK;
        updates.verification = { ...user.verification, emailVerified: true };
      }
      if (!user.profile?.imageUrl && fbAvatarUrl) {
        updates['profile.imageUrl'] = fbAvatarUrl;
      }
      await this.userService.update(user._id.toString(), updates);
    } else {
      const newUser = {
        email,
        password: generateRandomPassword(),
        profile: {
          fullName: name,
          ...(fbAvatarUrl ? { imageUrl: fbAvatarUrl } : {}),
        },
        facebookId,
        provider: AuthProvider.FACEBOOK,
        accountStatus: AccountStatus.ACTIVE,
        verification: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          phoneVerified: false,
        },
        socialData: {
          facebook: facebookProfile,
        },
      };
      user = await this.userService.create(newUser);
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
        `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${token}`,
      );
      return data;
    } catch (error) {
      return null;
    }
  }
}
