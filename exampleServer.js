const express = require("express");
const cors = require("cors");
const sql = require("./sqlExecute");

const API_PORT = process.env.PORT || 5001;
const app = express();

app.use(cors());

app.get("/getRandomData", (req, res) => {
  console.log("getRandomData API called");
  params = [];
  params.push(sql.addParameter("nameContains", sql.TYPES.VarChar, "he", false));
  params.push(
    sql.addParameter("outVar", sql.TYPES.VarChar, "output value", true)
  );
  sql
    .execStoredProcedureValue("dbdata", "dbo.getRandomData", params)
    //sql.execStoredProcedureDatatable("dbdata","dbo.getRandomData", params)
    .then((data) => {
      console.log("SP call success", data);
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    });

  //res.send({ result: "Hello Dolly" });
});

app.get("/top5rando", (req, res) => {
  console.log("Top 5 Rando called");
  sql
    .execSqlDatatable("dbdata", "select top 5 * from dbo.randomData")
    .then((data) => {
      console.log("Rando Successful", data);
      res.send(data);
    })
    .catch((err) => {
      console.error("Top5Rando Error", err);
    });
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
