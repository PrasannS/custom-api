const mysql = require('mysql');

const con = mysql.createConnection({
  host: /*ENTER HOST HERE*/,
  user: /*ENTER DB USER HERE*/,
  password:/*ENTER PASSWORD HERE*/,
  database: /*ENTER DB NAME HERE*/
});

var utils = require('./utils.js')

//enables API user to check for all instances of any variable based on their choosing
const makeQuery = (req) => {

  //base query, if API user doesn't input anything a list of all users will be provided
  let query = "SELECT * FROM "+req.query.table+" ";

  //keeps track of whether starting or continuing query in concatenation
  let mods = 0;

  //getting object keys and values in array form for customizability, ommitting the 'key' key
  keyArr = Object.keys(req.query);
  utils.shift(keyArr,2);
  valArr = Object.values(req.query);
  utils.shift(valArr,2);

  //keep track of current value index
  let cur = 0;

  //allows n many conditions max being all the variables in the database, error will be indicated if these names don't match db values
  for(k in keyArr){
      if(mods==0){
        query = query.concat("WHERE ",keyArr[k]," LIKE \'",valArr[cur],"\' ");
        mods++;
      }
      else{
        query = query.concat("AND ",keyArr[k]," LIKE \'",valArr[cur],"\' ");
      }
      cur++;
  }
  return query+";";
}

//This method allows a customized post, assuming the request gives key,table, and a types string 
//That contains a sequence of 't's, representing text params and other miscellaneous letters representing the other datatypes of each param
//After that all wanted params can be inputted
const makePost = (req) => {

  let query = "INSERT INTO "+req.query.table+"(";

  //keeps track of whether starting or continuing query in concatenation
  let mods = 0;

  //getting object keys and values in array form for customizability, ommitting the 'key' key
  keyArr = Object.keys(req.query);
  utils.shift(valArr,3);
  valArr = Object.values(req.query);
  utils.shift(valArr,3);

  //allows n many conditions max being all the variables in the database, error will be indicated if these names don't match db values
  for(k in keyArr){
      if(mods==0){
        query = query.concat(keyArr[k]);
        mods++;
      }
      else{
        query = query.concat(",",keyArr[k]);
      }
  }

  query = query.concat(") VALUES (");
  mods = 0;

  //keep track of current value index
  let cur = 0;

  for(k in valArr){

      if(mods==0){

      	//check datatype
      	if(req.query.types.charAt(cur)=='t')
        	query = query.concat("\'",valArr[k],"\'");
        else
        	query = query.concat(valArr[k]);
        mods++;
      }
      else{
        if(req.query.types.charAt(cur)=='t')
        	query = query.concat(",", "\'",valArr[k],"\'");
        else
        	query = query.concat(",", valArr[k]);
      }
      cur++;
  }

  query = query.concat(")");
  return query+";";
}

//this method allows a customized update, in addition to typical post params, an id param is required after types, and then all new changes can be set
const makeUpdate = (req) => {
  
  let query = "UPDATE "+req.query.table+" SET ";

  //keeps track of whether starting or continuing query in concatenation
  let mods = 0;

  //getting object keys and values in array form for customizability, ommitting the 'key' key
  keyArr = Object.keys(req.query);
  utils.shift(valArr,4);
  valArr = Object.values(req.query);
  utils.shift(valArr,4);

  //keep track of current value index
  let cur = 0;

  for(k in valArr){

      if(mods==0){

      	//check datatype
      	if(req.query.types.charAt(cur)=='t')
        	query = query.concat(keyArr[k]," = ","\'",valArr[k],"\'");
        else
        	query = query.concat(keyArr[k]," = ",valArr[k]);
        mods++;
      }
      else{
        if(req.query.types.charAt(cur)=='t')
        	query = query.concat(", ",keyArr[k]," = ", "\'",valArr[k],"\'");
        else
        	query = query.concat(",",keyArr[k]," = ", valArr[k], " ");
      }
      cur++;
  }

  return query.concat("WHERE id LIKE ",req.query.id);
}


//executes string query in actual sql db
const execQuery = (quer,req,res,con) => {	

	/*TODO update for dynamic key checking*/
	if(req.query.key==1){

		try {
			//basic connection / execution code
		  con.connect(function(err) {

		    con.query(quer, function (err, result) {
		      if (err) throw err;
		      res.send(result);
		    });
		  });
		} catch (err) {
			//if something's wrong...
		  res.status(400).json({
		    message: "Some error occured",
		    err
		  });
		}
	}
}

//exportation for use in any class/ situation
module.exports = {
  makeQuery:makeQuery,
  execQuery:execQuery,
  makePost:makePost,
  makeUpdate:makeUpdate,
  con:con
};
