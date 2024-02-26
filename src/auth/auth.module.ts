import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStorage } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtStorage } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';

const jwtModule = JwtModule.register({
  secret: '1212',
  signOptions: { expiresIn: '1d' },
});

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), jwtModule, UserModule],
  providers: [AuthService, LocalStorage, JwtStorage],
  controllers: [AuthController],
})
export class AuthModule {}
