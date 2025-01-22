# Skill Exchange

## Descrição

O Skill Exchange é uma plataforma que permite aos usuários trocar habilidades entre si. Os usuários podem criar perfis, listar suas habilidades, propor trocas de habilidades e se comunicar através de um sistema de chat em tempo real. Além disso, os usuários podem avaliar as trocas realizadas, fornecendo feedback sobre a experiência.

## Funcionalidades

- **Autenticação de Usuários**: Registro e login de usuários.
- **Gerenciamento de Habilidades**: Criação, atualização e exclusão de habilidades.
- **Propostas de Troca**: Envio e recebimento de propostas de troca de habilidades.
- **Sistema de Chat**: Comunicação em tempo real entre os usuários.
- **Avaliações**: Avaliação das trocas realizadas pelos usuários.

## Tecnologias Utilizadas

- **Frontend**: React, Chakra UI, React Query, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Autenticação**: JWT (JSON Web Tokens)
- **WebSockets**: Socket.IO

## Instalação

### Pré-requisitos

- Node.js
- MongoDB

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/skill-exchange.git
   cd skill-exchange
   ```

2. Instale as dependências do backend:
   ```bash
   cd backend
   npm install
   ```

3. Instale as dependências do frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:
     ```
     MONGO_URI=mongodb://localhost:27017/skill-exchange
     JWT_SECRET=sua_chave_secreta
     FRONTEND_URL=http://localhost:3000
     ```

5. Inicie o servidor backend:
   ```bash
   cd backend
   npm start
   ```

6. Inicie o servidor frontend:
   ```bash
   cd ../frontend
   npm start
   ```

## Uso

1. Acesse o frontend no navegador:
   ```
   http://localhost:3000
   ```

2. Registre-se ou faça login para acessar a plataforma.

3. Crie suas habilidades, proponha trocas e comece a se comunicar com outros usuários!

## Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Faça o push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
```