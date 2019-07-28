const express = require("express");
const router = express.Router();
const app = express();
const mysql = require('mysql');
var dbFuncs = require('../database.js')
const makeQuery = dbFuncs.makeQuery;
const execQuery = dbFuncs.execQuery;
const makePost = dbFuncs.makePost;
const makeUpdate = dbFuncs.makeUpdate;
const con = dbFuncs.con;

router.get("/get", async (req, res) => {
  var custom = makeQuery(req);
  if(custom!=null)
    execQuery(custom,req,res,con);
  else{
    res.send("Invalid Table")
  }
});

router.get("/post", async (req, res) => {
  var custom = makePost(req);
  console.log(custom);
  if(custom!=null){
    execQuery(custom,req,res,con);
  }
  else{
    res.send("Invalid Table")
  }
});

router.get("/update", async (req, res) => {
  var custom = makeUpdate(req);
  console.log(custom);
  if(custom!=null){
    execQuery(custom,req,res,con);
  }
  else{
    res.send("Invalid Table")
  }
});

module.exports = router;
