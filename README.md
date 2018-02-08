Hkvision node-SDK 文档说明
使用者可以在以下github网址上找到使用案例。
使用前必须将Hkvision-SDK开发包("HCNETSDKCom文件夹","libAudioRender.so","libHCCore.so","libhcnetsdk.so","libhpr.so","libPlayCtrl.so","libSuperRender.so"),放至运行文档根目录下面。才可以进行使用。
基于本接口主要通过ffi来进行封装，所以"ffi"包是必须安装的，并且某些参数设定依赖与node包"ref","ref-struct","ref-array"
Hkvision node-SDK 接口说明：
使用前需将node-SDK实例化：
    var Hkload=require('./HKload');
    hkload=new Hkload();
调用方式例：hkload.DVR_Init();

1)初始化 DVR_Init();
内部封装：《NET_DVR_Init:['bool',[]]=>HC_NETFFI.NET_DVR_Init()》
此函数用于初始化SDK，调用其他SDK的前提。此函数返回bool型参数,ture表示调用成功，false表示调用失败。
SDK官方接口函数:
    BOOL NET_DVR_Init()。

2)DVR_SetConnectTime(dword1,dword2)
内部封装：
NET_DVR_SetConnectTime:['bool',[DWORD,DWORD]]=>HC_NETFFI.NET_DVR_Init()
此函数接口用于设置网络连接时间和连接尝试次数。
第一个参数表示为超时时间，单位为毫秒。
第二个参数表示连接尝试次数。
此函数返回一个bool型参数，true表示成功，false表示失败。
SDK官方接口函数为BOOL NET_DVR_SetConnectTime(DWORD timeout,DWORD timesd)。

3)DVR_SetReconnect(dword,bool1)
内部封装格式：《NET_DVR_SetReconnect:['bool',[DWORD,'bool']]=>HC_NETFFI.NET_DVR_SetReconnect(dword,bool1)》
此函数接口用于设置重连功能
第一个参数表示重连时间，第二个参数用于设定是否重连。此函数返回一个BOOL型，true表示调用成功，false表示调用失败。
SDK官方接口函数为BOOL NET_DVR_SetReconnect()。

4)DVR_Login_V30(dSvrip,wDVRPort,susername,spassword,pDevicein)
内部封装：《NET_DVR_Login_V30:[Long,['string',uInt,'string','string','pointer']]=>HC_NETFFI.NET_DVR_Login_V30(dSvrip,wDVRPort,susername,spassword,pDevicein)》
此函数接口用于用户注册设备
第一个参数表示设备IP地址或是静态域名，字符数量不大于128个，(输入必须是字符串)
第二个参数表示设备端口号(以整形方式输入)
第三个参数表示登陆设备的用户名(字符串输入)
第四个参数表示登陆设备的密码（字符串输入）
第五个参数"pDevicein"用于返回设备信息，使用前需要使用内部函数初始化
var struplayinfo=hkload.createDeviceinfo();
"createDeviceinfo()"函数返回一个用于存储设备信息的结构体。结构体信息可查询Hkvision-SDK官方文档<<设备网络SDK使用手册_V5.2>> 关于内部结构体 NET_DVR_DEVICEINFO_V30即可。
由于此函数第五个参数需要从内部传参，所以hkload.createDeviceinfo()实际返回的是一个指向设备结构体信息的指针类型。
"DVR_Login_V30"函数返回一个"long"型，用于表示播放时的用于ID（userid）；
官方SDK函数表示为
LONG NET_DVR_Login_V30(
    char *sDVRIP,
    WORD wDVRPort,
    char *sUserName,
    char *sPassword,
    LPNET_DVR_DEVICEINFO_V30 1pDeviceInfo
);

