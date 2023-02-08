import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { User } from '../entities/users.entity';
import { MessagesHelper } from 'src/helpers/messages.helpers';
import { UpdateUserDto } from '../dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private bcrypt: Bcrypt,
  ) {}

  async findByUser(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username: username },
      relations: { posting: true },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: { posting: true },
    });
  }

  async findById(id: string): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { id },
      relations: { posting: true },
    });

    if (!user)
      throw new HttpException(
        MessagesHelper.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    return user;
  }

  async create(data: User): Promise<User> {
    const usernameSearch = await this.findByUser(data.username);

    if (!usernameSearch) {
      data.password = await this.bcrypt.encryptPassword(data.password);
      const user = this.userRepository.create(data);
      return await this.userRepository.save(user);
    }

    throw new HttpException(
      MessagesHelper.EXISTING_USERNAME,
      HttpStatus.BAD_REQUEST,
    );
  }

  async update(user: UpdateUserDto): Promise<UpdateUserDto> {
    const userUpdate: User = await this.findById(user.id);
    const userSearch = await this.findByUser(user.username);
    const emailSearch = await this.findByEmail(user.email);

    if (!userUpdate)
      throw new HttpException(
        MessagesHelper.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    if (userSearch && userSearch.id !== user.id)
      throw new HttpException(
        MessagesHelper.EXISTING_USERNAME,
        HttpStatus.BAD_REQUEST,
      );

    if (emailSearch && emailSearch.id !== user.id)
      throw new HttpException(
        MessagesHelper.EXISTING_EMAIL,
        HttpStatus.BAD_REQUEST,
      );

    this.userRepository.merge(userUpdate, user);
    await this.userRepository.save(userUpdate);

    const updatedUser = await this.findById(user.id);

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }
}
