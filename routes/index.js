var express = require('express');
var router = express.Router();
var monk = require('monk');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cdi.sqlite');
/* GET home page. */
router.get('/', function(req, res, next) {
    //    visitor.pageview("/").send();
    let state=[] ,topic=[], question=[], yearstart=[], strat1=[];
    db.serialize(function(){
        db.all("SELECT DISTINCT LocationAbbr from data", function(err,row){
            row.forEach(function(st){state.push(st.LocationAbbr)});
            state.sort();
        }), db.all("SELECT DISTINCT Topic from data", function(err,row){
            row.forEach(function(st){topic.push(st.Topic)});
            topic.sort();
        }), db.all("SELECT DISTINCT Question from data", function(err,row){
            row.forEach(function(st){question.push(st.Question)});
        }), db.all("SELECT DISTINCT YearStart from data", function(err,row){
            row.forEach(function(st){yearstart.push(st.YearStart)});
            yearstart.sort().reverse();
        }), db.all("SELECT DISTINCT Stratification1 from data", function(err,row){
            row.forEach(function(st){strat1.push(st.Stratification1)});
        }) ,db.all("SELECT DISTINCT LocationDesc from data", function(){
            
            var query2 = ' WHERE LocationAbbr='+"'"+req.query.state+"'";
            req.query.yearstart != '' ? query2 += "AND yearstart="+req.query.yearstart:''
            req.query.topic != '' ? query2 += " AND topic="+"'"+req.query.topic+"'":''
            req.query.stratification != '' ? query2 += " AND stratification="+"'"+req.query.stratification+"'":''
            req.query.question != '' ? query2 += " AND question="+"'"+req.query.question+"'":''
            req.query.numresults != '' ? query2 += " LIMIT "+ req.query.numresults:''
            db.all("SELECT * from data"+query2,function(err,row){
                db.all("SELECT COUNT(*) from data"+query2,function(err,count){
                    let rowcount = JSON.stringify(count[0]).toString().split(":")[1].replace(/}/,'');
                if(row==undefined){
            db.all("SELECT * from data LIMIT 500",function(err,row){
                                res.render('index', 
                                    { title: 'CDC Chronic Disease Indicators', 
                                        u:row,
                                        sdefault:req.query.state,
                                        ydefault:req.query.yearstart,
                                        tdefault:req.query.topic,
                                        qdefault:req.query.question,
                                        stratdefault:req.query.stratification,
                                        s:state,
                                        y:yearstart,
                                        q:question,
                                        strat1:strat1, 
                                        t:topic,
                                        doccount:rowcount
                                    })                             });
                }else{
                                res.render('index', 
                                    { title: 'CDC Chronic Disease Indicators', 
                                        u:row,
                                        sdefault:req.query.state,
                                        ydefault:req.query.yearstart,
                                        tdefault:req.query.topic,
                                        qdefault:req.query.question,
                                        stratdefault:req.query.stratification,
                                        s:state,
                                        y:yearstart,
                                        q:question,
                                        strat1:strat1, 
                                        t:topic,
                                        doccount:rowcount
                                         })}});
    })})})});

    

module.exports = router;