5)DVR_RealPlay_V40(UserId1,pPreviewInfo,fRealcallback,pUser2)
内部封装：《NET_DVR_RealPlay_V40:['long',[Long,'pointer','pointer','pointer']]=>HC_NETFFI.NET_DVR_RealPlay_V40(UserID1,pPreviewInfo,fRealcallback,pUser2)》
第一个参数(UserID1)输入用户的ID，通过"DVR_Login_V30"函数获得；
第二个参数(pPreviewInfo)为一个设备播放信息的指针，可以使用以下内部函数进行创建。
var PlayInfo=hkload.getplayinfo();
以上函数返回一个结构体，但是"DVR_RealPlay_V40"需要结构体指针，我们需要使用ref模块来获得其指针如下：
var pPreviewInfo=PlayInfo.ref();与"hkload.createDeviceinfo()"得到的指针不同的是此函数用于设备播放信息输入。我们可以通过以下方式输入设备信息。如：
     PlayInfo.Channel1=1;
     PlayInfo.dwStreamType=0;
     PlayInfo.dwLinkMode=0;
     PlayInfo.hPlayWnd=null;
如何设置输入结构体PlayInfo信息，详情请见Hkvision官方文档<<设备网络SDK使用手册_V5.2>>，查询 "NET_DVR_PREVIEWINFO"。
第三个参数(fRealDataCallBack)用来设置回调函数，设置方式如下：
    var fRealDataCallBack=null;
    var qbuf11=ref.refType('byte');
    fRealDataCallBack=new ffi.Callback('void',[Long,DWORD,qbuf11,'ulong','pointer'],function(RealHandle2,dwDataType,pBuffer,dwBufSize,PUser1){});
    参数一(RealHandle2)为传入的播放句柄。
    参数二(dwDataType)为传入的数据类型。详情请见官方文档(<<设备网络SDK使用手册_V5.2>>)
    参数三(pBuffer)我们在前面通过"qbuf11=ref.refType('byte')"指明了他的类型。为指向"byte"类型缓冲区的指针
    参数四(dwBufSize)为缓冲区"pBUffer"的大小；
    参数五(pUser1){});为指向用户信息的指针，通常不使用。
    *具体使用案例，可以查看github上的案例。*
第四个参数(pUser2)用来设置指向用户信息的指针，如无特殊要求设为(null)，即可。
官方SDK函数表示为
LONG NET_DVR_RealPlay_V40(
    LONG 1UserID,
    LPNET_DVR_PREVIEWINFO 1pPreviewInfo,
    REALDATACALLBACK fRealDataCallBack_V30,
    void *pUser
);
回调函数表示为 type void(CALLBACK *REALDATACALLBACK)(
    LONG 1RealHandle,
    DWORD dwDataType,
    BYTE *pBuffer,
    DWORD dwBufSize,
    void *pUser
);
此函数返回一个Long型参数为预览句柄。如果返回"-1"表示调用失败。


6)DVR_StopRealPlay(hwnd)
内部封装：《NET_DVR_StopRealPlay:['bool',[Long]]=> HC_NETFFI.NET_DVR_StopRealPlay(hwnd)》
此函数接口用来停止预览，唯一的一个参数（hwnd）为预览句柄，使用"DVR_RealPlay_V40(UserId1,pPreviewInfo,fRealcallback,pUser2)"可以获得相应的预览句柄。此函数返回一个bool型参数，true表示成功，false表示失败。
官方SDK函数表示为:
 BOOL NET_DVR_StopRealPlay(
            LONG 1RealHandle,
        );

7)DVR_Logout(userid3)
内部封装：《NET_DVR_Logout:['bool',[Long]]=>HC_NETFFI.NET_DVR_Logout(userid3)》
此函数用于用户注销，参数(userid3)为用户ID号，可以使用"DVR_Login_V30"来获得。
此函数返回bool型参数，true表示成功，false表示失败。
官方SDK函数表示为：
 BOOL NET_DVR_Logout(
     LONG 1UserID
 );

