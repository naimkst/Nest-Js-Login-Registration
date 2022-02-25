import { Body, Controller, Get, NotFoundException, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService
    ) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    const hashPassword = await bcrypt.hash(password, 12);
    const user = this.appService.create({
      name,
      email,
      password: hashPassword
    });

    delete (await user).password;

    return user;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true}) response: Response
  ): Promise<string>{
    
    const user = await this.appService.fineOne({email});
    console.log(user);
    if(!user){
      throw new NotFoundException('User not found');
    }
    if(!await bcrypt.compare(password, user.password)){
      throw new NotFoundException('Wrong password');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id});

    response.cookie('jwt', jwt, {httpOnly: true});

    return 'Successfully logged in';
  }

  @Get('user')
  async user(@Req() request: Request){
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      if(!data)
        throw new UnauthorizedException('Unauthorized');

      const user = await this.appService.fineOne({id: data.id});
      const {password, ...result } = user;

      return result;

    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
    
  }

  @Post('logout')
  async logout(@Res({ passthrough: true}) response: Response){
    

  }


}
