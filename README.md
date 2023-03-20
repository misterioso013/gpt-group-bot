# ChatGPT Group
Decidimos criar um bot de Telegram que usa a API do ChatGPT para responder algumas perguntas em nosso grupo de amigos onde todos são apaixonados por tecnologia, programação e <s>dinheiro</s> diversão.

O bot foi criado com o intuito de ajudar a responder algumas perguntas que são feitas no grupo, como por exemplo: "Como faço para instalar o X no Linux?", "Como faço para fazer Y no Python?", "Como não odiar java?", etc.

> **OBS:** Este projeto é bem específico para o nosso grupo de amigos, mas você pode usar o código como base para criar o seu próprio bot de Telegram.

> **OBS 2:** Este projeto foi desenvolvido dessa forma de propósito, então não se assuste se ver algo que não faz sentido ou que não é o melhor jeito de fazer. 😄 Tudo em nome da diversão!


## Como funciona?

O bot só irá responder as pessoas que estiverem no grupo ou que tiverem os IDs cadastrados no arquivo `.env`.

Para não responder todas as mensagens que forem enviadas no grupo, o bot só irá responder as mensagens que começarem com `!gpt`, tiverem o @ do bot ou quando as mensagens dele forem respondidas.

As mensagens respondidas serão usadas como contexto para o ChatGPT, então se você responder uma mensagem com `!gpt` o bot irá responder com uma resposta baseada na mensagem que você respondeu.

## Instalando

### Pré-requisitos

- [Node.js](https://nodejs.org/en/download/)
- Dinheiro 😢

### Instalação

1. Clone o repositório
```sh
git clone https://github.com/misterioso013/gpt-group-bot.git
```
2. Instale os pacotes NPM
```sh
npm install
```
3. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:
```bash
# Token do seu bot do Telegram
BOT_TOKEN=""
# API Key da sua conta do OpenAI
OPENAI_API_KEY=""
# ID do seu grupo do Telegram
ID_GROUP="-100..."
# Nome dos participantes do grupo
PARTICIPANTS="['Pessoa Um', 'Pessoa Dois', 'Pessoa Três']"
# ID dos participantes do grupo
PARTICIPANTS_ID=[123456789, 987654321, 123987456]
```
4. Inicie o bot em modo de desenvolvimento
```sh
npm run dev
```

#### Para rodar o bot em produção

1. Instale o [PM2](https://pm2.keymetrics.io/)
```sh
npm install pm2 -g
```
2. Faça o build do projeto
```sh
npm run build
```
3. Inicie o bot em modo de produção
```sh
pm2 start npm --name "gpt-group-bot" -- start
```

## OpenAI

É extremamente interessante e cara usar a API do OpenAI para esse tipo de coisa, então recomendamos usar com moderação ou simplesmente usar a [versão gratuita](https://chat.openai.com/).

😄❤️ Obrigado por chegar até aqui e espero que você tenha gostado do projeto!