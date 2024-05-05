import { PerformanceReviewTopicMapping } from 'src/modules/performance-reviews/entities/performance-review-topic-mapping.entity';
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

@Entity('performance_review_topics')
export class PerformanceReviewTopic extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'topic', type: 'varchar', nullable: false })
  topic: string;

  @Column({ name: 'description', type: 'varchar', nullable: false })
  description: string;

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
      performanceReviewTopicMapping.performanceReviewTopic,
  )
  performanceReviewTopicMapping: PerformanceReviewTopicMapping[];
}
