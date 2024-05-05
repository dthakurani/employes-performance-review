import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { PerformanceReviewTopicMapping } from './performance-review-topic-mapping.entity';

@Entity('performance_reviews')
export class PerformanceReview extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'note', type: 'varchar', nullable: false })
  note: string;

  @Column({ name: 'start_date', type: 'date', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: false })
  endDate: Date;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Timestamp;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Timestamp;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Timestamp;

  // Relations
  @OneToMany(
    () => PerformanceReviewTopicMapping,
    (performanceReviewTopicMapping) =>
      performanceReviewTopicMapping.performanceReview,
  )
  performanceReviewTopicMapping: PerformanceReviewTopicMapping[];
}
