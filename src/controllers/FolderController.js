import fs from 'fs';

import extractionFolders from '../config/extractionFolders.js';


class FolderController {
    static createFolders() {
        this.createFoldersByConfig('./extractions', extractionFolders);
        
        setInterval(() => {
            this.createFoldersByConfig('./extractions', extractionFolders);
        }, 10000);
    }

    static createRootFolders() {
        const rootFiles = fs.readdirSync('./');
        if (!rootFiles.includes('extractions')) {
            fs.mkdirSync('./extractions');
        }
    }

    static createFoldersByConfig(path, config) {
        this.createRootFolders();

        const dirFolders = fs.readdirSync(path);
        const configFolders = Object.values(config);
        
        for (let dir of configFolders) {
            const index = dir.indexOf('/');
            const tempDir = dir.substring(index).replaceAll('/', '');
            if (!dirFolders.includes(tempDir)) {
                fs.mkdirSync(`./${dir}`);
            }
        }
    }
}

export default FolderController;