const connectionInfo = require("./connectionInfo");

//exported variables
const TYPES = require('tedious').TYPES; 

//local function to parse the requested connection string
function getConnectionConfig(connectionData) {
    return {
        server: connectionData.server,
        authentication: {
            type: "default",
            options: {
                userName: connectionData.username,
                password: connectionData.pwd
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            port: connectionData.port,
            encrypt: connectionData.encrypt,
            database: connectionData.database 
        }
    };
}

//public function
//returns Datatable result set in object format
const execSqlDatatable = (connectionName, sqlQuery) => new Promise( (resolve, reject) => {
    //Build the database connection from environment file (.env)
    const connectionString = connectionInfo.getConnection(connectionName);
    const databaseConnection = require("tedious").Connection;
    const config = getConnectionConfig(connectionString);

    //prep main variables
    let result = [];
    let dbConn = new databaseConnection(config);
    let Request = require('tedious').Request;  

    dbConn.connect((err) => {
        if(err) {
            console.log('Connection failed');
            throw err;
        }
        executeStatement();
    });

    function executeStatement() {  
        const req = new Request(sqlQuery, err => {
            if(err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
        req.on('row', (columns) => {
            let item = {};
            columns.forEach((column, index) => {  
                item[column.metadata.colName] = column.value;
            });  
            result.push(item);
        });

        // req.on('done', function(rowCount, more) {  
        //     console.log('done: ' + rowCount + ' rows returned');  
        // });  
        
        // Close the connection after the final event emitted by the request, after the callback passes
        req.on("requestCompleted", () => {
            dbConn.close();
        });
        dbConn.execSql(req);
    }
});

//public function
//returns Datatable result set in object format
const execStoredProcedureDatatable = (connectionName, storedProc, params) => new Promise( (resolve, reject) => {
    //Build the database connection from environment file (.env)
    const connectionString = connectionInfo.getConnection(connectionName);
    const databaseConnection = require("tedious").Connection;
    const config = getConnectionConfig(connectionString);

    //prep main variables
    let result = [];
    let dbConn = new databaseConnection(config);
    let Request = require('tedious').Request;  

    dbConn.connect((err) => {
        if(err) {
            console.log('Connection failed');
            throw err;
        }
        executeStoredProcStatement();
    });

    function executeStoredProcStatement() {  
        const req = new Request(storedProc, err => {
            if(err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
        req.on('row', (columns) => {
            let item = {};
            columns.forEach((column, index) => {  
                item[column.metadata.colName] = column.value;
            });  
            result.push(item);
        });

        // req.on('returnValue', (paramName, value, metadata) => {
        //     console.log('returnValue', paramName + ' : ' + value);
        // });
        
        // Close the connection after the final event emitted by the request, after the callback passes
        req.on("requestCompleted", () => {
            dbConn.close();
        });

        //add parameters if needed
        for(param of params) {
            !param.isOutput ? req.addParameter(param.name, param.type, param.value) : req.addOutputParameter(param.name, param.type);
        }

        //execute the stored procedure
        dbConn.callProcedure(req);
    }
});

//public function
//returns Datatable result set in object format
const execStoredProcedureValue = (connectionName, storedProc, params) => new Promise( (resolve, reject) => {
    //Build the database connection from environment file (.env)
    const connectionString = connectionInfo.getConnection(connectionName);
    const databaseConnection = require("tedious").Connection;
    const config = getConnectionConfig(connectionString);

    //prep main variables
    let result = {};
    let dbConn = new databaseConnection(config);
    let Request = require('tedious').Request;  

    dbConn.connect((err) => {
        if(err) {
            console.log('Connection failed');
            throw err;
        }
        executeStoredProcStatement();
    });

    function executeStoredProcStatement() {  
        const req = new Request(storedProc, err => {
            if(err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });

        req.on('returnValue', (paramName, value, metadata) => {
            //console.log('returnValue', paramName + ' : ' + value);
            result["paramName"] = paramName;
            result["value"] = value;
            //result["metadata"] = metadata;
        })
        
        // Close the connection after the final event emitted by the request, after the callback passes
        req.on("requestCompleted", () => {
            dbConn.close();
        });

        //add parameters if needed
        for(param of params) {
            !param.isOutput ? req.addParameter(param.name, param.type, param.value) : req.addOutputParameter(param.name, param.type);
        }

        //execute the stored procedure
        dbConn.callProcedure(req);
    }
});

//public function
//adds a parameter to a list and returns the new list
function addParameterList(paramList, name, type, value, isOutput) {
    if(!paramList) {
        paramList = [];
    }
    param = {};
    param.name = name;
    param.type = type;
    param.value = value;
    param.isOutput = isOutput;
    paramList.push(param)
    return paramList
}

//public function
//returns a parameter for user
function addParameter(name, type, value, isOutput) {
    param = {};
    param.name = name;
    param.type = type;
    param.value = value;
    param.isOutput = isOutput;
    return param;
}


module.exports = { TYPES, addParameterList, addParameter, execSqlDatatable, execStoredProcedureDatatable, execStoredProcedureValue };

