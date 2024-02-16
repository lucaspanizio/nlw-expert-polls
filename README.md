<!--
<p>
  <img src="https://i.postimg.cc/HnHjH416/rocketseat-logo.png" alt="Logo RocketSeat" width="200" align="left" style="padding-top:13px">
  <img src="https://i.postimg.cc/m2pHLtyQ/nlw-expert.png" alt="Logo NLW SpaceTime" tittle="Logo NLW Expert" width="180" align="right">
</p>
<br>
-->

<div>
  <img align="right" src="https://i.postimg.cc/m2pHLtyQ/nlw-expert.png" alt="Logo NLW SpaceTime" tittle="Logo NLW Expert" width="180">
  <h1 align="left">Expert Polls</h1>
</div>
<p align="left">
  API capaz de criar, consultar e votar em enquetes com múltiplas alternativas, utilizando rotas HTTP e WebSocket. Este projeto foi desenvolvido na trilha Node.js durante a 14ª edição do evento Next Level Week Expert da <a href="https://www.rocketseat.com.br/">RocketSeat</a>, em fevereiro de 2024.
</p>

<p align="center">
  <a href="#-tecnologias">🚀 Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-pré-requisitos">☝ Pré-Requisitos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-executar">⚡ Como Executar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-documentação">📝 Documentação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licença">📜 Licença</a>
  <br><br>
  <img src="https://github.com/lucaspanizio/nlw-expert-polls/assets/32407181/8faf2849-2c52-48b1-9225-1ff5df440cb3" alt="Esboço do Projeto NLW Expert Polls" title="Esboço do Projeto NLW Expert Polls">  
</p>
<br>

## 🚀 Tecnologias

<div>  
  <a href="https://developer.mozilla.org/pt-BR/docs/Web/JavaScript" target="_blank"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/Typescript-%233178C6?style=for-the-badge&logo=Typescript&logoColor=%23fff" alt="Typescript"/></a>
  <a href="https://www.npmjs.com/" target="_blank"><img src="https://img.shields.io/badge/NPM-%23CB3837?style=for-the-badge&logo=npm" alt="NPM"/></a>
  <a href="https://nodejs.org/en" target="_blank"><img src="https://img.shields.io/badge/Node.JS-%238cbf3e?style=for-the-badge&logo=node.js&logoColor=%2345453b" alt="Node.js"/></a>    
  <a href="https://redis.io/" target="_blank"><img src="https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/></a>
  <a href="https://www.prisma.io/" target="_blank"><img src="https://img.shields.io/badge/Prisma-02364e?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma"/></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreeSQL"/></a>
  <a href="https://www.docker.com/" target="_blank"><img src="https://img.shields.io/badge/Docker-%232496ED?style=for-the-badge&logo=Docker&logoColor=%23fff" alt="Docker"/></a>
  <a href="https://fastify.dev/" target="_blank"><img src="https://img.shields.io/badge/Fasfity-%23000000?style=for-the-badge&logo=fastify&logoColor=%23fff" alt="Fastify"/></a>
  <a href="https://zod.dev/" target="_blank"><img src="https://img.shields.io/badge/Zod-%233167b5?style=for-the-badge&logo=zod&logoColor=%23152642" alt="Zod"/></a>
  <a href="https://hoppscotch.io/" target="_blank"><img src="https://img.shields.io/badge/Hoppscotch-%23081b17?style=for-the-badge&logo=hoppscotch&logoColor=%2301eac2" alt="Hoppscotch"/></a>
  <a href="https://code.visualstudio.com/" target="_blank"><img src="https://img.shields.io/badge/VSCode-%23007ACC?style=for-the-badge&logo=visualstudiocode" alt="VS Code"/></a>
</div>
<br>

## ☝ Pré-Requisitos

É necessário ter <a href="https://nodejs.org/en">Node.js</a> e <a href="https://www.docker.com/get-started">Docker</a> instalados previamente.
<br><br>

## ⚡ Como executar

Clone este repositório

```bash
git clone https://github.com/lucaspanizio/nlw-expert-polls.git
```

Acesse o diretório da aplicação

```bash
cd nlw-expert-polls
```

Instale as dependências

```bash
npm install
```

Suba os containers Docker do PostgreeSQL e Redis

```bash
docker compose up -d
```

Execute as migrações do Prisma para criar as tabelas do BD

