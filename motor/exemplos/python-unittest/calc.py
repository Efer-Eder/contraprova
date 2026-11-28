def soma(a, b):
    return a + b


def eh_par(n):
    return n % 2 == 0


def limitar(valor, minimo, maximo):
    if valor < minimo:
        return minimo
    if valor > maximo:
        return maximo
    return valor
