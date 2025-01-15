import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './auth/member.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    // BoardsModule,
    // AuthModule,
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
