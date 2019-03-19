import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

interface LocalRequest extends Request {
  user?: {
    roles: string[];
  };
}

export const User = createParamDecorator((data, req: LocalRequest) => {
  return req.user;
});
