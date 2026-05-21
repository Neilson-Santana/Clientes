// Importar o Express para criar o router
const express = require('express');
const router = express.Router();

// Importar as funções do Controller
const ClientesController = require('../controllers/clientesController');

// ============================================================
// DEFINIÇÃO DAS ROTAS
// ============================================================

// GET /clientes - Listar todos os clientes
router.get('/', ClientesController.listarTodos);

// GET /clientes/buscar/nome/:nome - Buscar por nome
router.get('/buscar/nome/:nome', ClientesController.buscarPorNome);

// GET /clientes/buscar/id/:id - Buscar cliente específico por ID
router.get('/buscar/id/:id', ClientesController.buscarPorId);

// GET /clientes/:id - Buscar cliente específico por ID (rota RESTful)
router.get('/:id', ClientesController.buscarPorId);

// POST /clientes - Criar novo cliente
router.post('/', ClientesController.criar);

// PUT /clientes/:id - Atualizar cliente completo
router.put('/:id', ClientesController.atualizar);

// DELETE /clientes/:id - Deletar cliente
router.delete('/:id', ClientesController.deletar);

// ============================================================
// EXPORTAR O ROUTER
// ============================================================
module.exports = router;