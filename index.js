/**
 * Created by tonyStark on 12/6/2016.
 */
var express = require('express');
var config = require('./config');
var app = express();
var request = require('request');
var googleMapsClient = require('@google/maps').createClient({
    key: config.apikey
});

/*var origin = '12.863343,77.658181';*/


/*var origin = "Bangalore";
var dest ="Kolkata";*/
/*var dest = "Income Tax Centralized Processing Centre";*/

var url = 'https://maps.googleapis.com/maps/api/directions/json';
var dataR=[];
/*googleMapsClient.directions(query,function(err,data){
    if(err){
        console.log("Error in fetching from api:"+err);
    }
    else{
       // console.log(data.json);
        var resultsObj = JSON.parse(data);
       // dataR=resultsObj.routes[0].legs[0].steps[0].html_instructions;
        //console.log("jsondata  "+dataR);
        console.log(resultsObj);
    }
});*/
var getAllManuevers = function(origin,dest,callback){
    console.log("origin : %s , destination :%s",origin,dest);
   /* var origin = '12.917762,77.651723';

    var dest = "12.860226,77.654909";*/
    var query = {
        origin : origin,
        destination : dest,
        key : config.apikey
    }
    request.get({url:url,qs:query}, function (err, res, body) {
        //console.log(res);
        if (!err) {
            var resultsObj = JSON.parse(body);
            //console.log(resultsObj);
            //Just an example of how to access properties:
            // var legs = resultsObj.routes[0].legs;
            resultsObj.routes.forEach(function(legd){
                //console.log(legd.legs);
                legd.legs.forEach(function(steps){
                    //console.log(steps.steps);
                    steps.steps.forEach(function(html,index){
                        console.log(html.maneuver);
                        if(html.maneuver != undefined)
                        {
                            dataR.push({
                                'index' : index||null,
                                'endLocation':{
                                    'lat':html.end_location.lat,
                                    'long':html.end_location.lng
                                },
                                'maneuver':html.maneuver
                            });
                        }
                       // dataR =html.html_instructions.replace(/(&nbsp;|(<([^>]+)>))/ig,'');
                    });
                });
            });
            //console.log(resultsObj.routes[0].legs[0].steps[0].html_instructions.replace(/(&nbsp;|(<([^>]+)>))/ig,''));

        callback(dataR);
        }
        else{
            console.log(err);
        }
    });
}

app.get('/api/getFullLocation',function(req,res){
    /*res.send(dataR);*/
    var startLocation = req.param('startLocation');
    var endLocation = req.param('endLocation');
      getAllManuevers(startLocation,endLocation,function(data){


         res.send({'data':data});
          console.log("dataa:"+data);
     });


});
app.listen(3000,function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Listening on port 3000");
    }
})
