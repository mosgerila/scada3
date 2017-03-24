var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};
var lastT = [];
//var db = require('../midleware/db');
//var mb = require('../midleware/Modbus');

socketApi.io = io;





io.on('connection', function (socket) {
    console.log('A user connected');

    io.sockets.emit('var1','25');

    for (var i = 1; i <= 15; i++) {

        //io.sockets.emit('var' + i.toString(), lastT[i] / 10);
    
    }
    socket.on('getdatta', function (socket) {
        //io.sockets.emit('data', [25, 36, 87, 2, 34]);
        //console.log('sunt aici');
        
            db.readData(function (data){
              io.sockets.emit('data', data);  
           

        });
    });

    socket.on('givealarm', function (socket) {
        db.readAlarms(function (data) {
            console.log('Alarmee');            
            io.sockets.emit('alarm', data);

        });
       
    });

    socket.on('set', function (data) {

        console.log('De pe ecran:', data);
       
       
      

    });

    

   sendd=function(data){
       //socket.emit('var1',data.register[1]);
   }
   
    
});


socketApi.sendNotification = function (data) {
    for (var i = 1; i <= 15; i++) {
        if (data.register[i] != lastT[i]) {
            //io.sockets.emit('var' + i.toString(), data.register[i] / 10);
             //socketApi.io.emit('var' + i.toString(), data.register[i] / 10);
             
        }
        
    }
    lastT = data.register;
     io.emit('var1','58');
     console.log('Am trimis');
}

socketApi.sendTable = function (data) {
    io.sockets.emit('alarmrealtime', data);
}

socketApi.sendChart = function (data) {
    var obj = { time: "23", val: "OK" };
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var CurrentTime = (new Date(Date.now() - tzoffset)).toISOString().replace('T', ' ').substr(0, 19);
    obj.time = CurrentTime;
    obj.val = data;
    io.sockets.emit('chartrealtime', obj);
    console.log('chartrealtime');
}



module.exports = socketApi;




