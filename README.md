# Prompt técnico final — **BalançoTotal**

## 1. Identidade do sistema
- **Nome do sistema:** BalançoTotal
- **Domínio oficial:** https://balancototal.com.br
- **Tipo:** Aplicação web financeira com suporte a PWA, multiusuário por conta e cobrança recorrente.

---

## 2. Objetivo geral
Desenvolver uma **aplicação web de controle financeiro** para **lançamento, gestão e análise de recebimentos e pagamentos**, com:
- Conta única por cliente
- Subusuários
- Parcelamentos
- Unificação de lançamentos
- Auditoria completa
- Assinatura recorrente
- Dashboard analítico
- PWA instalável
- Backoffice administrativo

---

## 3. Stack tecnológica obrigatória
- **Frontend:** Next.js (App Router)
- **UI:** shadcn/ui + Tailwind CSS
- **Backend / BaaS:** Supabase
- **Banco de dados:** PostgreSQL (Supabase)
- **Autenticação:** Supabase Auth (JWT)
- **Pagamentos:** Stripe (assinaturas recorrentes)
- **E-mails:** Supabase (transacional)
- **PWA:** Service Worker + Web App Manifest

---

## 4. Autenticação e segurança

### 4.1 Cadastro
- Campos obrigatórios:
  - `username`
  - `email`
  - `password`
- Senha armazenada de forma criptografada.
- Confirmação de e-mail obrigatória para ativação da conta.

### 4.2 Login
- Login via e-mail e senha.
- Autenticação JWT.
- Sessão persistente.

---

## 5. Recuperação de senha

- A tela de login deve conter a opção **“Esqueci minha senha”**.
- O usuário deve informar:
  - `email`
  - `username`
- Fluxo:
  1. O sistema verifica internamente se o e-mail existe.
  2. Se existir, envia e-mail com link/token para redefinição de senha.
  3. Se não existir, nenhuma informação é revelada.
- Mensagem exibida ao usuário (sempre a mesma):
  > “Se os dados estiverem corretos, um e-mail para redefinição de senha foi enviado.”
- Objetivo: evitar varredura por robôs.

---

## 6. Estrutura de contas e usuários

### 6.1 Conta
- Um usuário pertence a **apenas uma conta**.
- Cada conta possui:
  - 1 usuário principal (owner)
  - N subusuários

### 6.2 Subusuários
- Convite via e-mail com token.
- Subusuários:
  - Criam lançamentos
  - Editam/excluem apenas lançamentos próprios
  - Não gerenciam usuários, categorias ou plano

---

## 7. Categorias e subcategorias

### 7.1 Categorias
- Criadas por conta.
- Categorias globais apenas como sugestão.
- Exclusão e edição afetam somente a conta.
- Exclusão física.

### 7.2 Subcategorias
- Deve ser possível criar subcategorias.
- Limite: apenas 1 nível (categoria → subcategoria).
- Subcategorias herdam o tipo da categoria.

---

## 8. Lançamentos financeiros

### 8.1 Tipos
- Pagamento (vermelho)
- Recebimento (verde)

### 8.2 Campos
- Tipo
- Descrição
- Categoria / Subcategoria
- Valor total
- Data de emissão
- Parcelamento (1x a 12x)
- Datas das parcelas

### 8.3 Parcelamento
- Valor dividido igualmente.
- Usuário pode ajustar valores manualmente.
- Parcelas:
  - Mensais
  - Registros independentes
  - Relacionadas via `lancamento_pai_id`

---

## 9. Status de parcelas
Cada parcela possui:
- Status: paga | pendente
- Data de pagamento (editável)
- Valor pago (editável)

---

## 10. Unificação de lançamentos

### 10.1 Regras
- Apenas lançamentos:
  - Do mesmo tipo
  - Pendentes
- Lançamentos pagos não podem ser unificados.

### 10.2 Categorias diferentes
- Realizar rateio proporcional por categoria.
- Preservar:
  - Categoria original
  - Valor original
  - Referência ao lançamento original

---

## 11. Dashboard
- Saldo mensal (somente parcelas pagas)
- Total de recebimentos (verde)
- Total de pagamentos (vermelho)
- Gráficos por categoria

---

## 12. Grid de lançamentos
- Cada parcela é uma linha.
- Filtros:
  - Categoria / Subcategoria
  - Usuário
  - Tipo
- Ações:
  - Editar
  - Excluir (parcela ou grupo)

---

## 13. Logs e auditoria

### 13.1 Tela de logs
Tela exclusiva para logs das ações dos usuários da conta.

### 13.2 Eventos registrados
- Login / logout
- Criação, edição e exclusão de:
  - Lançamentos
  - Parcelas
  - Categorias
  - Subcategorias
- Unificações
- Alteração de e-mail e senha
- Exclusão de conta

### 13.3 Filtros
- Usuário
- Ação
- Intervalo de datas

---

## 14. Perfil do usuário

### 14.1 Alteração de e-mail
- Requer confirmação via link enviado ao novo e-mail.

### 14.2 Alteração de senha
- Exigir senha atual.
- Validar senha atual antes da troca.

---

## 15. Exclusão de conta
- Botão vermelho:
  **“Excluir minha conta e dados”**
- Fluxo:
  1. Solicitação
  2. Envio de e-mail com link/token
  3. Exclusão apenas após confirmação
- Exclusão física e irreversível.

---

## 16. Landing Page

### 16.1 Estrutura
- Página pública
- Apresentação do BalançoTotal
- Benefícios
- Prints do sistema
- CTA para cadastro

### 16.2 Planos
Apenas um plano:
- Mensal: R$ 8,97
- Anual: R$ 79,90
- Trial: 7 dias grátis
- Cobrança recorrente no cartão

---

## 17. Assinaturas e pagamentos (Stripe)

- Assinatura recorrente
- Controle de status:
  - Trial
  - Ativa
  - Cancelada
  - Inadimplente
- Usuário só pode usar o sistema com:
  - Trial válido ou
  - Assinatura ativa

---

## 18. Backoffice / Gestor

Painel administrativo para gestão do sistema:
- Contas
- Usuários
- Status de assinatura
- Logs
- Métricas (MRR, churn, trials)

---

## 19. Segurança

- Proibido SQL com template string.
- Apenas queries parametrizadas / Supabase client / RPC.
- RLS rigoroso.
- Proteção contra enumeração de e-mails.

---

## 20. PWA
- Service Worker
- Web App Manifest
- Instalação no celular
- Modo standalone

---

## 21. Restrições finais
- Usuário pertence a apenas uma conta
- Exclusões sempre físicas
- Logs obrigatórios
- Cores obrigatórias por tipo
- Auditoria não pode ser desativada