```bash
npx prisma migrate dev
```

Execute a aplicação

```bash
npm run dev
```

Faça requisições para as rotas mapeadas da API, conforme documentação abaixo, por meio de uma plataforma como <a href="https://www.postman.com">Postman</a> ou <a href="https://hoppscotch.com/">Hoppscotch</a>.
<br><br>

## 📝 Documentação

## Rotas HTTP

<b>baseURL:</b> <code>localhost:3333</code>

<p><b>POST</b> <code>http://{baseURL}/polls</code><br>
Cria uma nova enquete.</p>

#### Request body

```json
{
  "title": "Qual é o melhor framework Node.JS ?",
  "options": ["Express", "Fastify", "NestJS", "HapiJS"]
}
```

#### Response body

```json
{
  "pollId": "16c73779-d463-43de-b832-4b4b10fc2b63"
}
```

![Print da requisição POST para a rota de criação de uma enquete](https://github.com/lucaspanizio/nlw-expert-polls/assets/32407181/a22501c6-48ec-476e-b7ae-4c823ee8008b)

<br>

<p><b>POST</b> <code>http://{baseURL}/polls/:pollId/votes</code><br>
Vota em uma opção de uma enquete.<br>
Obs.: Ao votar em outra opção de uma mesma enquete já votada anteriormente, o voto original será substituído pelo novo.
</p>

#### Request body

```json
{
  "pollOptionId": "2db536d6-2ffd-464d-b91b-1ee4c9e59d64"
}
```

#### Response body

```json
{
  "message": "Voto realizado com sucesso."
}
```

![Print da requisição POST para votar em uma opção de determinada enquete](https://github.com/lucaspanizio/nlw-expert-polls/assets/32407181/f323786d-a22b-42df-81b4-40542abefd51)

<br>

<p><b>GET</b> <code>http://{baseURL}/polls/:pollId</code><br>
Retorna dados de uma única enquete.</p>

#### Response body

```json
{
  "poll": {
    "id": "16c73779-d463-43de-b832-4b4b10fc2b63",
    "title": "Qual é o melhor framework Node.JS ?",
    "options": [
      {
        "id": "530b2c40-e197-44a7-80a3-7653f6753f3a",
        "title": "Express",
        "score": 0
      },
      {
        "id": "2db536d6-2ffd-464d-b91b-1ee4c9e59d64",
        "title": "Fastify",
        "score": 1
      },
      {
        "id": "ae6f6ee1-5a4e-44b7-a0e3-dee88e8c7485",
        "title": "NestJS",
        "score": 0
      },
      {
        "id": "8a8af74c-2844-4d6a-8c82-9fdede545773",
        "title": "HapiJS",
        "score": 0
      }
    ]
  }
}
```

![Print da requisição GET que retorna os dados de uma enquete específica](https://github.com/lucaspanizio/nlw-expert-polls/assets/32407181/029aa379-666d-460a-b7c2-ce6a86db303b)
<br>

## Rotas WebSockets

<p><code>ws://localhost:3333/polls/:pollId/results</code><br>
Recebe essa mensagem a cada voto feito.</br>
Obs.: Se usuário já havia votado nessa enquete, recebe também uma mensagem relativa a ID da opção antiga, e com o novo valor decrementado.</p>

#### Message

```json
{
  "pollOptionId": "2db536d6-2ffd-464d-b91b-1ee4c9e59d64",
  "votes": 1
}
```

![Print do retorno enviado pelo WebSocket ao "escutar" um POST na rota do voto em uma opção da enquete.](https://github.com/lucaspanizio/nlw-expert-polls/assets/32407181/c2aa091e-48e2-4d3b-83a8-ae4620421cf3)

<br>

## 📜 Licença

<p>Esse projeto está sob a <a href="https://github.com/lucaspanizio/nlw-expert-polls/blob/main/LICENSE">licença MIT</a>.<br>
<img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=49AA26&labelColor=000000">
</p>

#### Desenvolvido por José Lucas Panizio 🖖

[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/lucaspanizio/)](https://www.linkedin.com/in/lucaspanizio/)
[![Gmail Badge](https://img.shields.io/badge/-Gmail-ff0000?style=flat-square&labelColor=ff0000&logo=gmail&logoColor=white&link=mailto:lucaspanizio@gmail.com)](mailto:lucaspanizio@gmail.com)
