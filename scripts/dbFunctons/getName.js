var db = require('../../middleware/db');



async function getName(user_id){
    db.checkConnection();
    var user_name=""
    await db.query("SELECT name FROM Users WHERE id=?",[user_id])
    .then(function(results){
      // console.log(results)
        user_name = results[0].name;
        // console.log(user_name)
    })
    .catch(function(error){
      console.log('Error occured: ',error);
    });
    return user_name;
}
module.exports=getName