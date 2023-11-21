const pool = require('../config/database');

async function listarLivros() {
    const [results] = await pool.query(`SELECT L.*, A.nome as autor, E.nome editora
    FROM Livros L
    INNER JOIN Autores A ON A.id = L.id_autor
    LEFT JOIN Editoras E ON E.id = L.id_editora`);
    return results;
}

async function adicionarLivro(livro) {
    const { titulo, autor, dataPublicacao } = livro;
    const [results] = await pool.query('INSERT INTO Livros (titulo, autor, dataPublicacao) VALUES (?, ?, ?)', [titulo, autor, dataPublicacao]);
    return results.insertId;
}

async function atualizarLivro(id, livro) {
    const { titulo, autor, dataPublicacao } = livro;
    await pool.query('UPDATE Livros SET titulo = ?, autor = ?, dataPublicacao = ? WHERE id = ?', [titulo, autor, dataPublicacao, id]);
}

async function deletarLivro(id) {
    await pool.query('DELETE FROM Livros WHERE id = ?', [id]);
}

module.exports = {
    listarLivros,
    adicionarLivro,
    atualizarLivro,
    deletarLivro
};