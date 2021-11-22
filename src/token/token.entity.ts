import { User } from 'src/users/entity/user';
import { TokenType } from 'src/utils/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  token: string;

  @Column({ enum: TokenType, type: 'enum' })
  type: TokenType;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.token, { onDelete: 'CASCADE' })
  user: User;

  @UpdateDateColumn()
  updated_at: Date;
}
