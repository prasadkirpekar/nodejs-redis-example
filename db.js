var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Satara@123',
  database:'noderedis',
});

connection.connect();

function fetchuser(id,callback){
    
    connection.query('select firstname, lastname, email from user where id='+id, function (error, result) {
        if (error) {
            throw error;
        }
        callback(result)
        
    });
    
}

function updateuser(id,user,callback){
    
    var sql = `update user set email = '${user.email}', firstname = '${user.firstname}', lastname = '${user.lastname}' where id=${id}`;
    var res = connection.query(sql, function (error,result) {
        if (error) {
            callback(false)
        }
        else{
            callback(true)
        }
    });
    
}

function adduser(user,callback){
    
    var sql = `insert into user(email,firstname,lastname) values('${user.email}','${user.firstname}','${user.lastname}')`;
    var res = connection.query(sql, function (error,result) {
        if (error) {
            throw error
        }
        else{
            callback(result)
        }
    });
    
}

module.exports = {
    fetchuser: fetchuser,
    updateuser:updateuser,
    adduser:adduser

}