# 💰 Controle de Despesas

Aplicação web para controle de despesas compartilhado entre múltiplos usuários.

## 📋 Funcionalidades

- ✅ Lançamento de despesas com descrição, valor e categoria
- 📊 Resumo por categoria com filtro mensal
- 📝 Lista de últimos lançamentos
- 👥 Sistema multi-usuário (compartilhe com esposa, família, etc)
- 🔗 Convite via link para adicionar usuários
- 💾 Dados salvos localmente no navegador

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Passo a Passo

1. **Crie a estrutura de pastas:**

```bash
mkdir controle-despesas
cd controle-despesas
```

2. **Crie os arquivos na raiz do projeto:**
   - `package.json`
   - `vite.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `index.html`

3. **Crie a pasta `src` e os arquivos dentro:**

```bash
mkdir src
```

   - `src/main.jsx`
   - `src/App.jsx`
   - `src/index.css`

4. **Instale as dependências:**

```bash
npm install
```

5. **Execute o projeto:**

```bash
npm run dev
```

6. **Acesse no navegador:**

Abra [http://localhost:5173](http://localhost:5173)

## 📦 Build para Produção

Para gerar os arquivos otimizados para produção:

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/`

## 🌐 Deploy

Você pode fazer deploy gratuito em:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

## 📱 Como Usar

### Primeira Vez

1. Acesse a aplicação
2. Digite seu nome (ex: Giglecio)
3. Clique em "Criar Nova Conta"

### Adicionar Outro Usuário (ex: sua esposa)

1. Na tela principal, clique em "Convidar"
2. Clique em "Gerar Link"
3. Envie o link para a outra pessoa
4. Ela abre o link, digita o nome dela e clica em "Entrar em Conta Existente"

### Lançar Despesas

1. Preencha a descrição (ex: Supermercado)
2. Digite o valor
3. Selecione a categoria
4. Clique em "Adicionar Despesa"

### Ver Resumo

- Use o filtro de mês para ver gastos de períodos específicos
- Veja o total por categoria
- Confira os últimos lançamentos com quem registrou cada despesa

## 🗂️ Estrutura do Projeto

```
controle-despesas/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    └── index.css
```

## 🛠️ Tecnologias

- **React 18** - Framework JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **LocalStorage** - Armazenamento de dados

## 💾 Armazenamento de Dados

Os dados são salvos no `localStorage` do navegador. Isso significa:
- ✅ Funciona offline
- ✅ Sem necessidade de servidor
- ⚠️ Dados ficam no navegador (não sincronizam entre dispositivos)
- ⚠️ Se limpar os dados do navegador, perde as informações

## 🔒 Privacidade

Todos os dados ficam salvos apenas no seu navegador. Nenhuma informação é enviada para servidores externos.

## 📝 Licença

Livre para uso pessoal e comercial.

---

Desenvolvido para controle financeiro familiar 👨‍👩‍👧‍👦💰