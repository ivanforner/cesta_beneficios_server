function getColumns() {
    const columns = [
        {columnName: 'emp', dbColumnName: 'cd_emp', dbSize: 2},
        {columnName: 'est', dbColumnName: 'cd_est', dbSize: 4},
        {columnName: 'matrícula', dbColumnName: 'cd_matricula', dbSize: 10},
        {columnName: 'nome', dbColumnName: 'nm_funcionario', dbSize: 80},
        {columnName: 'numero do cracha', dbColumnName: 'cd_cracha', dbSize: 20},
        {columnName: 'kit criança', dbColumnName: 'qd_kit_crianca', dbSize: 2}
    ];
    return columns
}

export default getColumns;