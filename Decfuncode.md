  /*var DecCBFUN=new ffi.Callback('void',[Long,bufferType2,Long,FRAME_INFOPtr,Long,Long],function(nport1,pbuf1,nSize,pFrameInfo,nReserved1,nReserved2){
      count++;
      var ht=pFrameInfo.deref().nHeight;
      var wd=pFrameInfo.deref().nWidth;
      console.log(nport1);
      var RGB=new Buffer(4*wd*ht);
      RGB.type=ref.types.uchar;
      RGB.writeInt8(0,0);
      yv12_RBG24.YV12_to_RGB32(pbuf1,RGB,wd,ht);
      var bool=PLAYM4H.PlayM4_ConvertToJpegFile(RGB,nSize,wd,ht,0,count+'.jpg');
  });*/
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