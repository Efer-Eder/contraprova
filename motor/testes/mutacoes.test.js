import test from 'node:test';
import assert from 'node:assert/strict';
import { aplicarMutacao, candidatosDoTexto, selecionar } from '../src/provar.js';

const trocas = (texto, py = false) => candidatosDoTexto(texto, py).map((c) => `${c.linha}:${c.de.trim()}>${c.para.trim()}`);

test('troca operadores de comparação e aritmética em JavaScript', () => {
  assert.deepEqual(trocas('const r = a === b;'), ['1:===>!==']);
  assert.deepEqual(trocas('if (a !== b) {}'), ['1:!==>===']);
  assert.deepEqual(trocas('if (a == b) {}'), ['1:==>!=']);
  assert.deepEqual(trocas('if (a != b) {}'), ['1:!=>==']);
  assert.deepEqual(trocas('x = a < b;'), ['1:<>>=']);
  assert.deepEqual(trocas('x = a > b;'), ['1:>><=']);
  assert.deepEqual(trocas('x = a <= b;'), ['1:<=>>']);
  assert.deepEqual(trocas('x = a >= b;'), ['1:>=><']);
  assert.deepEqual(trocas('return a + b;'), ['1:+>-']);
  assert.deepEqual(trocas('return a - b;'), ['1:->+']);
  assert.deepEqual(trocas('if (a && b) {}'), ['1:&&>||']);
  assert.deepEqual(trocas('if (a || b) {}'), ['1:||>&&']);
  assert.deepEqual(trocas('const v = true;'), ['1:true>false']);
  assert.deepEqual(trocas('const v = false;'), ['1:false>true']);
});

test('troca operadores em Python, incluindo and, or, True e False', () => {
  assert.deepEqual(trocas('if a and b:', true), ['1:and>or']);
  assert.deepEqual(trocas('if a or b:', true), ['1:or>and']);
  assert.deepEqual(trocas('x = True', true), ['1:True>False']);
  assert.deepEqual(trocas('x = False', true), ['1:False>True']);
  assert.deepEqual(trocas('if a == b:', true), ['1:==>!=']);
});

test('não mexe em setas, genéricos, incrementos, comentários nem textos', () => {
  assert.deepEqual(trocas('const f = (a) => a;'), []);
  assert.deepEqual(trocas('const m: Map<string, number> = x;'), []);
  assert.deepEqual(trocas('i++; j--; k += 1; n = -1;'), []);
  assert.deepEqual(trocas('// a === b e true'), []);
  assert.deepEqual(trocas('/* a + b */'), []);
  assert.deepEqual(trocas("const s = 'a === b && true';"), []);
  assert.deepEqual(trocas('const t = `a + b`;'), []);
  assert.deepEqual(trocas('x = 1  # a == b e True', true), []);
  assert.deepEqual(trocas('"""a and b"""', true), []);
  assert.deepEqual(trocas("import { a } from './a.js';"), []);
});

test('só troca no código quando a linha tem código e comentário', () => {
  assert.deepEqual(trocas('x = a + b; // a - b'), ['1:+>-']);
});

test('aplicarMutacao troca só o ponto escolhido e preserva o resto', () => {
  const texto = 'a = 1 + 2;\r\nb = 3 + 4;\r\n';
  const [primeiro, segundo] = candidatosDoTexto(texto, false);
  assert.equal(aplicarMutacao(texto, segundo), 'a = 1 + 2;\r\nb = 3 - 4;\r\n');
  assert.equal(aplicarMutacao(texto, primeiro), 'a = 1 - 2;\r\nb = 3 + 4;\r\n');
  assert.equal(aplicarMutacao(texto, { ...primeiro, coluna: 0 }), null);
});

test('a seleção é determinística, respeita o limite e espalha entre arquivos', () => {
  const mk = (n) => Array.from({ length: n }, (_, i) => ({ linha: i + 1, coluna: 0, de: '+', para: '-', original: '' }));
  const porArquivo = new Map([
    ['b.js', mk(10)],
    ['a.js', mk(10)],
    ['c.js', mk(1)],
  ]);
  const um = selecionar(porArquivo, 6);
  const dois = selecionar(new Map([...porArquivo].reverse()), 6);
  assert.deepEqual(um, dois);
  assert.equal(um.length, 6);
  assert.deepEqual([...new Set(um.map((m) => m.arquivo))].sort(), ['a.js', 'b.js', 'c.js']);
  assert.equal(selecionar(porArquivo, 100).length, 21);
});
