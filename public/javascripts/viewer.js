// socket things
var socket = io.connect('/')
var viewer = io.connect('/viewer')
console.log('viewer connected', io)

socket.on('toggle-timer', function(event){
    console.log('toggle timer event detected')
    $('.timer').toggle();

})

socket.on('toggle-money-raised', function(event){
    console.log('toggle money raised detected')
    $('#money-raised').toggle();
})

socket.on('toggle-top-donors', function(event){
    $('#top-donors').toggle();
})

socket.on('toggle-recent-donors', function(event){
    $('#recent-donors').toggle();
})

socket.on('toggle-goal', function(event){
    $('#goal').toggle();
})



socket.on('set-stream-info', function(event){
    $('#donate-to').text(`Donating at: ${event.donateTo}`);
    $('#supporting').text(`Supporting: ${event.suporting}`);
    $('#now').text(`Now: ${event.now}`);
    $('#next').text(`Next: ${event.next}`)

})

socket.on('set-goal', function(event){
    $('#goal').text(`Goal: $${event.goal}`)
})

$(function(){
    
    socket.on('set-timer', function(event){
        console.log('dateTime', event.dateTime)
        $('#timer').countdown(event.dateTime, function(e){
            $(this).html(e.strftime('%-w w, %-d d,  %-H:%M:%S'));
        })
    })
    // make ajax request
    $.ajax({
        url: "/scrape/https%3A%2F%2Fwww.crowdrise.com%2Finternational-day-of-the-girl",
        type: 'GET',
        success: function (result){
            console.log(result.donors)
            // recent donors
            // design challenge: name is too long to display money quantity as well without interfering from the stream

            var top_donations = getTopDonations(result)
            console.log('top donations', top_donations)
            var j = 0
            var top_donors = {donors:[]}
            while(j<5){
                
                for (var a = 0; a<result.donors.length; a++){
                    var numAmount = parseInt(result.donors[a].amount.slice(1), 10)
                    // if donation amount is equal to top donation amount and donor is not already in top_donors
                    if(numAmount==top_donations[j] && !inTopDonors(top_donors, result.donors[a].name)){
                        top_donors.donors.push(result.donors[a])
                    }
                }
                j++;
            }
            console.log('top_donors', top_donors)
            for(var i=0; i< 5; i++){
                var recent_donors = `<p>
                        ${result.donors[i].name}
                        </p>
                        `
                $('#recent-donors').append(recent_donors);

                var top_donators = `<p>
                                    ${top_donors.donors[i].name}: ${top_donors.donors[i].amount}
                                  </p>`
                $('#top-donors').append(top_donators);
                
            }


        }
    })
        
    
    $('button.overlay-control').click(function(event){
        if($('button.overlay-control').hasClass('is-primary')){
            $('button.overlay-control').text('Stream Overlay: Off')
        }
        else{
            $('button.overlay-control').text('Stream Overlay: On')
        }
        $('.donator-info').toggle();
        $('.timer').toggle();
        $('.overlay').toggle();
        $('button.overlay-control').toggleClass('is-primary')
        $('.stream-info').toggle();
    })
})

function getTopDonations(json) {
    var toSort = []
    for (var i=0; i< json.donors.length; i++){
        // find the 5 people with the highest donation numbers and order from greatest to least
        if(json.donors[i].amount!==' '){
            var numAmount = parseInt(json.donors[i].amount.slice(1), 10)
            
            // if it is a number
            if(!isNaN(numAmount)){
                toSort.push(numAmount)
            }
        }
    }
    var sorted = toSort.sort(function(a, b){return b-a});
    var topDonors = []
    // go through sorted list to find donors with the highest matching donation numbers
    // for (var j=0; j<5; j++){
    //     for (var h=0; h<json.donors.length; h++){
    //         if(json.donors[h].amount.slice(1) == sorted[j]){
    //             topDonors.push(json.donors[h])
    //         }
            
    //     }
    // }
    return sorted
}

function inTopDonors(top_donors, name){
    for(var i=0; i<top_donors.donors.length; i++){
        if(top_donors.donors[i].name == name){
            return true
        }
    }
    return false
}
// var td = {donors:[{name: 'hi', amount: '$50'},
//                    {name: 'minnie', amount: '$20'}]}
// console.log("testing inTopDonors", inTopDonors(td, 'minnie'))