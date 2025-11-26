import 'reflect-metadata';

// Global teardown para fechar conexões do Redis
afterAll(async () => {
  // Aguardar um pouco para garantir que todas as operações assíncronas terminem
  await new Promise(resolve => setTimeout(resolve, 100));
});
