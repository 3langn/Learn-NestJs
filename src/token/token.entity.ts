import { TokenType } from 'src/common/constants/enum';
import { User } from 'src/user/user';
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
  userId: string;

  @UpdateDateColumn()
  updated_at: Date;
}
