import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberRepository } from './member.repository';
import { Member } from './member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'interstella_allets',
      signOptions: {
        expiresIn: 60 * 60,
      }
    })
  ],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class MemberModule {}