8)DVR_Cleanup()
内部封装：《NET_DVR_Cleanup:['bool',[]]=>HC_NETFFI.NET_DVR_Cleanup()》
此函数用于释放SDK资源，在程序结束之前调用。
返回bool型参数，true表示成功，false表示失败。
官方SDK函数表示为：
 BOOL NET_DVR_Logout();

9)DVR_SetExceptionCallBack_V30(reserved1,reserved2,cvexception,userdata1)
内部封装：《NET_DVR_SetExceptionCallBack_V30:['bool',[uInt,'pointer','pointer','pointer']]=>HC_NETFFI.NET_DVR_SetExceptionCallBack_V30(reserved1,reserved2,cvexception,userdata1)》
此函数用于注册异常接收，重连等消息的窗口句柄或回调函数。
参数一(reserved1)在windows下表示消息，linux保留；
参数二(reserved2)在表示接受异常信息消息的窗口句柄，linux下该参数保留；
参数三(cvexception)表示异常处理回调函数；
使用以下方式进行使用：
var fExceptionCallBack=new ffi.Callback('void',[DWORD,Long,Long,'pointer'],function(dwType,UserIdone,onehandel,onepuser){}
    参数一(dwType)用于表示异常的消息类型，
    参数二(UserIdone)用于表示登陆ID，
    参数三(1Handle)用于表示出现异常的相应类型的句柄，
    参数四(onepuser)为指向用户数据的指针，
参数四(userdata1)表示用户数据。
DVR_SetExceptionCallBack返回一个bool型，true表示成功，false表示失败；
官方SDK函数：
windows：
    BOOL NET_DVR_SetExceptionCallBack_V30(
        UINT nMessage,
        HWND hwnd,
        fExceptionCallBack cbExceptionCallBack,
        void *pUser
    );
linux:
    BOOL NET_DVR_SetExceptionCallBack_V30(
        UINT reserved1,
        void *reserved2,
        fExceptionCallBack cbExceptionCallback,
        void *pUser
    );
回调函数:
typedef void(CALLBACK *fExceptionCallBack){
    DWORD dwType,
    LONG 1UserID,
    LONG 1Handle,
    void *pUser,
};

10)DVR_SaveRealData(realhandle,sfilename)
内部封装：《NET_DVR_SaveRealData:['bool',[Long,'string']]=>HC_NETFFI.NET_DVR_SaveRealData(realhandle,sfilename)》
此函数用于保存实时流数据，以H.264编码格式进行保存，可以以MP4等格式进行播放。
参数一(realhandle)为播放句柄,通过"DVR_RealPlay_V40(UserId1,pPreviewInfo,fRealcallback,pUser2)"函数获得。
参数二(sfilename)为视频保存路径，必须为一个代表路径的字符串。
官方SDK函数：
BOOL NET_DVR_SaveRealData(
    LONG 1RealHandle,
    char *sFileName
)
此函数返回一个bool型 true表示成功，false表示失败


11)DVR_CaptureJPEGPicture_NEW(
    userid4,
    channel2,
    pJpegPara,
    sJpegPicBuffer,
    dwPicSize,
    pSizeReturned
    );
内部封装：《NET_DVR_CaptureJPEGPicture_NEW:['bool',[Long,Long,"pointer", "pointer",DWORD,"pointer"]]=>HC_NETFFI.NET_DVR_CaptureJPEGPicture_NEW(userid4,channel2,pJpegPara,sJpegPicBuffer,dwPicSize,pSizeReturned)》
单帧数据捕获并且保存成JPEG存放指定内存空间中
参数一(userid4)用户ID，NET_DVR_Login_V30用户登陆的返回值。
参数二(channel2)通道号，由用户指定。
参数三(pJpegPara)指向结构体的指针。
    var DVrjpegpara=hkload.Dvr_JpegPARA();
    Dvr_JpegPARA()创建一个指向结构体，但DVR_CaptureJPEGPicture_NEW()函数需要的是一个指针，我们可以DVrjpegPara.ref()的方式进行输入。
    例:
    var dvrjpeg=DvrjpegPara.ref();
    结构体如下：
    var NET_DVR_JPEGPARA=StructType({
         wPicSize:ref.types.uint,
         wPicQuality:ref.types.uint,
    });
    DVrjpegpara.wPicSize 为图片尺寸。
    Dvrjpegpara.wPicQuality 图片质量系数。
