# Para que serve a camada de INFRA?

A camada de INFRA tem a responsabilidade de separar tudo que é componente/recurso externo
da nossa aplicação.

Em toda aplicação sempre vamos ter coisas que vamos usar que não é da própria aplicação,
mas sim algo externo, segue alguns exemplos:

- Interação com o banco de dados
- Requisição para API's terceiras (ex: api da marvel)
- Libs do npm/yarn