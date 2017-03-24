var db = require('../midleware/DB');

module.exports={
    controller: function(plcalarms,newalarm){
          var tzoffset = (new Date()).getTimezoneOffset() * 60000;
          var CurrentTime = (new Date(Date.now() - tzoffset)).toISOString().replace('T', ' ').substr(0, 19); 
          var alarmarr=[];
         
            db.readCurrentAlarms(function(data){
              if (!('1' in data) && plcalarms[11]>0) {
                  db.writeCurrentAlarms(1);
                  alarmarr.push({time:CurrentTime,status:'in',alarmtext:'Maximum alarm value 1'});
                };
              if (('1' in data) && plcalarms[11]==0) {
                  alarmarr.push({time:CurrentTime,status:'out',alarmtext:'Maximum alarm value 1'});
                  db.deleteCurrentAlarms(1);
                };         
               return newalarm(alarmarr); 
            });
            
       
    }

}