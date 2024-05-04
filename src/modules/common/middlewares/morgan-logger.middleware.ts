import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import morgan from 'morgan';
import { IMorganRequest } from '../common.type';

@Injectable()
export class MorganLoggerMiddleware implements NestMiddleware {
  private morganMiddleware = morgan('dev');

  use(req: IMorganRequest, res: Response, next: NextFunction) {
    const excludedRoutes = [{ url: '/health', method: 'GET' }];

    const isExcluded = excludedRoutes.find(
      (route) =>
        req.originalUrl.startsWith(route.url) && req.method === route.method,
    );

    if (isExcluded || req.logged) {
      next();
    } else {
      req.logged = true;
      this.morganMiddleware(req, res, next);
    }
  }
}
