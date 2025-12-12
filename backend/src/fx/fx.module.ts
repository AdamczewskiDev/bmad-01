import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FxService } from './fx.service';
import { FXRate } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([FXRate])],
  providers: [FxService],
  exports: [FxService],
})
export class FxModule {}
