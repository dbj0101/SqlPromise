
const sql = require('./sqlExecute');

params = [];
params.push(sql.addParameter('nameContains', sql.TYPES.VarChar, 'he', false));
params.push(sql.addParameter('outVar', sql.TYPES.VarChar, 'output value', true));
sql.execStoredProcedureValue("dbdata","dbo.getRandomData", params)
//sql.execStoredProcedureDatatable("dbdata","dbo.getRandomData", params)
    .then(data => {
        console.log("SP call success", data);
    })
    .catch(err => {
        console.error(err);
    });


//select 1 as col1, 'goodbye' as col2, 'stranger' as col3
sql.execSqlDatatable("dbdata","select top 5 * from dbo.randomData")
    .then(data => {
        console.log("successful Promise", data);
    })
    .catch(err => {
        console.error(err);
    });