import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class FixCreatedAtColumnName1760873245835 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verifica se a coluna ceated_at existe antes de renomear
    const table = await queryRunner.getTable('users');
    const hasWrongColumn = table?.columns.find(
      column => column.name === 'ceated_at',
    );

    if (hasWrongColumn) {
      await queryRunner.query(
        'ALTER TABLE users RENAME COLUMN ceated_at TO created_at;',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Verifica se a coluna created_at existe antes de renomear de volta
    const table = await queryRunner.getTable('users');
    const hasCorrectColumn = table?.columns.find(
      column => column.name === 'created_at',
    );

    if (hasCorrectColumn) {
      await queryRunner.query(
        'ALTER TABLE users RENAME COLUMN created_at TO ceated_at;',
      );
    }
  }
}
