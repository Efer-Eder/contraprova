# Exemplo: Python com unittest

Código e testes pequenos em Python que usam só a biblioteca padrão. Sem pytest, então rode com o comando explícito:

```sh
node motor/bin/contraprova.js verificar motor/exemplos/python-unittest --comando "python -m unittest"
```

Defeito proposital: nenhum. Resultado esperado: aprovado (código de saída 0). Os testes do motor pulam este exemplo, com aviso, se o Python não estiver instalado.
