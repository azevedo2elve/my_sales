import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class FixCreatedAtColumnName1760873245835 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE users RENAME COLUMN ceated_at TO created_at;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE users RENAME COLUMN created_at TO ceated_at;',
    );
  }
}
