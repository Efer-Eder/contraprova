export function soma(a, b) {
  return a + b;
}

export function maior(a, b) {
  if (a > b) return a;
  return b;
}

export function ehPar(n) {
  return n % 2 === 0;
}

export function limitar(valor, minimo, maximo) {
  if (valor < minimo) return minimo;
  if (valor > maximo) return maximo;
  return valor;
}
