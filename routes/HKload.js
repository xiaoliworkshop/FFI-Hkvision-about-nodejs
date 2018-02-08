var ffi=require('ffi');
var refarray=require('ref-array');
var ref=require('ref');
var StructType=require('ref-struct');
var EventEmitter=require('events').EventEmitter;

function hkvisionffi(){
  var DWORD=ref.types.ulong;
  var Long=ref.types.long;
  var HWND=ref.types.long;
  var uInt=ref.types.uint;
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
var fLoginResultCallBack=null;
fLoginResultCallBack=new ffi.Callback('void',[Long,DWORD,'pointer','pointer'],function(UserId,Result,V30_ptr,usrdata){
  var callbackLogin=new UserLoginResult;
  callbackLogin.oneUserId=UserId;
  callbackLogin.dwResult=Result;
  callbackLogin.onepDeviceInfo=V30_ptr;
  callbackLogin.pUser=usrdata;
});
var NET_DVR_JPEGPARA=StructType({
  wPicSize:ref.types.uint,
  wPicQuality:ref.types.uint,
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
var HC_NETFFI=ffi.Library('./libhcnetsdk',{
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
  NET_DVR_SaveRealData:['bool',[Long,'string']],
  NET_DVR_CaptureJPEGPicture_NEW:['bool',[Long,Long,"pointer", "pointer",DWORD,"pointer"]],   //设备抓图
  NET_DVR_CapturePictureBlock_New:['bool',[Long,"pointer",DWORD,"pointer"]],
  NET_DVR_StopSaveRealData:['bool',[Long]]
});
var PLAYM4H=ffi.Library('./libPlayCtrl',{
  PlayM4_GetPort:['bool',['pointer']],
  PlayM4_SetStreamOpenMode:['bool',[Long,DWORD]],
  PlayM4_OpenStream:['bool',[Long,'pointer',DWORD,DWORD]],
  PlayM4_Play:['bool',[Long,Long]],
  PlayM4_SetDecCallBack:['bool',[Long,'pointer']],
  PlayM4_InputData:['bool',[Long,'pointer',DWORD]],
  PlayM4_GetJPEG:['bool',['long',"pointer",DWORD,"pointer"]],
  PlayM4_ConvertToJpegFile:['bool',['string',Long,Long,Long,Long,'string']],
  PlayM4_SetJpegQuality:['bool',[Long]]
});
this.DVR_Init=function(){
  return HC_NETFFI.NET_DVR_Init();
};
this.DVR_SetConnectTime=function(dword,dword){
  return HC_NETFFI.NET_DVR_SetConnectTime(dword,dword);
};
this.DVR_SetReconnect=function(dword,bool1){
  return HC_NETFFI.NET_DVR_SetReconnect(dword,bool1);
};
this.getplayinfo=function(){
  return struPlayInfo=new NET_DVR_PREVIEWINFO;
};
this.DVR_RealPlay_V40=function(UserId1,pPreviewInfo,fRealcallback,pUser2){
  return HC_NETFFI.NET_DVR_RealPlay_V40(UserID1,pPreviewInfo,fRealcallback,pUser2);
};
this.DVR_StopRealPlay=function(hwnd){
  return HC_NETFFI.NET_DVR_StopRealPlay(hwnd);
};
this.DVR_Logout=function(userid3){
  return HC_NETFFI.NET_DVR_Logout(userid3);
};
this.DVR_Cleanup=function(){
  return HC_NETFFI.NET_DVR_Cleanup();
};
this.DVR_SetExceptionCallBack_V30=function(reserved1,reserved2,cvexception,userdata1){
  return HC_NETFFI.NET_DVR_SetExceptionCallBack_V30(reserved1,reserved2,cvexception,userdata1);
};
this.createDeviceinfo=function(){
  var dev_infoptr=ref.alloc(NET_DVR_DEVICEINFO_V30);
  return dev_infoptr;
};
this.DVR_Login_V30=function(dSvrip,wDVRPort,susername,spassword,pDevicein){
  return HC_NETFFI.NET_DVR_Login_V30(dSvrip,wDVRPort,susername,spassword,pDevicein);
};
this.DVR_GetLastError=function(){
  return HC_NETFFI.NET_DVR_GetLastError();
};
this.DVR_SaveRealData=function(realhandle,sfilename){
  return HC_NETFFI.NET_DVR_SaveRealData(realhandle,sfilename);
};
this.getDvr_JpegPARA=function(){
  return new NET_DVR_JPEGPARA;
};
this.DVR_CaptureJPEGPicture_NEW=function(userid4,channel2,pJpegPara,sJpegPicBuffer,dwPicSize,pSizeReturned){
  return HC_NETFFI.NET_DVR_CaptureJPEGPicture_NEW(userid4,channel2,pJpegPara,sJpegPicBuffer,dwPicSize,pSizeReturned);
};
this.DVR_CapturePictureBlock_New=function(realHandle3,picbuf1ptr,dwpicsize1,pSizereturned2ptr){
  return HC_NETFFI.NET_DVR_CapturePictureBlock_New(realHandle3,picbuf1ptr,dwpicsize1,pSizereturned2ptr);
};
this.DVR_StopSaveRealData=function(realhandle4){
  return HC_NETFFI.NET_DVR_StopSaveRealData(realhandle4);
};
this.GetPort=function(nport1ptr){
  return PLAYM4H.PlayM4_GetPort(nport1ptr);
};
this.SetStreamOpenMode=function(nport2,nMode){
  return PLAYM4H.PlayM4_SetStreamOpenMode(nport2,nMode);
};
this.OpenStream=function(nport3,Fileheadbufptr,nsize2,nbufpoolsize){
  return PLAYM4H.PlayM4_OpenStream(nport3,Fileheadbufptr,nsize2,nbufpoolsize);
};
this.Play=function(nport4,hwnd1){
  return PLAYM4H.PlayM4_Play(nport4,hwnd1);
};
this.createFrameInfoPtr=function(){
  var infoptr=ref.alloc(FRAME_INFO);
  return infoptr;
}
this.SetDecCallBack=function(nport2,fDecCBFUN){
  return PLAYM4H.PlayM4_SetDecCallBack(nport2,fDecCBFUN);
};
this.InputData=function(nport5,bufptr,nsize3){
  return PLAYM4H.PlayM4_InputData(nport5,bufptr,nsize3);
};
this.GetJPEG=function(nport5,pjpegptr,nbufsize,jpegsizeptr){
  return PLAYM4H.PlayM4_GetJPEG(nport5,pjpegptr,nbufsize,jpegsizeptr);
};
this.ConvertToJpegFile=function(bufptr2,nsize4,nwidth,nheight,ntype2,sfilenameptr){
  return PLAYM4H.PlayM4_ConvertToJpegFile(bufptr2,nsize4,nwidth,nheight,ntype2,sfilenameptr);
};
this.getNet_userlogininfo=function(){
  this.UserLogin=null;
  return UserLogin=new NET_DVR_USER_LOGIN_INFO;
}
this.getVideo=function(IP,portvalue,username,pwd,struPlayInfo,callback){
  var Net_Dvr=refarray(NET_DVR_USER_LOGIN_INFO);
  var initOk=HC_NETFFI.NET_DVR_Init();
  //console.log(initOk);
  var setconOK=HC_NETFFI.NET_DVR_SetConnectTime(2000,1)
  //console.log(setconOK);
  var reconOK=HC_NETFFI.NET_DVR_SetReconnect(10000,1);
  var refthis=this;
  EventEmitter.call(refthis);
  var oneUserId;
  var fExceptionCallBack=new ffi.Callback('void',[DWORD,Long,Long,'pointer'],function(dwType,UserIdone,onehandel,onepuser){
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
  var oneUserId=HC_NETFFI.NET_DVR_Login_V30(IP,portvalue,username,pwd,struDeviceV30);
  var er=HC_NETFFI.NET_DVR_GetLastError();
  if(oneUserId<0){
    console.log('oneUserId is error');
    HC_NETFFI.NET_DVR_Cleanup();
    return ;
  }
  HC_NETFFI.NET_DVR_SetExceptionCallBack_V30(0,null,fExceptionCallBack,null);
  var struPlayInfo1=ref.alloc(NET_DVR_PREVIEWINFO,0);
  struPlayInfo1=struPlayInfo.ref();
  var pJpeg=new Buffer(1000000);
  pJpeg.type=ref.types.byte;
  var pJpegSize=Buffer.alloc(10,0);
  pJpegSize.type=ref.types.uint32;
  var bufferType2=ref.refType(ref.types.uchar);
  var DecCBFUN=new ffi.Callback('void',[Long,bufferType2,Long,FRAME_INFOPtr,Long,Long],function(nport1,pbuf1,nSize,pFrameInfo,nReserved1,nReserved2){
    //wd=pFrameInfo.deref().nWidth;
    //ht=pFrameInfo.deref().nHeight;
    //console.log(wd);
    //console.log(ht);
    //ar solar=wd*ht;
    //var quality=352*288/solar;
   // PLAYM4H.PlayM4_SetJpegQuality(quality);
    var bool=PLAYM4H.PlayM4_GetJPEG(nport1,pJpeg,1000000,pJpegSize);
    var jpegbuf=Buffer.alloc(pJpegSize.deref());
    jpegbuf.writeUInt8(0,0);
    jpegbuf.type=ref.types.byte;
    //console.log(pJpegSize.deref());
    pJpeg.copy(jpegbuf,0,0,pJpegSize.deref());
    //console.log(jpegbuf);
    callback(jpegbuf);
  });
  var nportType=ref.types.int32;
  var nport=ref.alloc(nportType,0);
  var fRealDataCallBack=null;
  var qbuf11=ref.refType('byte');
  fRealDataCallBack=new ffi.Callback('void',[Long,DWORD,qbuf11,'ulong','pointer'],function(RealHandle2,dwDataType,pBuffer,dwBufSize,PUser1){
    pJpeg.writeUInt8(0,0);
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
        if(!PLAYM4H.PlayM4_SetDecCallBack(nport.deref(),DecCBFUN)){
          break;
        }
      break;
    case 2:
      if(dwBufSize>0&&nport.deref()!=-1){
        if(!PLAYM4H.PlayM4_InputData(nport.deref(),pBuffer,dwBufSize)){
          break;
        }
      }
      break;
    default:
        if(dwBufSize>0&&nport.deref()!=-1){
          if(!PLAYM4H.PlayM4_InputData(nport.deref(),pBuffer,dwBufSize)){
            break;
          }
        }
      break;
    }
  });
  var oneRealPlayHandle=HC_NETFFI.NET_DVR_RealPlay_V40(oneUserId,struPlayInfo1,fRealDataCallBack,null);
  var er=HC_NETFFI.NET_DVR_GetLastError();
  process.on('exit',function(){
    fRealDataCallBack;
  });
  }
}
hkvisionffi.super_ = EventEmitter;
hkvisionffi.prototype = Object.create(EventEmitter.prototype, {
constructor: {
  value: hkvisionffi,
  enumerable: false
}
});
module.exports=hkvisionffi;