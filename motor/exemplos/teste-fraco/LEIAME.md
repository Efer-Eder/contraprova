# Exemplo: teste fraco

O mesmo código do exemplo `correto` (sem a divisão), mas os testes só chamam as funções e nunca conferem o resultado.

Defeito proposital: testes sem nenhuma asserção. Eles passam sempre, mesmo com o código quebrado. Resultado esperado de `verificar`: inconclusivo (código de saída 2), porque nenhum defeito introduzido é detectado. `investigar` aponta o arquivo de teste sem asserção reconhecível.
