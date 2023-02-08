import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Posting } from "../../posting/entities/posting.entity";
import { RegExHelper } from "../../helpers/regex.helper"
import { MessagesHelper } from "../../helpers/messages.helpers";

@Entity({ name: "users_tb" })
export class User {

    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    public id: number

    @IsNotEmpty()
    @Column({ nullable: false })
    @ApiProperty()
    public name: string

    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    @ApiProperty()
    public username: string

    @IsNotEmpty()
    @IsEmail()
    @Column({ nullable: false, unique: true })
    @ApiProperty({ example: 'email@email.com.br' })
    public email: string

    @IsNotEmpty()
    @Matches(RegExHelper.password, { message: MessagesHelper.PASSWORD_VALID })
    @Column({ nullable: false })
    @ApiProperty()
    public password: string

    @Column({ length: 5000, default: 'default.jpg' })
    @ApiProperty()
    public photo: string

    @ApiProperty()
    @OneToMany(() => Posting, (posting) => posting.user)
    @JoinTable()
    posting: Posting[]
}
