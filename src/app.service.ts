import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>
    ) {}

    async create(data: any): Promise<Users>{
        return this.userRepository.save(data);
    }

    async fineOne(data: any): Promise<Users>{
      return this.userRepository.findOne(data);
    }
}
