import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'nestdemo',
      entities: [Users],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({  
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    })  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
