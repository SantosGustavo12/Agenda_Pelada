// Configuração do Supabase Client
// ⚠️ ATENÇÃO: COLOQUE AQUI SUAS CHAVES DO SUPABASE (Etapa 1)
const SUPABASE_URL = 'https://fufriufnrasxdlxotwzy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1ZnJpdWZucmFzeGRseG90d3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODczOTcsImV4cCI6MjA3NzI2MzM5N30.occ7c9FulV_PjAupCFEtVCMFTObltCMLghubW_ByS9g';

// Inicializa o cliente Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Variáveis Globais ---
let currentUser = null; // Vai guardar os dados do usuário logado

// --- Elementos do DOM (Pegando os itens do dashboard.html) ---
const userEmailEl = document.getElementById('user-email');
const btnLogout = document.getElementById('btn-logout');
const listaPartidasEl = document.getElementById('lista-partidas');
const modalPartida = document.getElementById('modal-partida');
const btnNovaPartida = document.getElementById('btn-nova-partida');
const btnCancelarModal = document.getElementById('btn-cancelar-modal');
const formPartida = document.getElementById('form-partida');
const modalTitulo = document.getElementById('modal-titulo');
const partidaIdEl = document.getElementById('partida-id');

// --- Funções Principais ---

// (READ) Busca e exibe todas as partidas no site
async function buscarPartidas() {
    // Mostra um "loading" enquanto busca
    listaPartidasEl.innerHTML = '<p class="text-gray-500 col-span-3 text-center">Carregando partidas...</p>';
    
    // Requisição assíncrona (READ)
    const { data, error } = await _supabase
        .from('partidas') // Da tabela 'partidas'
        .select('*') // Selecione tudo
        .order('data_hora', { ascending: true }); // Ordena pela data

    if (error) {
        listaPartidasEl.innerHTML = `<p class="text-red-500 col-span-3 text-center">Erro ao carregar partidas: ${error.message}</p>`;
        return;
    }

    if (data.length === 0) {
        listaPartidasEl.innerHTML = '<p class="text-gray-500 col-span-3 text-center">Nenhuma partida agendada ainda. Crie a primeira!</p>';
        return;
    }

    // Limpa a lista antes de adicionar os cards
    listaPartidasEl.innerHTML = '';
    
    // Cria os cards para cada partida (loop)
    data.forEach(partida => {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-lg shadow-md'; // Estilo do Tailwind
        
        // Formata a data para pt-BR (dd/mm/aaaa, hh:mm)
        const dataFormatada = new Date(partida.data_hora).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });

        // Formata o custo para R$
        const custoFormatado = parseFloat(partida.custo_por_pessoa || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // Verifica se o usuário logado é o criador da partida
        const ehCriador = currentUser && currentUser.id === partida.criador_id;
        
        // HTML interno do Card (ATUALIZADO COM ÍCONES)
        card.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800">${partida.local}</h3>
            
            <ul class="mt-4 space-y-2">
                <li class="flex items-center text-sm text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 text-blue-500 mr-2">
                        <path fill-rule="evenodd" d="M5.75 3a.75.75 0 0 1 .75.75V4h7V3.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V3.75A.75.75 0 0 1 5.75 3Zm-1 5.5c0-.414.336-.75.75-.75h10.5a.75.75 0 0 1 0 1.5H5.5a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H5.5Z" clip-rule="evenodd" />
                    </svg>
                    Data: ${dataFormatada}
                </li>
                
                <li class="flex items-center text-sm text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 text-yellow-600 mr-2">
                        <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM7 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM4.5 10.5a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5h-5Z" />
                        <path fill-rule="evenodd" d="M1.32 10.21a.75.75 0 0 0-1.06 1.06l3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L5.5 11.44v-1.19a.75.75 0 0 0-1.5 0v1.19L2.78 10.21Zm13.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06l-1.22 1.22v-1.19a.75.75 0 0 0-1.5 0v1.19l-1.22-1.22a.75.75 0 0 0-1.06 1.06l3.25 3.25Z" clip-rule="evenodd" />
                    </svg>
                    Vagas: ${partida.vagas_disponiveis}
                </li>

                <li class="flex items-center text-sm text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 text-green-600 mr-2">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.25-7.41a.75.75 0 1 1 1.06-1.06l-1.06 1.06Zm-1.06 1.06L10 13.71l-2.25-2.06a.75.75 0 1 1 1.06-1.06l1.19 1.09V6.25a.75.75 0 0 1 1.5 0v5.19l1.19-1.09Z" clip-rule="evenodd" />
                    </svg>
                    Custo: ${custoFormatado}
                </li>

                <li class="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 text-gray-400 mr-2">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
                    </svg>
                    ${partida.observacoes || 'Sem observações.'}
                </li>
            </ul>

            <div class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 shadow" onclick="inscreverNaPartida('${partida.id}')">
                    Inscrever-se
                </button>
                
                <div>
                    ${ehCriador ? `
                    <button class="text-yellow-600 hover:text-yellow-800 text-sm mr-2 font-medium" onclick="abrirModalParaEditar('${partida.id}', '${partida.local}', '${partida.data_hora}', ${partida.vagas_disponiveis}, ${partida.custo_por_pessoa}, '${partida.observacoes || ''}')">
                        Editar
                    </button>
                    <button class="text-red-500 hover:text-red-700 text-sm font-medium" onclick="excluirPartida('${partida.id}')">
                        Excluir
                    </button>` : ''}
                </div>
            </div>
        `;
        listaPartidasEl.appendChild(card); // Adiciona o card na lista
    });
}

// (CREATE / UPDATE) Salva (cria ou atualiza) uma partida
formPartida.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    // Pega os dados do formulário do modal
    const partidaData = {
        local: document.getElementById('partida-local').value,
        data_hora: document.getElementById('partida-data').value,
        vagas_disponiveis: parseInt(document.getElementById('partida-vagas').value),
        custo_por_pessoa: parseFloat(document.getElementById('partida-custo').value || 0),
        observacoes: document.getElementById('partida-obs').value,
    };
    
    const id = partidaIdEl.value; // Pega o ID oculto
    let error;

    if (id) { 
        // Se tem ID, é UPDATE (Atualização)
        const { error: updateError } = await _supabase
            .from('partidas')
            .update(partidaData)
            .eq('id', id); // Onde o id for igual
        error = updateError;

    } else { 
        // Se não tem ID, é CREATE (Criação)
        // Adiciona o ID do criador
        partidaData.criador_id = currentUser.id;
        
        const { error: insertError } = await _supabase
            .from('partidas')
            .insert(partidaData);
        error = insertError;
    }

    if (error) {
        alert(`Erro ao salvar: ${error.message}`);
    } else {
        fecharModalPartida();
        buscarPartidas(); // Atualiza a lista de partidas na tela
    }
});

// (DELETE) Exclui uma partida
// (Precisa ser 'window.excluirPartida' para ser acessível pelo 'onclick' do HTML)
window.excluirPartida = async (id) => {
    // Pede confirmação
    if (!confirm('Tem certeza que deseja excluir esta partida?')) return;

    // Requisição assíncrona (DELETE)
    const { error } = await _supabase
        .from('partidas')
        .delete()
        .eq('id', id); // Onde o id for igual

    if (error) {
        alert(`Erro ao excluir: ${error.message}`);
    } else {
        buscarPartidas(); // Atualiza a lista
    }
}

// (CRUD da Tabela 2) Inscreve usuário na partida
// (Precisa ser 'window.inscreverNaPartida' para ser acessível pelo 'onclick')
window.inscreverNaPartida = async (partidaId) => {
    if (!currentUser) {
        alert('Você precisa estar logado para se inscrever.');
        return;
    }

    // Requisição assíncrona (CREATE na tabela 'inscricoes')
    const { error } = await _supabase
        .from('inscricoes')
        .insert({
            partida_id: partidaId,
            usuario_id: currentUser.id
        });
    
    if (error) {
        if (error.code === '23505') { // Código de erro do Postgres (violação de unique)
            alert('Você já está inscrito nesta partida!');
        } else {
            alert(`Erro ao se inscrever: ${error.message}`);
        }
    } else {
        alert('Inscrição realizada com sucesso!');
        // Idealmente, você atualizaria a contagem de vagas, mas vamos manter simples.
    }
}

// --- Funções do Modal (UI/UX) ---

// Abre o modal para CRIAR uma nova partida
function abrirModalParaCriar() {
    modalTitulo.innerHTML = '<span class="font-display">Criar Nova Partida</span>';
    formPartida.reset(); // Limpa o formulário
    partidaIdEl.value = ''; // Garante que não tem ID
    modalPartida.classList.remove('hidden'); // Mostra o modal
}

// Abre o modal para EDITAR uma partida existente
// (Precisa ser 'window.abrirModalParaEditar' para ser acessível pelo 'onclick')
window.abrirModalParaEditar = (id, local, data, vagas, custo, obs) => {
    modalTitulo.innerHTML = '<span class="font-display">Editar Partida</span>';
    
    // Preenche o formulário com os dados da partida
    partidaIdEl.value = id; // Seta o ID oculto
    document.getElementById('partida-local').value = local;
    // Ajusta o formato da data para o input datetime-local (YYYY-MM-DDThh:mm)
    document.getElementById('partida-data').value = new Date(data).toISOString().slice(0, 16);
    document.getElementById('partida-vagas').value = vagas;
    document.getElementById('partida-custo').value = custo;
    document.getElementById('partida-obs').value = (obs === 'null' ? '' : obs); // Trata o "null" como string
    
    modalPartida.classList.remove('hidden'); // Mostra o modal
}

// Fecha o modal
function fecharModalPartida() {
    modalPartida.classList.add('hidden');
}

// --- Event Listeners (Ouvintes de Ação) ---
btnNovaPartida.addEventListener('click', abrirModalParaCriar);
btnCancelarModal.addEventListener('click', fecharModalPartida);

// Logout
btnLogout.addEventListener('click', async () => {
    await _supabase.auth.signOut();
    // Redireciona de volta para a tela de login
    window.location.href = 'index.html';
});

// --- Função de Inicialização (Roda quando a página carrega) ---
async function init() {
    // Verifica se o usuário está logado (pega a sessão)
    const { data: { session } } = await _supabase.auth.getSession();

    if (!session) {
        // Se não estiver logado, chuta ele de volta pra index.html
        window.location.href = 'index.html';
        return;
    }
    
    // Se está logado:
    currentUser = session.user; // Guarda os dados do usuário
    userEmailEl.innerText = currentUser.email; // Mostra o email no topo
    
    // Chama o READ inicial (Busca as partidas)
    buscarPartidas();
}

// Inicia o app
init();