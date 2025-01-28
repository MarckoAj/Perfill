const config = {
  preset: 'ts-jest', // Usa o ts-jest para suportar TypeScript
  testEnvironment: 'node', // Configura o ambiente de testes para Node.js
  collectCoverage: true, // Habilita a coleta de cobertura de testes
  collectCoverageFrom: ['src/**/*.ts'], // Define quais arquivos serão cobertos
  coverageDirectory: 'coverage', // Define o diretório onde os relatórios de cobertura serão armazenados
  coverageReporters: ['text-summary', 'lcov'], // Define os relatórios de cobertura que serão gerados
  moduleFileExtensions: ['ts', 'js'], // Extensões reconhecidas
  testMatch: ['**/__tests__/**/*.test.ts'], // Define onde os testes estão localizados
  clearMocks: true, // Limpa os mocks entre os testes
  verbose: true, // Exibe mais detalhes durante os testes
};

module.exports = config;