参数四(sJpegPicBuffer)为指向数据缓冲区的指针。
参数五(dwPicSize)数据缓冲区的大小，
参数六(pSizeReturned)返回图片的数据大小，此参数需要传递一个无符号长整形的指针，需要使用ref功能包来指定，例如:var psizereturn=Buffer.alloc(1);
                              psizereturn.type=ref.types.ulong;
                              将psizereturn输入函数，将图片大小通过指针的方式传递出来。
官方SDK函数：
BOOL NET_DVR_CaptureJPEGPicture_NEW(
    LONG 1UserID,
    LONG 1Channel,
    LPNET_DVR_JPEGPARA 1pJpegPara,
    char *sJpegPicBuffer,
    DWORD dwPicSize,
    LPDWORD 1pSizeReturned
);
此函数返回一个bool型参数，true为调用成功，false为调用失败。
结构体 NET_DVR_JPEGPARA详细内容见官方文档<<设备网络SDK使用手册_V5.2>>。

12)DVR_CapturePictureBlock_New(
    realHandle3,
    picbuf1ptr,
    dwpicsize1,
    pSizereturned2ptr
    );
内部封装：《NET_DVR_CapturePictureBlock_New:['bool',[Long,"pointer",DWORD,"pointer"]]
=>HC_NETFFI.NET_DVR_CapturePictureBlock_New(realHandle3,picbuf1ptr,dwpicsize1,pSizereturned2ptr)》
预览时转图并且保存在指定内存中。
参数一(realHandle3)为预览句柄。NET_DVR_RealPlay_V40的返回值。
参数二(picbuf1ptr)保存图片数据的缓冲去的指针，由用户自己分配，
可以使用如下：进行实例化；
var picbufptr=Buffer.alloc(width*height*3/2);
width与height为图像的宽度与高度；
picbuf1ptr.type=ref.types.uchar;
参数三(dwpicsize1)缓冲区的大小，根据之前实例化时分配的空间来定义(width*height*3/2)
参数四(pSizereturned2ptr)返回图片的实际大小，和之前的单帧抓图一样，必须使用指针，故需要以下方式实例化。
                              var psizereturn=Buffer.alloc(1);
                              psizereturn.type=ref.types.ulong;
                              将psizereturn输入函数，将图片大小通过指针的方式传递出来。
官方SDK函数：
BOOL NET_DVR_CapturePictureBlock_NEW(
    LONG 1RealHandle,
    char *pPicBuf,
    DWORD dwPicSize,
    DWORD *1pSizeReturned
);
此函数返回一个bool型，true表示调用成功，false表示调用失败。

13)DVR_StopSaveRealData(realhandle4)
内部封装：《NET_DVR_StopSaveRealData:['bool',[Long]]
=>HC_NETFFI.NET_DVR_StopSaveRealData(realhandle4)》
停止捕获数据，释放相关资源，此函数主要相对于函数"DVR_SaveRealData(realhandle,sfilename)",传入相关句柄"realhandle4"停止保存实时数据的信息。
官方函数：
BOOL NET_DVR_StopSaveRealData(
    LONG 1RealHandle
)
函数返回一个bool型数据，true表示调用成功，false表示调用失败，

14)GetPort(nport1ptr)
内部封装：《PlayM4_GetPort:['bool',['pointer']]=>PLAYM4H.PlayM4_GetPort(nport1ptr)》
此函数用于获取未使用的通道号，参数(nport1ptr)为指向长整形的指针，需要自己开辟空间实例化:var nportptr=Buffer.alloc(1);
              nportptr.type=ref.types.long;
