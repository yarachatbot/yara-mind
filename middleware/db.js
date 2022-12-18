const mysql = require('mysql')

const connectionPool = mysql.createPool({
  host: 'database-1.cr4armiwudxw.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'chodu6969',
  database: 'yara_db',
  port: '3306',
  connectionLimit: 20
})

async function queryPromise(query,args)
{
  return new Promise((resolve, reject)=>{
    connectionPool.query(query,args,(error, results)=>{
            if(error)
              return reject(error);
            else
              return resolve(results);
        });
  });
}

function checkConnection()
{
  connectionPool.getConnection(function(err,conn) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected to database as id ' + conn.threadId);
  conn.release();
});
}

checkConnection();
exports.query = queryPromise;
exports.checkConnection = checkConnection;