#!/usr/bin/env node
import { main } from '../src/cli.js';

main(process.argv.slice(2)).then(
  (codigo) => {
    process.exitCode = codigo;
  },
  () => {
    // Falha segura: erro inesperado nunca vira aprovado.
    process.stderr.write('Erro interno do motor. Decisão: inconclusivo.\n');
    process.exitCode = 2;
  },
);
