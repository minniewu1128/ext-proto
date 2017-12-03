var socket = io.connect('/')
var streamer = io.connect('/streamer');
console.log('streamer connected', streamer)
 
$(function(){
   $('button.timer').click(function(event){
        
        if($('button.timer').hasClass('is-primary')){
           // timer is on
            $('button.timer').text('Timer: Off');
            }
        else{
            $('button.timer').text('Timer: On');
            }
        $('button.timer').toggleClass('is-primary')
    //    else(){
    //        $
    //    }
       socket.emit('toggle-timer',{event: 'toggle timer'} )
       console.log('emitted timer event')
        
       })
})
