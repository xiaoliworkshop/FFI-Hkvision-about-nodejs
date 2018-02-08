var express = require('express');
var router = express.Router();
var fs=require('fs');
var Hkload=require('./HKload');
var io=require('../socketio');
hkload=new Hkload();
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',data:"my" });
});
router.get('/videocanvas',function(req,res){
  var ajaxText={
    tips:"走通了"
  };
  res.send(ajaxText);
  var UserLongin=hkload.getNet_userlogininfo();
  var struPlayInfo=hkload.getplayinfo();
  UserLongin.sDeviceAddress='192.168.5.63';
  UserLongin.wPort=8000;
  UserLongin.sUserName='admin';
  UserLongin.sPassword='12345';
  struPlayInfo.Channel1=2;
  struPlayInfo.dwStreamType=0//从0(主码流)变为1(子码流)以适应web类型的大小
  struPlayInfo.dwLinkMode=1;
  struPlayInfo.hPlayWnd=null;
  hkload.getVideo("192.168.5.62",8000,"admin","12345",struPlayInfo,function(data){
      var frame=new Buffer(data).toString('base64');
      io.video1(frame);
  })
});

module.exports = router;