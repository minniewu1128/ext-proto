var socket = io.connect('/');
console.log('connected')

socket.on('users_connected', function(data){
    $('#numUsers').text(data.number);
});

socket.on('message', function(data){
    console.log('message received')

    $('#chat-stream').append(
        `<p>${data.message}</p>`
    )
});