官方函数：
BOOL PlayM4_GetPort(
    LONG* nPort
);
此函数返回bool型参数，true表示成功，false表示失败。

15)SetStreamOpenMode(nport2,nMode)
内部封装：《PlayM4_SetStreamOpenMode:['bool',[Long,DWORD]]=>PLAYM4H.PlayM4_SetStreamOpenMode(nport2,nMode)》
此函数用于设置流模式，参数一(nport2)输入播放通道号，参数2设置播放模式，输入0为安实时流方式播放视频，输入1为以时间戳的方式来播放视频。
官方函数：
    BOOL PlayM4_SetStreamOpenMode(
        LONG nPort,
        DWORD nMode
    );
此函数返回一个bool型参数，true表示调用成功，false表示调用失败。

16)Play(nport4,hwnd1)
内部封装：《PlayM4_Play:['bool',[Long,Long]]=>PLAYM4H.PlayM4_Play(nport4,hwnd1)》
开始播放，播放视频的画面的大小取决于hwnd1播放句柄代表的窗口大小，
参数一(nport4)为播放通道号，参数二(hwnd1)为播放句柄
官方函数：
BOOL PlayM4_Play(
    LONG nPort,
    HWND hWnd
);
成功则返回bool型true，否则返回false。

17)SetDecCallBack(nport2,fDecCBFUN)
内部封装：《PlayM4_SetDecCallBack:['bool',[Long,'pointer']]
=>PLAYM4H.PlayM4_SetDecCallBack(nport2,fDecCBFUN)》
参数一(nport2)输入播放的通道号。
参数二(fDecCBFUN)为调用的回调函数，
回调函数通过如下方式定义：
var DecCBFUN=new ffi.Callback('void',[Long,bufferType2,Long,FRAME_INFOPtr,Long,Long],
function(nport1,
        pbuf1,
        nSize,
        pFrameInfo,
        nReserved1,
        nReserved2){});
    回调函数参数1(nport1)输出播放器通道号
    回调函数参数2(pbuf1)解码后的视频数据指针(char*)(yv12数据格式)
    回调函数参数3(nSize)解码后的音视频数据Buffer的长度
    回调函数参数4(nFrameInfo)指针类型，指向数据结构体(图像每帧信息)
    回调函数参数5(nReserved1)保留参数
    回调函数参数6(nReserved2)保留参数
    pFrameInfo通过以下内部函数进行实例化
    var pFrameInfo=hkload.createFrameInfoPtr();
    以上函数会返回一个指向pFrameInfo结构体的指针类型，会将图像的帧信息放置进相关的内存中。
官方函数：
    BOOL PlayM4_SetDecCallBack(
        LONG nPort,
        DecCBFUN fDecCBFUN
    );
    回调函数:
    typedef void(CALLBACK *DecCBFUN)(
        long nPort,
        char *pBuf,
        long nSize,
        FRAME_INFO *pFrameInfo,
        long nReserved1,
        long nReserved2
    );
本函数返回一个bool型，true表示调用成功，false表示调用失败。

18)InputData(nport5,bufptr,nsize3)
内部封装：《PlayM4_InputData:['bool',[Long,'pointer',DWORD]]
=>PLAYM4H.PlayM4_InputData(nport5,bufptr,nsize3)》
此函数往bufptr缓冲区中输入流数据，
参数一(nport5),表示所用的通道号，参数二(bufptr)表示缓冲区，参数三表示缓冲区大小。
官方函数：
    BOOL PlayM4_InputData(
        LONG nPort,
        PBYTE nBuf,
        DWORD nSize
    );
此函数返回一个bool型，true表示成功，false表示失败。

