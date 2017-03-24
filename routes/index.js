var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {home: true});
});

router.get('/alarms', function (req, res) {
    res.render('alarms', { alarms: true });
});

router.get('/chart', function (req, res) {
    res.render('chart', { chart: true });
});

router.get('/sett', function (req, res) {
    res.render('sett', { sett: true });
});

router.get('/google', function (req, res) {
    res.render('index', { sett: true });
    console.log('Google request');
});
module.exports = router;