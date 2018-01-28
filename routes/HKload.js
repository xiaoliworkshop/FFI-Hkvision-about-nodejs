var express = require('express');
var router = express.Router();
var ffi=require('ffi');
var refarray=require('ref-array');
var ref=require('ref');
var StructType=require('ref-struct');
//var async=require('async');
var EventEmitter=require('events').EventEmitter;
var fs=require('fs');
var iconv=require('iconv-lite');
var StringDecoder=require('string_decoder').StringDecoder;
var decoder=new StringDecoder('utf8');
var img=require("images");
var IO=require("../socketio");

function hkvisionffi(){
  var DWORD=ref.types.ulong;
  var Long=ref.types.long;
  var HWND=ref.types.long;
  var uInt=ref.types.uint;
  //var Stringstru=StructType({
  //  RGB24:ref.types.string
  //});
  var FRAME_INFO=StructType({
  nWidth:ref.types.int32,
  nHeight:ref.types.int32,
  nStamp:ref.types.int32,
  nType:ref.types.int32,
  nFrameRate:ref.types.int32,
  dwFrameNum:ref.types.uint32
});
var FRAME_INFOPtr=ref.refType(FRAME_INFO);
var NET_DVR_PREVIEWINFO=StructType({
    Channel1:Long,
    dwStreamType:DWORD,
    dwLinkMode:DWORD,
    hPlayWnd:uInt,
    bBlocked:ref.types.bool,
    bPassbackRecord:ref.types.bool,
    byPreviewMode:refarray('byte',1),
    byStreamID:refarray('byte',32),
    byProtoType:refarray('byte',1),
    byRes1:refarray('byte',1),
    byVideoCodingType:refarray('byte',1),
    dwDisplayBufNum:DWORD,
    byRes:refarray('byte',216)
});
var NET_DVR_DEVICEINFO_V30=StructType({
  sSerialNumber:refarray('byte',48),
  byAlarmInPortNum:refarray('byte',1),
  byAlarmOutPortNum:refarray('byte',1),
  byDiskNum:refarray('byte',1),
  byDVRType:refarray('byte',1),
  byChanNum:refarray('byte',1),
  byStartChan:refarray('byte',1),
  byAudioChanNum:refarray('byte',1),
  byIPChanNum:refarray('byte',1),
  byZeroChanNum:refarray('byte',1),
  byMainProto:refarray('byte',1),
  bySubProto:refarray('byte',1),
  bySupport:refarray('byte',1),
  bySupport1:refarray('byte',1),
  bySupport2:refarray('byte',1),
  wDevType:ref.types.uint,
  bySupport3:refarray('byte',1),
  byMultiStreamProto:refarray('byte',1),
  byStartDChan:refarray('byte',1),
  byStartDTalkChan:refarray('byte',1),
  byHighDChanNum:refarray('byte',1),
  bySupport4:refarray('byte',1),
  byLanguageType:refarray('byte',1),
  byVoiceInChanNum:refarray('byte',1),
  byStartVoiceInChanNO:refarray('byte',1),
  byRes3:refarray('byte',2),
  byMirrorChanNum:refarray('byte',1),
  wStartMirrorChanNO:ref.types.ulong,
  byRes2:refarray('byte',2)
});
var NET_DVR_DEVICEINFO_V40=StructType({
  struDeviceV30:NET_DVR_DEVICEINFO_V30,
  bySupportLock:refarray('byte',1),
  byRetryLoginTime:refarray('byte',1),
  byPasswordLeverl:refarray('byte',1),
  byRes1:refarray('byte',1),
  dwSurplusLockTime:ref.types.ulong,
  byCharEncodeType:refarray('byte',1),
  byRes2:refarray('byte',255)
});
var NET_DVR_DEVICEINFO_V30_ptr=refarray(NET_DVR_DEVICEINFO_V30);
var UserLoginResult=StructType({
  oneUserId:Long,
  dwResult:DWORD,
  onepDeviceInfo:NET_DVR_DEVICEINFO_V30_ptr,
  pUser:'pointer'
});
//var struPlayInfo1=null;
//var struPlayType=refarray(NET_DVR_PREVIEWINFO);
var fLoginResultCallBack=null;
fLoginResultCallBack=new ffi.Callback('pointer',[Long,DWORD,'pointer','pointer'],function(UserId,Result,V30_ptr,usrdata){
  var callbackLogin=new UserLoginResult;
  callbackLogin.oneUserId=UserId;
  callbackLogin.dwResult=Result;
  callbackLogin.onepDeviceInfo=V30_ptr;
  callbackLogin.pUser=usrdata;
});
var NET_DVR_USER_LOGIN_INFO=StructType({
  sDeviceAddress:ref.types.CString,
  byRes1:refarray('byte',1),
  wPort:ref.types.uint,
  sUserName:ref.types.CString,
  sPassword:ref.types.CString,
  cvLoginResult:'pointer',
  pUser:'pointer',
  bUseAsynLogin:refarray('byte',1),
  byRes2:refarray('byte',128)
});
var yv12_RBG24=ffi.Library('./YV_12-RBG24/libyv_12-toRGB24',{
  YV12_to_RGB32:['bool',['string','string','int','int']]
});
var HC_NETFFI=ffi.Library('./public/native/lib/libhcnetsdk',{
  NET_DVR_Init:['bool',[]],
  NET_DVR_SetConnectTime:['bool',[DWORD,DWORD]],
  NET_DVR_SetReconnect:['bool',[DWORD,'bool']],
  NET_DVR_Login_V40:[Long,["pointer","pointer"]],
  NET_DVR_RealPlay_V40:['long',[Long,'pointer','pointer','pointer']],
  NET_DVR_StopRealPlay:['bool',[Long]],
  NET_DVR_Logout:['bool',[Long]],
  NET_DVR_Cleanup:['bool',[]],
  NET_DVR_SetExceptionCallBack_V30:['bool',[uInt,'pointer','pointer','pointer']],
  NET_DVR_Login_V30:[Long,['string',uInt,'string','string','pointer']],
  NET_DVR_GetLastError:[DWORD,[]],
  NET_DVR_SaveRealData:['bool',[Long,'string']]
 // NET_DVR_StopSaveRealData:['bool',[Long]]
});
this.DVR_Init=function(){
  return HC_NETFFI.NET_DVR_Init();
}
var PLAYM4H=ffi.Library('./public/native/lib/libPlayCtrl',{
  PlayM4_GetPort:['bool',['pointer']],
  PlayM4_SetStreamOpenMode:['bool',['uint32',DWORD]],
  PlayM4_OpenStream:['bool',[Long,'pointer',DWORD,DWORD]],
  PlayM4_Play:['bool',[Long,Long]],
  PlayM4_SetDecCallBack:['bool',[Long,'pointer']],
  PlayM4_InputData:['bool',[Long,'pointer',DWORD]],
  PlayM4_GetJPEG:['bool',['long','pointer',DWORD,'pointer']],
  PlayM4_ConvertToJpegFile:['bool',['string',Long,Long,Long,Long,'string']]
});
var playm4_getport=function(){
  return PlayM4_GetPort;
}
this.getNet_userlogininfo=function(){
  this.UserLogin=null;
  return this.UserLogin=new NET_DVR_USER_LOGIN_INFO;
}
this.getplayinfo=function(){
  this.struPlayInfo1=null;
  return this.struPlayInfo=new NET_DVR_PREVIEWINFO;
}
this.getVideo=function(UserLogin,struPlayInfo,callback){
  var Net_Dvr=refarray(NET_DVR_USER_LOGIN_INFO);
  var initOk=HC_NETFFI.NET_DVR_Init();
  console.log(initOk);
  var setconOK=HC_NETFFI.NET_DVR_SetConnectTime(2000,1)
  console.log(setconOK);
  var reconOK=HC_NETFFI.NET_DVR_SetConnectTime(10000,1);
  console.log(reconOK);
  var refthis=this;
  EventEmitter.call(refthis);
  var oneUserId;
  //var pBUfferType=refarray('byte');
  //console.log(fRealDataCallBack);
  var count=0;
  //var RGB32='';
  var bufferType2=ref.refType(ref.types.uchar);
  var DecCBFUN=new ffi.Callback('void',[Long,bufferType2,Long,FRAME_INFOPtr,Long,Long],function(nport1,pbuf1,nSize,pFrameInfo,nReserved1,nReserved2){
      count++;
      var ht=pFrameInfo.deref().nHeight;
      var wd=pFrameInfo.deref().nWidth;
      console.log(nport1);
      var RGB=new Buffer(4*wd*ht);
      RGB.type=ref.types.uchar;
      RGB.writeInt8(0,0);
      yv12_RBG24.YV12_to_RGB32(pbuf1,RGB,wd,ht);
      var bool=PLAYM4H.PlayM4_ConvertToJpegFile(RGB,nSize,wd,ht,0,count+'.jpg');
      /*
      //console.log(nport.deref());*/
      //var pJpeg=new Buffer(wd*ht*3/2+1);
      //pJpeg.type=ref.types.uchar;
      //pJpeg.writeInt8(0,0);
      //var pJpegSizeType=ref.refType(DWORD); */
      //var pJpegSize=ref.alloc(DWORD,1);
      //var JPEGok=PLAYM4H.PlayM4_GetJPEG(nport1,pJpeg,wd*ht,pJpegSize);
      //count++;
      //var jpegstring=decoder.write(pJpeg);
      //var mv=new Buffer(jpegstring).toString('base64');
      /*refthis.emit('data',mv);
      refthis.on('data',function(mv){
        console.log('33');
        IO.video1(mv);
      });*/
       //fs.writeFile('RGB'+count+".jpg",pJpeg,'UTF-8',function(){});
      //console.log(JPEGok);
      //console.log(pJpeg);
      //console.log(pJpegSize.deref());
      //console.log(pJpeg);
      //var GetArrayType = refarray(ref.types.uchar);
      //var array = new GetArrayType(pJpeg);
      //array.length = wd*ht*3/2;
      //array = array.toArray();
      //fs.writeFile('RGB'+count+".jpg",array,'UTF-8',function(){}); 
      //console.log(array);
      //var jpegstring=decoder.write(pJpeg);
      //
      //console.log(mv);
      //var GetArrayType = refarray(ref.types.uchar);
      //var array = new GetArrayType(pbuf1);
     // array.length = nSize;
      //array = array.toArray();
      //console.log(pFrameInfo.deref());
      /*
      
      var RGBstring=decoder.write(RGB);
      var baseRGB=new Buffer(RGBstring).toString('base64');
      //console.log(baseRGB);*/
      /*img(RGBstring).size(wd.ht);
      //console.log(baseRGB);
      //count++;
      //RGB.toString('base64');
      //fs.writeFile('RGB'+count+".jpg",RGB,'UTF-8',function(){});
      //console.log(RGBstring);
      //console.log(pFrameInfo.deref());
      //var xy=RGB32.toString('base64');*/
  });
  var nportType=ref.types.int32;
  var nport=ref.alloc(nportType);
  var fRealDataCallBack=null;
  //var qbuf11=ref.alloc('byte',1000);
  qbuf11=ref.refType('byte');
  //qbuff11=qbuf12.ref();
  fRealDataCallBack=new ffi.Callback('void',[Long,DWORD,qbuf11,'ulong','pointer'],function(RealHandle2,dwDataType,pBuffer,dwBufSize,PUser1){
    switch(dwDataType){
      case 1:
        if(!PLAYM4H.PlayM4_GetPort(nport)){
          break;
        }
        if(!PLAYM4H.PlayM4_SetStreamOpenMode(nport.deref(),0)){
          break;
        }
        if(!PLAYM4H.PlayM4_OpenStream(nport.deref(),pBuffer,dwBufSize,10*1024*1024)){
          break;
        }
        if(!PLAYM4H.PlayM4_Play(nport.deref(),0)){
          break;
        }
        //console.log('err1');
        if(!PLAYM4H.PlayM4_SetDecCallBack(nport.deref(),DecCBFUN)){
          break;
        }
        //console.log('err2');
        //console.log(nport.deref());
     break;
      case 2:
        if(dwBufSize>0&&nport.deref()!=-1){
          if(!PLAYM4H.PlayM4_InputData(nport.deref(),pBuffer,dwBufSize)){
            //console.log('err');
            break;
          }
        }
        //console.log('err3');
      break;
      default:
        if(dwBuferSize>0&&nport.deref()!=-1){
          if(!PlayM4_InputData(nPort.deref(),pBuffer,dwBuffSize)){
            break;
          }
        }
        break;
      }
  });
  var fExceptionCallBack=new ffi.Callback('pointer',[DWORD,Long,Long,'pointer'],function(dwType,UserIdone,onehandel,onepuser){
    var tempbuff=Buffer.alloc(256);
    var dwTypeHex=dwType.toString(16);
    switch (dwTypeHex)
    {
      case 8005:
        break;
      default:
        break;
    }
  });
  var struDeviceV30=ref.alloc(NET_DVR_DEVICEINFO_V30);
  
  var oneUserId=HC_NETFFI.NET_DVR_Login_V30("192.168.5.63",8000,"admin","12345",struDeviceV30);
  var er=HC_NETFFI.NET_DVR_GetLastError();
  if(oneUserId<0){
    console.log('oneUserId is error');
    HC_NETFFI.NET_DVR_Cleanup();
    return ;
  }
  HC_NETFFI.NET_DVR_SetExceptionCallBack_V30(0,null,fExceptionCallBack,null);
  var struPlayInfo1=ref.alloc(NET_DVR_PREVIEWINFO,0);
  struPlayInfo1=struPlayInfo.ref();
  //console.log(struPlayInfo1.deref());
  var oneRealPlayHandle=HC_NETFFI.NET_DVR_RealPlay_V40(oneUserId,struPlayInfo1,fRealDataCallBack,null);
  var er=HC_NETFFI.NET_DVR_GetLastError();
  //console.log(er);
  //console.log(oneRealPlayHandle);
  //var savefile=HC_NETFFI.NET_DVR_SaveRealData(oneRealPlayHandle,'/home/lees/test/ExpressApp/video/hkvision');
  process.on('exit',function(){
    fRealDataCallBack;
  });
  }
}
//var stopfile=HC_NETFFI.NET_DVR_StopSaveRealData(oneRealPlayHandle);
hkvisionffi.super_ = EventEmitter;
hkvisionffi.prototype = Object.create(EventEmitter.prototype, {
constructor: {
  value: hkvisionffi,
  enumerable: false
}
});
module.exports=hkvisionffi;