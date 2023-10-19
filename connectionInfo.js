require('dotenv').config();

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

module.exports = { getConnectionMap, getConnection };




