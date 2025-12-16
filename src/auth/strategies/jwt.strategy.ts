import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'src/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecretKey,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
        throw new UnauthorizedException();
    }
    // Check if account is active/not blocked etc. if needed here or in Guard
    return user;
  }
}
