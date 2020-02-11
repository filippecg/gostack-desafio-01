const express = require('express');

const app = express();

app.use(express.json());

const projects = [];
let contador = 0;

function contabilizaRequisicao(req, res, next) {
    contador++;
    console.log('Número de requisições: ' + contador);

    return next();
}

app.use(contabilizaRequisicao);

function verificaExistenciaProjeto(req, res, next) {
    const { id } = req.params;

    buscaProjeto = projects.find(projeto => projeto.id == id);
    if(!buscaProjeto) {
        return res.status(400).json({"erro": "Código de projeto não localizado!"});
    }

    return next();
}

app.get('/projects', (req, res) => {
    return res.json(projects);
});

app.post('/projects', (req, res) => {
    const { id, title } = req.body;
    const novoProjeto = {
        id, 
        title,
        tasks: []
    };

    projects.push(novoProjeto);

    return res.json(projects);
});

app.put('/projects/:id', verificaExistenciaProjeto, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const projetoAlterado = projects.find(projeto => projeto.id == id);
    projetoAlterado.title = title;

    return res.json(projects);
});

app.delete('/projects/:id', verificaExistenciaProjeto, (req, res) => {
    const { id } = req.params;

    const projetoExcluido = projects.findIndex(projeto => projeto.id == id);
    projects.splice(projetoExcluido, 1);

    return res.json({"message": "excluído com sucesso"});
});

app.post('/projects/:id/tasks', verificaExistenciaProjeto, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const projetoAlterado = projects.find(projeto => projeto.id == id);
    projetoAlterado.tasks.push(title);

    return res.json(projects);
});

app.listen(3000);