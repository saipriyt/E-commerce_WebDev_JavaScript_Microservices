const mysql = require('mysql');
var connection = mysql.createConnection({
    host:"ediss-a1-databasereplicainstance-bfzlp1io00ft.ckavf4fbcedi.us-east-1.rds.amazonaws.com",
    user: "user",
    password:"password",
    database: "crud"
});

connection.connect((err)=>{
    if(!err)
    {
        console.log("Connected");
    }
    else
    console.log(err);
});

module.exports = connection;