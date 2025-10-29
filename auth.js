// Configuração do Supabase Client
const SUPABASE_URL = 'https://fufriufnrasxdlxotwzy.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1ZnJpdWZucmFzeGRseG90d3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODczOTcsImV4cCI6MjA3NzI2MzM5N30.occ7c9FulV_PjAupCFEtVCMFTObltCMLghubW_ByS9g';

// -------------------------------------------------------------------
// NÃO MUDE NADA DAQUI PARA BAIXO NESTE ARQUIVO
// -------------------------------------------------------------------

// Inicializa o cliente Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Elementos do DOM (Pegando os itens do index.html) ---
const formLogin = document.getElementById('form-login');
const formCadastro = document.getElementById('form-cadastro');
const linkCadastro = document.getElementById('link-cadastro');
const linkLogin = document.getElementById('link-login');
const alerta = document.getElementById('alerta');

// --- Alternar entre formulários (UI/UX) ---
linkCadastro.addEventListener('click', (e) => {
    e.preventDefault(); // Impede o link de recarregar a página
    formLogin.classList.add('hidden'); // Esconde o form de login
    formCadastro.classList.remove('hidden'); // Mostra o form de cadastro
    alerta.innerText = ''; // Limpa mensagens de erro
});

linkLogin.addEventListener('click', (e) => {
    e.preventDefault(); // Impede o link de recarregar a página
    formLogin.classList.remove('hidden'); // Mostra o form de login
    formCadastro.classList.add('hidden'); // Esconde o form de cadastro
    alerta.innerText = ''; // Limpa mensagens de erro
});

// --- Evento de Login ---
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o formulário de recarregar a página
    alerta.innerText = 'Entrando...'; // Feedback para o usuário
    
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    // Requisição assíncrona (API REST do Supabase)
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: senha,
    });

    if (error) {
        // Se der erro, mostra no alerta
        alerta.innerText = `Erro: ${error.message}`;
    } else {
        // Se der certo, redireciona para o dashboard
        window.location.href = 'dashboard.html';
    }
});

// --- Evento de Cadastro ---
formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o formulário de recarregar a página
    alerta.innerText = 'Criando conta...'; // Feedback para o usuário
    
    const email = document.getElementById('cadastro-email').value;
    const senha = document.getElementById('cadastro-senha').value;

    // Requisição assíncrona (API REST do Supabase)
    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: senha,
    });

    if (error) {
        // Se der erro, mostra no alerta
        alerta.innerText = `Erro: ${error.message}`;
    } else {
        // Se der certo, avisa o usuário para fazer login
        alerta.innerText = 'Conta criada com sucesso! Faça o login para continuar.';
        // Força a troca para o formulário de login
        formLogin.classList.remove('hidden');
        formCadastro.classList.add('hidden');
    }
});