alert('JavaScript carregou!');

let currentPage = 1;
const itemsPerPage = 10;

async function fetchUsers(page) {
    try {
        const offset = (page - 1) * itemsPerPage;
        console.log(`Fazendo requisição: /api/users?offset=${offset}&limit=${itemsPerPage}`);
        const response = await fetch(`/api/users?offset=${offset}&limit=${itemsPerPage}`);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Dados recebidos:', data);
        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        return { users: [], total: 0 };
    }
}

function renderUsers(users) {
    console.log('Renderizando usuários:', users);
    const usersContainer = document.getElementById('users');
    if (!usersContainer) {
        console.error('Elemento #users não encontrado!');
        return;
    }
    
    usersContainer.innerHTML = '';
    
    if (!users || users.length === 0) {
        usersContainer.innerHTML = '<p>Nenhum usuário encontrado</p>';
        return;
    }
    
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'card mb-2';
        userDiv.innerHTML = `
            <div class="card-body">
                <h6 class="card-title">${user.nome || 'Nome não disponível'}</h6>
                <p class="card-text">${user.email || 'Email não disponível'}</p>
            </div>
        `;
        usersContainer.appendChild(userDiv);
    });
}

function renderPagination(totalPages) {
    console.log('Renderizando paginação, total de páginas:', totalPages);
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        console.error('Elemento #pagination não encontrado!');
        return;
    }
    
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        
        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = i;
        a.onclick = (e) => {
            e.preventDefault();
            console.log('Clicou na página:', i);
            loadPage(i);
        };
        
        li.appendChild(a);
        paginationContainer.appendChild(li);
    }
}

async function loadPage(page) {
    console.log('Carregando página:', page);
    currentPage = page;
    const data = await fetchUsers(page);
    renderUsers(data.users);
    renderPagination(Math.ceil(data.total / itemsPerPage));
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log('DOM carregado, iniciando aplicação...');
    await loadPage(1);
});