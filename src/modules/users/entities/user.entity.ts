import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { Role } from '../users.enum';
import { Designation } from '../../../modules/designations/entities/designation.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  email: string;

  @Column({ name: 'phone', type: 'varchar', nullable: false })
  phone: string;

  @Column({ name: 'address', type: 'varchar', nullable: false })
  address: string;

  @Column({ name: 'dob', type: 'date', nullable: false })
  dob: Date;

  @Column({ name: 'date_of_joining', type: 'date', nullable: false })
  dateOfJoining: Date;

  @Column({ name: 'role', type: 'enum', enum: Role, default: Role.EMPLOYEE })
  role: Role;

  @Column({ name: 'designation_id', type: 'uuid', nullable: false })
  designationId: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Timestamp;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Timestamp;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Timestamp;

  // Relations
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @ManyToOne(() => Designation, (designation) => designation.id)
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;
}
