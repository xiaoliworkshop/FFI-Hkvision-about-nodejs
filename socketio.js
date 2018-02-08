var socketio={};
var socket_io=require('socket.io');
socketio.getSocketio=function(server){
    var io=socket_io.listen(server);
    this.video1=function(frame){
      //console.log('333');
      io.sockets.emit('canvas',frame);
  }
}
module.exports=socketio;