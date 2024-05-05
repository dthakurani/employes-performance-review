import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePerformanceReviewTopicMapping1714897877273
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.createTable(
        new Table({
          name: 'performance_review_topic_mapping',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'performance_review_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'performance_review_topic_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'required',
              type: 'boolean',
              default: false,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
              isNullable: false,
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
              isNullable: false,
            },
            {
              name: 'deleted_at',
              type: 'timestamp',
              isNullable: true,
            },
          ],
        }),
        true,
      );

      await queryRunner.createForeignKeys('performance_review_topic_mapping', [
        new TableForeignKey({
          columnNames: ['performance_review_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'performance_reviews',
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          columnNames: ['performance_review_topic_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'performance_review_topics',
          onDelete: 'CASCADE',
        }),
      ]);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.dropTable('performance_review_topic_mapping');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }
}
