import { PrimaryGeneratedColumn, Column, Entity, BeforeInsert } from 'typeorm';
import bcrypt from 'bcryptjs';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
}
