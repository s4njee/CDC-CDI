var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/cdc');
var collection = db.get('data');
var ua = require('universal-analytics');
var visitor = ua('UA-90093602-1')
/* GET home page. */
router.get('/', function(req, res, next) {
    visitor.pageview("/").send();
    var state, topic, question, yearstart, strat1;
    collection.distinct("LocationAbbr").then(function(s){ state = s }).then(
        collection.distinct("Topic").then(function(s){topic=s}).then(
            collection.distinct("Question").then(function(s){question=s}).then(
                collection.distinct("YearStart").then(function(s){yearstart=s}).then(
                    collection.distinct("Stratification1").then(function(s){strat1=s}).then(
                        function(){
                            var mqueryL, mqueryQ, mqueryY, mqueryS, mqueryT;
                            if(req.query.state!=='')
                            {
                                mqueryL = {"LocationAbbr": req.query.state};
                            }
                            if(req.query.topic!=='')
                            {
                                mqueryT = {"Topic": req.query.topic};
                            }
                            if(req.query.yearstart!=='')
                            {
                                mqueryY = {"YearStart": parseInt(req.query.yearstart)};
                            }
                            if(req.query.stratification!=='')
                            {
                                mqueryS = {"Stratification1": req.query.stratification};
                            }
                            if(req.query.question !== '')
                            {
                                mqueryQ = {"Question" :req.query.question};
                            }
                            var mquery = Object.assign({}, mqueryL,mqueryT, mqueryQ, mqueryY, mqueryS);
                            collection.find(mquery, function(error, documents){
                                var requestedResults = req.query.numresults;
                                console.log(requestedResults)
                                reqestedResults = requestedResults > 0 ? requestedResults : 500
                                docsCapped = documents.slice(0,requestedResults) 
                                res.render('index', 
                                    { title: 'CDC Chronic Disease Indicators', 
                                        u:docsCapped, 
                                        doccount:documents.length,
                                        sdefault:req.query.state,
                                        ydefault:req.query.yearstart,
                                        tdefault:req.query.topic,
                                        qdefault:req.query.question,
                                        stratdefault:req.query.stratification,
                                        s:state,
                                        y:yearstart,
                                        q:question,
                                        strat1:strat1, 
                                        t:topic
                                    });
                            })
                        }// End of query function 
                    )
                )
            )
        )
    )

});

module.exports = router;
