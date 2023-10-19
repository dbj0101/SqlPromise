require('dotenv').config();

// const connMap = new Map();
// for(conn of JSON.parse(process.env.CONNECTION_STRINGS)) {
//     connMap.set(conn.name, conn);
// }
// console.log(connMap.get('doesnotexist'));
// console.log(connMap.get('RattleDB'));

function getConnectionMap() {
    const connMap = new Map();
    for(conn of JSON.parse(process.env.CONNECTION_STRINGS)) {
        connMap.set(conn.name, conn);
    }
    return connMap;
}

function getConnection(connName) {
    return getConnectionMap().get(connName);
}

//console.log(getConnection('RattleDB'));

module.exports = { getConnectionMap, getConnection };




