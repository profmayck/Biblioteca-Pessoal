document.addEventListener("DOMContentLoaded", function() {
    carregarEditoras();

    const editoraForm = document.getElementById("editoraForm");
    editoraForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const editoraId = editoraForm.getAttribute('data-editora-id');
        if (editoraId) {
            atualizarEditora(editoraId);
        } else {
            adicionarEditora();
        }
    });
});

function carregarEditoras() {
    fetch("/api/editoras")
        .then(response => response.json())
        .then(editoras => {
            const lista = document.getElementById("list");
            lista.innerHTML = ''; // Limpa a lista antes de carregar
            editoras.forEach(editora => {
                const li = document.createElement("li");
                li.textContent = `${editora.nome} - ${editora.endereco || ''} - ${editora.telefone || ''} `;

                const editBtn = document.createElement("button");
                editBtn.textContent = "Editar";
                editBtn.onclick = () => preencherFormularioEditora(editora);
                
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Excluir";
                deleteBtn.onclick = () => excluirEditora(editora.id);

                li.appendChild(editBtn);
                li.appendChild(deleteBtn);

                lista.appendChild(li);
            });
        })
        .catch(error => console.error("Erro ao carregar editoras:", error));
}

function adicionarEditora() {
    const nome = document.getElementById("nome").value;
    const endereco = document.getElementById("endereco").value;
    const telefone = document.getElementById("telefone").value;

    fetch("/api/editoras", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, endereco, telefone })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar editora');
        }
        return response.json();
    })
    .then(data => {
        carregarEditoras(); // Recarrega a lista após adicionar
    })
    .catch(error => {
        console.error("Erro ao adicionar editora:", error);
    });
}



function preencherFormularioEditora(editora) {
    document.getElementById("nome").value = editora.nome;
    document.getElementById("endereco").value = editora.endereco;
    document.getElementById("telefone").value = editora.telefone;
    document.getElementById("editoraForm").setAttribute('data-editora-id', editora.id);
}

function atualizarEditora(id) {
    const nome = document.getElementById("nome").value;
    const endereco = document.getElementById("endereco").value;
    const telefone = document.getElementById("telefone").value;

    fetch(`/api/editoras/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, endereco, telefone })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar editora');
        }
        return response.json();
    })
    .then(data => {
        limparFormulario();
        carregarEditoras(); // Recarrega a lista após atualizar
    })
    .catch(error => {
        console.error("Erro ao atualizar editora:", error);
    });
}

function excluirEditora(id) {
    fetch(`/api/editoras/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir editora');
        }
        carregarEditoras(); // Recarrega a lista após excluir
    })
    .catch(error => {
        console.error("Erro ao excluir editora:", error);
    });
}

function limparFormulario() {
    document.getElementById("nome").value = '';
    document.getElementById("endereco").value = '';
    document.getElementById("telefone").value = '';
    document.getElementById("editoraForm").removeAttribute('data-editora-id');
}

