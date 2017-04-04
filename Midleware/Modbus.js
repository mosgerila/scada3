var express = require('express');

var socket_io = require('socket.io');
var io = socket_io();



var communicate = require('../midleware/CommFront');
var db = require('../midleware/DB');
var currentalarms = require('../midleware/AlarmController');

var lastVars=[];

communicate.io=io;
//nio.attach(io);

var mdb = {};

mdb.io=io;

'use strict'
var modbus = require('jsmodbus')
var client = modbus.client.tcp.complete({
    'host': '192.168.0.175',
    'port': 502,
    'autoReconnect': true,
    'reconnectTimeout': 7000,
    'logEnabled': true,
    'timeout': 6000,
}).connect()
var successCount = 0
var errorCount = 0
var reconnectCount = 0
var firstTime = true
var intId

mdb.start = function (port) {
    
    // console.log('Starting request...')
    
    
        
  

    client.readHoldingRegisters(0, 16).then(function (resp) {
        successCount += 1
        //console.log(resp.register);
        console.log('Success', successCount, 'Errors', errorCount, 'Reconnect', reconnectCount)
       
        db.writeData(resp.register);
        
        currentalarms.controller(resp.register,function(datas){
              if (datas!=null) {sendTable(datas[0]);}
        });
        //console.log('New alarm:',newalarm);
        

        sendNotification(resp);
        sendChart(resp.register[1]);
        console.log(resp.register[1]);
       

       // console.log('Request finished successfull.')
        
       
        setTimeout(function () {
            mdb.start()
        }, 3000)
    }).fail(function (err) {
        console.error(err)

        errorCount += 1

        console.log('Success', successCount, 'Errors', errorCount, 'Reconnect', reconnectCount)

        console.log('Request finished UNsuccessfull.')
    })
   
}




client.on('connect', function () {
    console.log('client connected.')

    if (firstTime) {
        firstTime = false
    } else {
        reconnectCount += 1
        mdb.start()
    }

    //mdb.start()
})

var stop = function () {
    clearInterval(intId)
}

var shutdown = function () {
    stop()

    client.close()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

client.on('close', function () {
    console.log('Client closed, stopping interval.')

    stop()
})

client.on('error', function (err) {
    console.log('Client Error', err)
    db.writeAlarms(err);
    var obj = { time: "23", alarmtext: "OK" };
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var CurrentTime = (new Date(Date.now() - tzoffset)).toISOString().replace('T', ' ').substr(0, 19);
    obj.time = CurrentTime;
    obj.alarmtext = 'Error: '+err.message;
    console.log(obj.time);
	sendTable(obj);
    
})

mdb.writeOneReg = function (data) {
    client.writeSingleRegister(8, 89);
};




//socket.io------------------------------------------------------------------------------------------------------------------------------------------------




io.on('connection', function (socket) {
    console.log('A user connected');

    //io.sockets.emit('var1','25');

    for (var i = 1; i <= 15; i++) {

        io.sockets.emit('var' + i.toString(), lastVars[i] / 10);
    
    }
    socket.on('getdatta', function (socket) {
    
        
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

    socket.on('var1max', function (data) {

        console.log('De pe ecran:', data);
        client.writeSingleRegister(8,data).then(function (resp) {
        console.log(resp);
        },console.error);
      

    });

    socket.on('var1min', function (data) {

        console.log('De pe ecran:', data);
        client.writeSingleRegister(9,data).then(function (resp) {
        console.log(resp);
        },console.error);
      

    });

       socket.on('getset', function (socket) {
               
              io.sockets.emit('setget', lastVars[8]);  
           
    });

      socket.on('mindate', function (data) {
               
              console.log('Date Min: ',data);
              db.readArhiveChart(data,function (db){
              io.sockets.emit('charthistoricdata', db);
              console.log(db);  
           

        });
           
    });
 
    
});

sendNotification = function (data) {
    for (var i = 1; i <= 15; i++) {
        if (data.register[i] != lastVars[i]) {
            io.sockets.emit('var' + i.toString(), data.register[i] / 10);
            
             
        }
        
    }
    lastVars = data.register;
     
     console.log('Am trimis');
}

sendTable = function (data) {
    io.sockets.emit('alarmrealtime', data);
    
}

sendChart = function (data) {
    var obj = { time: "23", val: "OK" };
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var CurrentTime = (new Date(Date.now() - tzoffset)).toISOString().replace('T', ' ').substr(0, 19);
    obj.time = CurrentTime;
    obj.val = data;
    io.sockets.emit('chartrealtime', obj);
    console.log('chartrealtime');
}

module.exports = mdb;