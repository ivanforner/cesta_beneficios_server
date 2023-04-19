const dbConfig = {
    server: "BRAMPWSSQL039",
    authentication: {
        type: "default",
        options: {
            userName: "senior",
            password: "acesso123",
            requestTimeout: 180000
        }
    },
    options: {
        encrypt: true,
        database: "Senior",
        trustServerCertificate: true,
        rowCollectionOnRequestCompletion: true
    }
}

export default dbConfig;