const apiBase = '/clientes';
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const refreshButton = document.getElementById('refreshButton');
const clienteTable = document.getElementById('clienteTable');
const message = document.getElementById('message');
const clienteForm = document.getElementById('clienteForm');
const clearButton = document.getElementById('clearButton');
const logoutButton = document.getElementById('logoutButton');

function getToken() {
  return localStorage.getItem('jwtToken');
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => {
    message.textContent = '';
  }, 3000);
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

function redirectToLogin() {
  localStorage.removeItem('jwtToken');
  window.location.href = '/';
}

async function fetchJson(url, options = {}) {
  const token = getToken();
  if (!token) {
    redirectToLogin();
    return null;
  }

  const response = await fetch(url, options);
  if (response.status === 401) {
    redirectToLogin();
    return null;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.mensagem || 'Erro na requisição');
  }

  return response.json();
}

async function loadClientes() {
  const clientes = await fetchJson(apiBase, { headers: getAuthHeaders() });
  if (clientes) {
    renderTable(clientes);
  }
}

function renderTable(clientes) {
  clienteTable.innerHTML = '';

  if (!clientes || clientes.length === 0) {
    clienteTable.innerHTML = '<tr><td colspan="6">Nenhum cliente encontrado.</td></tr>';
    return;
  }

  clientes.forEach(cliente => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${cliente.id}</td>
      <td>${cliente.nome}</td>
      <td>${cliente.email}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.cpf}</td>
      <td>
        <button class="edit-button" data-id="${cliente.id}">Editar</button>
        <button class="delete-button" data-id="${cliente.id}">Excluir</button>
      </td>
    `;

    clienteTable.appendChild(tr);
  });
}

function fillForm(cliente) {
  document.getElementById('clienteId').value = cliente.id || '';
  document.getElementById('nome').value = cliente.nome || '';
  document.getElementById('email').value = cliente.email || '';
  document.getElementById('telefone').value = cliente.telefone || '';
  document.getElementById('cpf').value = cliente.cpf || '';
}

function clearForm() {
  fillForm({});
}

async function handleSearch() {
  const term = searchInput.value.trim();
  if (!term) {
    await loadClientes();
    return;
  }

  const clientes = await fetchJson(`${apiBase}/buscar/nome/${encodeURIComponent(term)}`, {
    headers: getAuthHeaders()
  });
  if (clientes) {
    renderTable(clientes);
  }
}

async function handleSave(event) {
  event.preventDefault();

  const id = document.getElementById('clienteId').value;
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const cpf = document.getElementById('cpf').value.trim();

  if (!nome || !email || !telefone || !cpf) {
    showMessage('Preencha todos os campos corretamente.');
    return;
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiBase}/${id}` : apiBase;

  try {
    await fetchJson(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({ nome, email, telefone, cpf })
    });

    clearForm();
    await loadClientes();
    showMessage(id ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!');
  } catch (error) {
    showMessage(error.message);
  }
}

async function handleTableClick(event) {
  const target = event.target;
  if (target.matches('.edit-button')) {
    const clienteId = target.dataset.id;
    await loadCliente(clienteId);
  }

  if (target.matches('.delete-button')) {
    const clienteId = target.dataset.id;
    await deleteCliente(clienteId);
  }
}

async function loadCliente(id) {
  const cliente = await fetchJson(`${apiBase}/${id}`, {
    headers: getAuthHeaders()
  });
  const clienteData = Array.isArray(cliente) ? cliente[0] : cliente;
  if (clienteData) {
    fillForm(clienteData);
  }
}

async function deleteCliente(id) {
  if (!confirm('Deseja realmente excluir este cliente?')) {
    return;
  }

  try {
    await fetchJson(`${apiBase}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    await loadClientes();
    showMessage('Cliente excluído com sucesso!');
  } catch (error) {
    showMessage(error.message);
  }
}

logoutButton.addEventListener('click', redirectToLogin);
searchButton.addEventListener('click', handleSearch);
refreshButton.addEventListener('click', loadClientes);
clienteForm.addEventListener('submit', handleSave);
clearButton.addEventListener('click', clearForm);
clienteTable.addEventListener('click', handleTableClick);

// Carregar clientes na inicialização
loadClientes();