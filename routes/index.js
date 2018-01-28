var express = require('express');
var router = express.Router();
var ffi=require('ffi');
var refarray=require('ref-array');
var ref=require('ref');
var StructType=require('ref-struct');
var Hkload=require('./HKload');
//var socke.
hkload=new Hkload();
router.get('/', function(req, res, next) {
  var UserLongin=hkload.getNet_userlogininfo();
  var struPlayInfo=hkload.getplayinfo();
  UserLongin.sDeviceAddress='192.168.5.63';
  UserLongin.wPort=8000;
  UserLongin.sUserName='admin';
  UserLongin.sPassword='12345';
  struPlayInfo.Channel1=1;
  struPlayInfo.dwStreamType=0;
  struPlayInfo.dwLinkMode=0;
  struPlayInfo.hPlayWnd=3;
  hkload.getVideo(UserLongin,struPlayInfo,null);
  res.render('index', { title: 'Express',data:"my" });
});


module.exports = router;