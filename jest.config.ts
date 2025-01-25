const config = {
  preset: 'ts-jest', // Usa o ts-jest para suportar TypeScript
  testEnvironment: 'node', // Configura o ambiente de testes para Node.js
  moduleFileExtensions: ['ts', 'js'], // Extensões reconhecidas
  testMatch: ['**/__tests__/**/*.test.ts'], // Define onde os testes estão localizados
  clearMocks: true, // Limpa os mocks entre os testes
  verbose: true, // Exibe mais detalhes durante os testes
};

module.exports = config;
