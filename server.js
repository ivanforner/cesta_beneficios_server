import app from "./src/app.js";

import FolderController from "./src/controllers/FolderController.js";


const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// FUNÇÃO PARA CRIAR PASTAS PADRÃO PARA GUARDAR ARQUIVOS
FolderController.createFolders();