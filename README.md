Desenvolvimento de um Fronted para consumo de Backend Supabase.

Projeto criado por:
Guilherme Henrique Camargo
Gustavo Ferreira Santos
João Vitor Soares Almeida

Comando SQL rodado no SUPABASE:
CREATE TABLE partidas (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  local TEXT NOT NULL,                         -- Atributo 1
  data_hora TIMESTAMPTZ NOT NULL,            -- Atributo 2
  vagas_disponiveis INT NOT NULL,            -- Atributo 3
  custo_por_pessoa DECIMAL(10, 2) DEFAULT 0.00, -- Atributo 4
  observacoes TEXT,                           -- Atributo 5
  
  criador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE inscricoes (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  partida_id BIGINT REFERENCES public.partidas(id) ON DELETE CASCADE,
  
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  UNIQUE(partida_id, usuario_id)
);
