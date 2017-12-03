var socket = io.connect('/')
var streamer = io.connect('/streamer');
console.log('streamer connected', streamer)
 
$(function(){
   $('button.timer').click(function(event){
        
        if($('button.timer').hasClass('is-primary')){
           // timer is on
            $('button.timer').text('Timer: Off');}
        else{
            $('button.timer').text('Timer: On');}
        $('button.timer').toggleClass('is-primary')
       socket.emit('toggle-timer',{event: 'toggle timer'} )
       console.log('emitted timer event')  
       })

    $('button.money-raised').click(function(event){
    
            if($('button.money-raised').hasClass('is-primary')){
                $('button.money-raised').text('Money Raised: Off')
            }
            else{
                $('button.money-raised').text('Money Raised: On')
            }
            $('button.money-raised').toggleClass('is-primary')
            socket.emit('toggle-money-raised', {event: 'toggle money'})
            console.log('emitted money raised')
        })

    $('button.goal').click(function(event){
        //logic to submit form
        if($('button.goal').hasClass('is-primary')){
            $('button.goal').text('Goal: Off')
        }
        else{
            $('button.goal').text('Goal: On')
        }
        $('button.goal').toggleClass('is-primary')
        socket.emit('toggle-goal', {event: 'toggle goal'})
        console.log('emitted goal')
    })
    
    $('button.top-donors').click(function(event){

        if($('button.top-donors').hasClass('is-primary')){
            $('button.top-donors').text('Top Donors: Off')
        }
        else{
            $('button.top-donors').text('Top Donors: On')
        }
        $('button.top-donors').toggleClass('is-primary')
        socket.emit('toggle-top-donors', {event: 'toggle top donors'})
        console.log('emitted top donor event')
    })

    $('button.recent-donors').click(function(event){
        
        if($('button.recent-donors').hasClass('is-primary')){
            $('button.recent-donors').text('Recent Donors: Off')
        }
        else{
            $('button.recent-donors').text('Recent Donors: On')
        }
        $('button.recent-donors').toggleClass('is-primary')
        socket.emit('toggle-recent-donors', {event: 'toggle recent donors'})
        console.log('emitted recent donor event')
    })

})
