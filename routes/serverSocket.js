exports.init = function(io) {
    var socket = io.of('/')
    var streamer = io.of('/streamer')
    var viewer = io.of('/viewer')
    var currentUsers = 0; // keeps track of number of users in the room

    // When a new connection is initiated
        streamer.on('connection', function(socket){
            console.log('a streamer connected',socket.id);

            socket.on('disconnected', function(){
            console.log('a streamer has disconnected')
            })

        })

        viewer.on('connection', function(socket){
            console.log('a viewer as connected', socket.id);

            socket.on('toggle-timer', function(data){
                console.log('toggle timer in viewer', data.event)
            })

            socket.on('disconnected', function(){
                console.log('a viewer as disconnected')
            })
        })
        io.sockets.on('connection', function(socket){
            ++ currentUsers;
            
            // Send ('emit a 'user_connected' event back to the socket that just connected.)
            socket.emit('users_connected', {number: currentUsers});

            /* Emit user_connected events also to all (i.e. broadcast) other connected sockets.
             * Broadcast is not emitted back to the current (i.e. "this" connection)
            */
            socket.broadcast.emit('users_connected', {number: currentUsers});

            socket.on('toggle-timer', function(data){
                console.log('toggle timer in io.sockets', data.event)
                // emit event to viewer
                socket.emit('toggle-timer', {events:'toggle-timer'})
                socket.broadcast.emit('toggle-timer', {event:'toggle-timer'})
            })

            socket.on('message', function(data){
                console.log('data.message', data.message)
                socket.emit('message', data);
                socket.broadcast.emit('message', data)
            })
            // When this socket is disconnected, decrement numberof users and emit an event to all other sockets.
            socket.on('disconnect', function(){
                -- currentUsers;
                socket.broadcast.emit('users_connected', {number: currentUsers});
            })
        });
 

}