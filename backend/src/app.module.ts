import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { FxModule } from './fx/fx.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000 * 60 * 15, // 15 minut
        limit: 5, // 5 prób
      },
      {
        name: 'long',
        ttl: 1000 * 60 * 60, // 1 godzina
        limit: 3, // 3 próby
      },
    ]),
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    WalletsModule,
    TransactionsModule,
    FxModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Throttling tylko dla endpointów autentykacji (nie globalnie)
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
