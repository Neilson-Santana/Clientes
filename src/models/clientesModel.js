// Importar o pool de conexões do PostgreSQL
const pool = require('../config/database');

// ============================================================
// FUNÇÃO: listarTodos
// DESCRIÇÃO: Retorna todos os clientes do banco
// ============================================================
async function listarTodos() {
  const result = await pool.query(
    'SELECT * FROM clientes ORDER BY id'
  );
  return result.rows;
}

// ============================================================
// FUNÇÃO: buscarPorId
// DESCRIÇÃO: Busca um cliente específico
// ============================================================
async function buscarPorId(id) {
  const result = await pool.query(
    'SELECT * FROM clientes WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

// ============================================================
// FUNÇÃO: criar
// DESCRIÇÃO: Insere um novo cliente no banco
// ============================================================
async function criar(dados) {
  const { nome, email, telefone, cpf } = dados;
  
  const sql = `
    INSERT INTO clientes (nome, email, telefone, cpf)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  const result = await pool.query(
    sql,
    [nome, email, telefone, cpf]
  );
  
  return result.rows[0];
}

// ============================================================
// FUNÇÃO: atualizar
// DESCRIÇÃO: Atualiza todos os dados de um cliente
// ============================================================
async function atualizar(id, dados) {
  const { nome, email, telefone, cpf } = dados;
  
  const sql = `
    UPDATE clientes
    SET nome = $1, email = $2, telefone = $3, cpf = $4
    WHERE id = $5
    RETURNING *
  `;
  
  const result = await pool.query(
    sql,
    [nome, email, telefone, cpf, id]
  );
  
  return result.rows[0] || null;
}

// ============================================================
// FUNÇÃO: deletar
// DESCRIÇÃO: Remove um cliente do banco
// ============================================================
async function deletar(id) {
  const result = await pool.query(
    'DELETE FROM clientes WHERE id = $1',
    [id]
  );
  
  return result.rowCount > 0;
}

// ============================================================
// FUNÇÃO: buscarPorNome
// DESCRIÇÃO: Filtra clientes por nome
// ============================================================
async function buscarPorNome(nome) {
  const sql = 'SELECT * FROM clientes WHERE nome ILIKE $1';
  
  const result = await pool.query(
    sql,
    [`%${nome}%`]
  );
  
  return result.rows;
}

// ============================================================
// EXPORTAR TODAS AS FUNÇÕES
// ============================================================
module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorNome
};