#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pega o nome da migration dos argumentos ou da variável de ambiente npm
let migrationName = process.argv[2];

// Verifica se veio através do npm config (npm run migration:create --name=NomeDaMigration)
if (!migrationName && process.env.npm_config_name) {
  migrationName = process.env.npm_config_name;
}

// Se o argumento inclui --name=, extrai o nome
if (migrationName && migrationName.startsWith('--name=')) {
  migrationName = migrationName.split('=')[1];
} else if (process.argv.includes('--name')) {
  // Se --name está separado, pega o próximo argumento
  const nameIndex = process.argv.indexOf('--name');
  migrationName = process.argv[nameIndex + 1];
}

if (!migrationName) {
  console.error('Por favor, forneça um nome para a migration.');
  console.error('Uso: npm run migration:create --name=NomeDaMigration');
  console.error('  ou: npm run migration:create NomeDaMigration');
  process.exit(1);
}

const timestamp = Date.now();
const className =
  migrationName.charAt(0).toUpperCase() + migrationName.slice(1);
const fileName = `${timestamp}-${migrationName}.ts`;
const filePath = path.join(
  __dirname,
  '..',
  'src',
  'shared',
  'infra',
  'typeorm',
  'migrations',
  fileName,
);

const template = `import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class ${className}${timestamp} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Implementar a migration aqui
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Implementar o rollback aqui
  }
}
`;

fs.writeFileSync(filePath, template);
console.log(`Migration criada: ${fileName}`);
