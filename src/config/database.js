// ============================================================
// CONFIGURAÇÃO DO BANCO DE DADOS PostgreSQL COM DOTENV
// ============================================================

// Importar dotenv e carregar variáveis do arquivo .env
require('dotenv').config();

// Importar o Pool do PostgreSQL
const { Pool } = require('pg');

// ============================================================
// CONFIGURAR O POOL DE CONEXÕES
// Agora usando variáveis de ambiente do arquivo .env
// ============================================================

const pool = new Pool({
  // process.env.NOME_VARIAVEL busca no arquivo .env
  user: process.env.DB_USER,           // Lê DB_USER do .env
  host: process.env.DB_HOST,           // Lê DB_HOST do .env
  database: process.env.DB_NAME,       // Lê DB_NAME do .env
  password: process.env.DB_PASSWORD,   // Lê DB_PASSWORD do .env
  port: parseInt(process.env.DB_PORT), // Lê DB_PORT e converte para número
});

// ============================================================
// TESTAR CONEXÃO
// ============================================================

pool.connect((erro, client, release) => {
  if (erro) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', erro.message);
    console.error('💡 Verifique suas credenciais no arquivo .env');
  } else {
    console.log('✅ Conectado ao PostgreSQL!');
    console.log(`📊 Banco: ${process.env.DB_NAME}`);
    console.log(`🏠 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    release();  // Devolver a conexão ao pool
  }
});

// ============================================================
// CRIAR TABELA AUTOMATICAMENTE
// ============================================================

const criarTabela = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS clientes (
      id        SERIAL PRIMARY KEY,
      nome      VARCHAR(255) NOT NULL,
      email     VARCHAR(255) NOT NULL,
      telefone  VARCHAR(50)  NOT NULL,
      cpf       VARCHAR(20)  NOT NULL
    )
  `;

  try {
    await pool.query(sql);
    await pool.query(`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL DEFAULT ''`);
    await pool.query(`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS telefone VARCHAR(50) NOT NULL DEFAULT ''`);
    await pool.query(`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS cpf VARCHAR(20) NOT NULL DEFAULT ''`);
    await pool.query(`ALTER TABLE clientes DROP COLUMN IF EXISTS preco`);
    await pool.query(`ALTER TABLE clientes DROP COLUMN IF EXISTS estoque`);
    await pool.query(`ALTER TABLE clientes DROP COLUMN IF EXISTS categoria`);
    console.log('✅ Tabela clientes verificada/criada e colunas sincronizadas');
  } catch (erro) {
    console.error('❌ Erro ao criar tabela:', erro.message);
  }
};

criarTabela();

// ============================================================
// EXPORTAR O POOL
// ============================================================

module.exports = pool;
