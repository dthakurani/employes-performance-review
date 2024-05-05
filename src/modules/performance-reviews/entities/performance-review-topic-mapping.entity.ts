import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PerformanceReview } from './performance-review.entity';
import { PerformanceReviewTopic } from 'src/modules/performance-review-topics/entities/performance-review-topic.entity';

@Entity('performance_review_topics')
export class PerformanceReviewTopicMapping extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'performance_review_id', type: 'uuid', nullable: false })
  performanceReviewId: string;

  @Column({
    name: 'performance_review_topic_id',
    type: 'uuid',
    nullable: false,
  })
  performanceReviewTopicId: string;

  @Column({ name: 'required', type: 'boolean', default: false })
  required: boolean;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Timestamp;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Timestamp;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Timestamp;

  //Relations
  @ManyToOne(
    () => PerformanceReview,
    (performanceReview) => performanceReview.id,
  )
  @JoinColumn({ name: 'performance_review_id' })
  performanceReview: PerformanceReview;

  @ManyToOne(
    () => PerformanceReviewTopic,
    (performanceReviewTopic) => performanceReviewTopic.id,
  )
  @JoinColumn({ name: 'performance_review_topic_id' })
  performanceReviewTopic: PerformanceReviewTopic;
}
