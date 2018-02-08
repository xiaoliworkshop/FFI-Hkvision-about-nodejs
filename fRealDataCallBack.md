 var count=0;
  var bufferType2=ref.refType(ref.types.uchar);
  var nportType=ref.types.int32;
  var nport=ref.alloc(nportType);
  var fRealDataCallBack=null;
  qbuf11=ref.refType('byte');
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
        if(dwBuferSize>0&&nport.deref()!=-1){
          if(!PlayM4_InputData(nPort.deref(),pBuffer,dwBuffSize)){
            break;
          }
        }
        break;
      }
  });