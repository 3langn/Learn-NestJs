import { PrimaryGeneratedColumn, Column, Entity, AfterInsert } from 'typeorm';
import bcrypt from 'bcrypt';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
}
