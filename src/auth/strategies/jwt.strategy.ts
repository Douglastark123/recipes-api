import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  // Omit<User, 'password'>

  async validate(payload: { sub: string; email: string }): Promise<any> {
    const decodedJWT = { id: payload.sub, email: payload.email };

    const user = await this.usersService.findById(decodedJWT.id);

    return user;
  }
}
