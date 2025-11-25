# ⚽ Agenda Pelada - Frontend com Supabase

Projeto desenvolvido para a disciplina de Desenvolvimento Web da Fatec Itu. O objetivo é criar um sistema de gerenciamento de partidas de futebol amador ("peladas") utilizando Frontend estático consumindo uma API Backend (BaaS).

## 🔗 Link do Projeto (Demo)
Acesse o projeto online aqui:
**(https://santosgustavo12.github.io/Agenda_Pelada/)**

---

## 🔑 Acesso para Testes
Utilize as credenciais abaixo para acessar o sistema sem precisar criar uma conta:
- Login: gustavosantos.itu@gmail.com
- Senha: Teste123#

---

## 🛠️ Tecnologias Utilizadas
- **HTML5 & CSS3:** Estrutura e estilização.
- **JavaScript (ES6+):** Lógica do frontend e conexão assíncrona.
- **Tailwind CSS:** Framework para estilização responsiva e ágil.
- **Supabase:** Backend as a Service (Auth, Database e API Realtime).

## ⚙️ Funcionalidades (CRUD)
O sistema permite:
1.  **Autenticação:** Cadastro e Login de usuários (Supabase Auth).
2.  **Create (Criar):** Usuários logados podem agendar novas partidas.
3.  **Read (Ler):** Listagem de todas as partidas agendadas no painel.
4.  **Update (Atualizar):** O criador da partida pode editar detalhes (local, hora, etc).
5.  **Delete (Excluir):** O criador pode cancelar (excluir) a partida.
6.  **Inscrição:** Usuários podem se inscrever nas partidas de outros jogadores.

---

## 🗄️ Estrutura do Banco de Dados (SQL)

Abaixo está o código SQL utilizado para criar as tabelas no Supabase:

```sql
-- Tabela 1: Partidas
CREATE TABLE partidas (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  local TEXT NOT NULL,
  data_hora TIMESTAMPTZ NOT NULL,
  vagas_disponiveis INT NOT NULL,
  custo_por_pessoa DECIMAL(10, 2) DEFAULT 0.00,
  observacoes TEXT,
  criador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Tabela 2: Inscrições
CREATE TABLE inscricoes (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  partida_id BIGINT REFERENCES public.partidas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(partida_id, usuario_id)
);

-- Políticas de Segurança (RLS)
ALTER TABLE partidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

-- Exemplo de política (Leitura pública)
CREATE POLICY "Permitir leitura pública" ON partidas FOR SELECT USING (true);

**Nome dos Integrantes:**
- Guilherme Henrique Camargo da Silva
- Gustavo Ferreira dos Santos
- João Vitor Soares Almeida
