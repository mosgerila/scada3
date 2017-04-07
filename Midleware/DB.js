var pgp = require("pg-promise")();
var db = pgp("postgres://postgres:salonix414@localhost:5432/testvin1");

//var communicate = require('../midleware/commfront');


module.exports={
    writeData : function (value) {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var CurrentTime = (new Date(Date.now() - tzoffset)).toISOString().replace('T', ' ').substr(0, 19);

      

        db.any("select time,val1 from test1 order by time", [true])
            .then(function (data) {
                //console.log(data[data.length-1]);
            })
            .catch(function (error) {
                writeAlarms(error);
                console.log(error);
            });
        db.query("Insert into test1 (Time,val1,val2,val3,val4,val5) values (Timestamp '" + CurrentTime + "'," + value[0] / 10 + "," + value[1] / 10 + "," + value[2] / 10 + "," + value[3] / 10 + "," + value[4] / 10 + ")");
        db.query("delete from test1 where time < now() - interval '30 minutes'");
        
    },

    writeAlarms : function (value) {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var CurrentTime = (new Date(Date.now() - tzoffset)).toISOString().replace('T', ' ').substr(0, 19);

        db.query("Insert into alarms values (Timestamp '" + CurrentTime + "','" + value + "')");
        db.query("delete from test1 where time < now() - interval '5 days'");
       
    },

    readAlarms : function (res) {
        db.any("select * from alarms order by time limit 10", [true])
            .then(function (data) {
                
                
                res(data);
            })
            .catch(function (error) {
                writeAlarms(error);
                console.log(error);
            });
        
    },

    readData : function (res) {
        db.any("select time,val1 from test1 order by time", [true])
            .then(function (data) {
               

                res(data);
            })
            .catch(function (error) {
                writeAlarms(error);
                console.log(error);
            });

    },

     writeCurrentAlarms : function (value) {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var CurrentTime = (new Date(Date.now() - tzoffset)).toISOString().replace('T', ' ').substr(0, 19);

        db.query("Insert into currentalarms values (" + value + ",Timestamp'" + CurrentTime+"')");
       
    },

     deleteCurrentAlarms : function (value) {
        

        db.query("delete from currentalarms where id="+value);
       
    },

    readCurrentAlarms : function (res) {
        db.any("select * from currentalarms order by time", [true])
            .then(function (data) {
               
                
                res(data);
            })
            .catch(function (error) {
                writeAlarms(error);
                console.log(error);
            });
        
    },

     readArhiveChart : function (mindate,maxdate,res) {
        //var time=mindate.toISOString().replace('T', ' ').substr(0, 19); 
        //console.log("select time,val1 from test1 where time < '"+mindate+"' order by time");
        db.any("select time,val1 from test1 where time > '"+mindate+"'and time < '"+maxdate+"' order by time", [true]).then(function (data) {
               

                res(data);
            })
            .catch(function (error) {
                writeAlarms(error);
                console.log(error);
            });

    },

}

