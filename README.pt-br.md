# Inject JS for Views

Este projeto permite injetar e executar funções JS dinamicamente nas views (pug, jade, etc) em um aplicativo Express.js, facilitando a execução de funções definidas em arquivos JS diretamente nas views sem precisar fazer chamadas AJAX ou modificações no código do backend. O sistema é altamente configurável e busca funções de maneira dinâmica nos arquivos dentro do diretório `public/js`.

## Funcionalidades

- Injeta funções JavaScript definidas em arquivos dentro do diretório `public/js` nas views Pug.
- Permite a execução de funções JS com ou sem argumentos diretamente nas views.
- Suporte a diferentes tipos de retorno: strings, números, objetos, etc.
- Possibilidade de adicionar funções a partir de qualquer arquivo JS localizado no diretório especificado.

## Instalação

### Pré-requisitos

Este projeto requer Node.js e npm (ou yarn) instalados na sua máquina.

1. **Clone o repositório**

Abra o terminal e execute:

```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
```

2. **Instale as dependências**

No diretório do projeto, execute:

```
cd NOME_DO_REPOSITORIO
npm install
```

## Uso

1. **Configuração do Express.js com inject.js**

Adicione a seguinte configuração ao seu servidor Express para usar o módulo inject.js que você criou:

```javascript
const express = require('express');
const app = express();
const inject = require('./path/to/inject');  /* Ajuste o caminho para o arquivo inject.js */

inject(app);
```

2. **Criar funções JS para injeção**

No diretório public/js/, crie arquivos com funções JavaScript que você deseja injetar nas views Pug. Exemplo:

public/js/functions.js

```javascript
function teste() {
  return 'Função injetada com sucesso!';
}

module.exports.teste = teste;
```

3. **Usando a função no arquivo de view**

Dentro do seu arquivo de view (exemplo: views/index.pug), você pode chamar as funções JavaScript injetadas da seguinte forma:

views/index.pug

```pug
doctype html
html
  head
    title Exemplo de Injeção de Função
  body
    h1 Exemplo de Função JS Injetada:
    != inject('teste')
```

4. **Como passar argumentos para as funções**

Se a função precisar de argumentos, basta passá-los da seguinte maneira:

public/js/functions.js

```javascript
function saudacao(nome) {
  return `Olá, ${nome}! Bem-vindo ao sistema!`;
}

module.exports.saudacao = saudacao;
```

views/index.pug
```pug
h2 #{inject('saudacao', 'João')}  // Passa 'João' como argumento para a função
```

5. **Configurações adicionais**

Caso queira personalizar o caminho onde o inject.js busca os arquivos JavaScript ou configurar parâmetros adicionais, você pode modificar a chamada ao módulo dentro do seu código Express.

```javascript
inject(app, 'outro/diretorio/js');
```

## Como funciona

O inject.js funciona da seguinte maneira:

- O código busca recursivamente por arquivos .js dentro do diretório public/js (ou outro diretório que você configurar).
- Ao ser chamado pela view Pug, o método inject(funcName) busca e executa a função correspondente no arquivo JavaScript.
- Se a função retornar um valor (como uma string, número, ou objeto), ele é renderizado na view.
- Caso não encontre a função ou o arquivo, o módulo imprime uma mensagem de erro no console do backend (não visível para o usuário).

## Atenção

- Certifique-se de que as funções JavaScript estão corretamente exportadas nos arquivos JS.
- Use != no Pug para retornar valores como strings para evitar a escapação automática.
- Use #{} para outros tipos de valores (números, objetos, arrays, etc.).

## Licença

Este projeto está licenciado sob a MIT License.

## Contribuições

Contribuições são bem-vindas! Se você tiver sugestões ou melhorias, por favor, abra um issue ou envie um pull request.