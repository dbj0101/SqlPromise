
const sql = require('./sqlExecute');

params = [];
params.push(sql.addParameter('PARAM_NAME', sql.TYPES.VarChar, 'VALUE', false));
params.push(sql.addParameter('OUT_PARAM_NAME', sql.TYPES.VarChar, '', true));
sql.execStoredProcedureValue("DATABASE_NAME","STORED_PROCEDURE", params)
    .then(data => {
        console.log("SP call success", data);
    })
    .catch(err => {
        console.error(err);
    });


//select 1 as col1, 'goodbye' as col2, 'stranger' as col3
sql.execSqlDatatable("DATABASE_NAME","select top 5 * from dbo.randomData")
    .then(data => {
        console.log("successful Promise", data);
    })
    .catch(err => {
        console.error(err);
    });
