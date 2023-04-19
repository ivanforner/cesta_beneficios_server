export function getUploadQuery() {
    const uploadQuery = {
        name:'dbo.tbl_ex_sdr_stg_carga_beneficiarios_natal_tmp',
        
        createTableQuery:`
            begin
                declare @error_msg_1 varchar(max)
                begin try
                    if object_id('dbo.tbl_ex_sdr_stg_carga_beneficiarios_natal_tmp') is not null
                    begin
                        drop table dbo.tbl_ex_sdr_stg_carga_beneficiarios_natal_tmp
                    end
                    if object_id('dbo.tbl_ex_sdr_stg_carga_beneficiarios_natal_tmp') is null
                    begin
                        create table dbo.tbl_ex_sdr_stg_carga_beneficiarios_natal_tmp
                        (       cd_emp varchar(2)
                            ,   cd_est varchar(4)
                            ,   cd_matricula varchar(10)
                            ,   nm_funcionario varchar(80)
                            ,   cd_cracha varchar(20)
                            ,   qd_kit_crianca varchar(2)
                        )
                    end
                end try
                begin catch
                    set @error_msg_1 = substring(error_message(),1,2000)
                    raiserror(@error_msg_1,16,0)
                end catch
            end
        `,
        
        proc:`
            begin
                declare @error_msg_1 varchar(max)
                begin try
                    exec senior.usp_sdr_stg_base_benef_natal @pvar_tabela = 'dbo.tbl_ex_sdr_stg_carga_beneficiarios_natal_tmp'
                end try
                begin catch
                    set @error_msg_1 = substring(error_message(),1,2000)
                    raiserror(@error_msg_1,16,0)
                end catch
            end
        `
    }
    return uploadQuery
}