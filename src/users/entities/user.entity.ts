import { BaseEntity } from 'src/config/base.entity';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { ErrorHandler } from 'src/shared/error.handler';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ primary: true, generated: true })
  userId: number;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  lastname: string;

  @Column({ length: 500 })
  adress: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: 'user' })
  roles: string;

  @BeforeInsert()
  //@BeforeUpdate()
  public async hashPasswordBeforeInsert(): Promise<void> {
    if (this.password) {
      this.password = await User.hashPassword(this.password);
    }
  }

  public static hashPassword(password: string): Promise<string> {
    const hashedPassword = bcrypt.hash(password, +process.env.JTW_SALT);
    return hashedPassword;
  }

  public static async comparePassword(
    password: string,
    user: User,
  ): Promise<boolean> {
    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        ErrorHandler.handleUnauthorizedError(`Invalid email or password`);
      }
      return match;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }
}