19)GetJPEG(nport5,pjpegptr,nbufsize,jpegsizeptr)
内部封装：《PlayM4_GetJPEG:['bool',['long',"pointer",DWORD,"pointer"]]
=>PLAYM4H.PlayM4_GetJPEG(nport5,pjpegptr,nbufsize,jpegsizeptr)》
直接抓取图像。放置相关的缓冲区中，
参数一(nport5)播放通道号
参数二(pJpeg)存放JEPG图像的数据地址，由用户分配，不得小于JPEG图像大小，建议大小w*h*3/2,其中w和h分别为图像的宽和高。
实例化：
var pJpeg=Buffer.alloc(w*h*1.5);
pJpeg.type=ref.types.byte;
pJpeg.writeUInt8(0,0);
参数三(nBufSize)申请的缓冲去的大小，通常根据用户自己分配的缓冲区来确定。
参数四(jpegsizeptr)返回获得的图像的实际大小，
由于时指针类型，故用户得自己定义指针:
jpegsizeptr=ref.alloc(ref.types.ulong);
官方函数：
    BOOL PlayM4_GetJPEG(
        LONG nPort,
        PBYTE pJpeg,
        DWORD nBufSize,
        DWORD *pJpegSize
    );
返回一个bool型，true表示成功，false表示失败。

20)ConvertToJpegFile(
    bufptr2,
    nsize4,
    nwidth,
    nheight,
    ntype2,
    sfilenameptr
    )
内部封装：《PlayM4_ConvertToJpegFile:['bool',['string',Long,Long,Long,Long,'string']]
=>PLAYM4H.PlayM4_ConvertToJpegFile(bufptr2,nsize4,nwidth,nheight,ntype2,sfilenameptr)》
此函数，将图像数据转为JPEG格式，并且保存。
参数一(bufptr2)表示内存中存在的图像数据的缓冲区
可以如下定义var bufptr2=Buffer.alloc(size);
            bufptr2.type=ref.types.uchar;
参数二(nsize4)表示图像数据缓冲区的大小
            根据根据以上开辟的Buffer空间来进行分配(size)
参数三(nwidth)表示图像的像素宽度
参数四(nheight)表示图像的像素的高度
参数五(ntype2)表示图像数据的类型，通常为2 ，表示yv12类型的图像数据
参数六(sfilenameptr)string类型，jpeg图像存储的路径
官方函数:
    BOOL PlayM4_ConvertToJpegFile(
        char *pBuf,
        long nSize,
        long nWidth,
        long nHeight,
        long nType,
        char *sFilename
    );
此函数返回一个bool型，true表示成功，flase表示失败。

21)getVideo(IP,portvalue,username,pwd,struPlayInfo,callback)
此函数时唯一一个不属于Hkvision直接封装的函数，如果使用者不想自己通过编程，输出相关图像数据，可以使用此函数。
参数一(IP)设备IP地址 输入为string类型，
参数二(portvalue)设备端口号 输入为int类型，
参数三(username)输入为用户名 输入string类型，
参数四(struPlayInfo)预览设备信息，输入为一结构体，
通过以下方式获得结构体：
    var struPlayInfo=hkload.getplayinfo();
    struPlayInfo.Channel1=1;//定义设备通道号
    struPlayInfo.dwStreamType=0;//定义设备码流类型
    struPlayInfo.hPlayWnd=null;//定义窗口句柄
参数五(callback)为一个回调函数输出一个代表一帧的图像数据，数据格式为jpeg。
使用示例如下：
    var struPlayInfo=hkload.getplayinfo();
    struPlayInfo.Channel1=1;
    struPlayInfo.dwStreamType=0;//从0(主码流)变为1(子码流)以适应web类型的大小
    struPlayInfo.dwLinkMode=0;
    struPlayInfo.hPlayWnd=null;
    hkload.getVideo("192.168.5.63",8000,"admin","12345",struPlayInfo,function(data){                     //回调函数
        var frame=new Buffer(data).toString('base64'); //将图像数据一base64格式进行编码
        io.video1(frame);  //将数据格式通过socket发送至web网页
    })；