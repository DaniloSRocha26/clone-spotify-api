# Clone Spotify API

Projeto simples que usa a API do Spotify para autenticar, pegar token e tocar uma música.

## Como rodar

- Clone o repositório  
- Rode `npm install`  
- Crie um aplicativo no [Spotify Developer Dashboard](https://developer.spotify.com/documentation/web-api) para obter suas chaves (Client ID e Client Secret)  
- Crie um arquivo `.env` baseado no `.env.example` com suas chaves do Spotify  
- No código, na função `playTrack()`, configure o URI da música que deseja tocar. Exemplo:  

  ```js
  const trackUri = "spotify:track:6rUp7v3l8yC4TKxAAR5Bmx"  // substitua pelo URI da música que quer tocar
