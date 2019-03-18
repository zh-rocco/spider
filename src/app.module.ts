import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware, logger } from './middleware/logger.middleware';

@Module({
  imports: [CatsModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer
      .apply(LoggerMiddleware, logger)
      .forRoutes({ path: '/cats', method: RequestMethod.GET })
      .apply(logger)
      .forRoutes({ path: '/cats/create', method: RequestMethod.POST });
  }
}
