import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard() {

    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean;
        console.log(result);
        
        if (!result) {
          throw new UnauthorizedException();
        }
        
        return result;
      }
}