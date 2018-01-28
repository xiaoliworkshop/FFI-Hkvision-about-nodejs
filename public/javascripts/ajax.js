var connect=null;
function Connect(serverIP, serverPort) {
	this.socket = null;
	this.serverIP = serverIP;
	this.serverPort = serverPort;
}
$(document).ready(function(){
    $('#button2').click(function(){
    alert("stream is ready");
    connect=new Connect('127.0.0.1',3000);
        //alert(connect.serverIP);
        //alert(connect.serverPort);
    connect.initSocket();
});

    $("#button1").click(function(){
        //event.preventDefault();
        $.ajax({
            url:'/videocanvas',
            type:'get',
            dataType:'json',
            success:function(data){
                alert(data);
                var stringdata=JSON.stringify(data);
                alert(stringdata);
                $('#stream-container').after("<p>"+stringdata+"</p>");
            },
            error:function(err){
                alert('error');
            },
        })
        });
});
Connect.prototype.initSocket=function(){
    alert(this.serverIP);
    alert(this.serverPort);
    this.socket=io('127.0.0.1:3000');
    //this.socket.emit('click3');
    this.socket.on('connect',function(){
        alert("socket connected to http://"+connect.serverIP+":"+connect.serverPort);
    });
    this.socket.on('canvas',function(data){
        try{
            var canvas = document.getElementById('videostream');
            var context = canvas.getContext('2d');
			imageObj.src = "data:image/jpeg;base64,"+data;
			imageObj.onload = function(){
                canvas.height = imageObj.height;
                canvas.width = imageObj.width;
                context.height=imageObj.height;
                context.width=imageObj.width;
				context.drawImage(imageObj,0,0,context.width,context.height);
            }
        }
        catch(e){}
    });
    this.socket.on('disconnect',function(exception){
        console.log("socket disconnect");
    });
};
