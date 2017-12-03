var socket = io.connect('/')
var streamer = io.connect('/streamer');
console.log('streamer connected', streamer)
 
$(function(){
   $('button').click(function(event){
       socket.emit('toggle-timer',{event: 'toggle timer'} )
       console.log('emitted timer event')
        
       })
})
