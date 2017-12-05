// socket things
var socket = io.connect('/')
var viewer = io.connect('/viewer')
console.log('viewer connected', io)
var tDonors;

socket.on('toggle-timer', function(event){
    console.log('toggle timer event detected')
    $('.timer').toggleClass('config-on');
    if($('.timer').hasClass('config-on') && $('button.overlay-control').hasClass('is-primary')){
        $('.timer').show();
    }
    else($('.timer').hide());
})

socket.on('toggle-money-raised', function(event){
    $('.money-raised').toggleClass('config-on');
    if($('.money-raised').hasClass('config-on') && $('button.overlay-control').hasClass('is-primary')){
        console.log('turn money raised on')
        $('.money-raised').show();
    }
    else{
        $('.money-raised').hide();
    }
})

socket.on('toggle-top-donors', function(event){
    $('#top-donors').toggleClass('config-on');
    if($('#top-donors').hasClass('config-on') && $('button.overlay-control').hasClass('is-primary')){
        $('#top-donors').show();
    }
    else($('#top-donors').hide());
})

socket.on('toggle-recent-donors', function(event){
    $('#recent-donors').toggleClass('config-on');
    if($('#recent-donors').hasClass('config-on') && $('button.overlay-control').hasClass('is-primary')){
        $('#recent-donors').show();
    }
    else{
        $('#recent-donors').hide()
    };
})

socket.on('toggle-goal', function(event){
    $('.goal').toggleClass('config-on');
    if($('.goal').hasClass('config-on') && $('button.overlay-control').hasClass('is-primary')){
        console.log('turn goal on')
        $('.goal').show();
    }
    else{
        $('.goal').hide()
    };
})

socket.on('toggle-stream-info', function(event){
    $('.stream-info').toggleClass('config-on');
    if($('.stream-info').hasClass('config-on') && $('button.overlay-control').hasClass('is-primary')){
        $('.stream-info').show();
    }
    else {
        $('.stream-info').hide();
    };
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

    
    //assume overlay is off in the begging, hide all components
    if($('button.overlay-control').hasClass('is-primary')){
        if ($('#top-donors').hasClass('config-on')){
            $('#top-donors').show();
        }
        else{
            $('#top-donors').hide();
        }
        if ($('#recent-donors').hasClass('config-on')){
            $('#recent-donors').show();
        }
        else{
            $('#recent-donors').hide();
        }
        if($('.timer').hasClass('config-on')){
            $('.timer').show();
        }
        else{
            $('.timer').hide();
        }
        if($('.stream-info').hasClass('config-on')){
            $('.stream-info').show();
        }
        else{
            $('.stream-info').hide();
        }
        if($('.goal').hasClass('config-on')){
            $('.goal').show(); }
        else{
            $('.goal').hide();
        }

        if($('.money-raised').hasClass('config-on')){
            $('.money-raised').show()
        }
        else {
            $('.money-raised').hide();
        }
    }
    else {
        console.log('big else hide statement')
        $('.money-raised').hide();
        $('.timer').hide();
        $('#top-donors').hide();
        $('#recent-donors').hide();
        $('.stream-info').hide();
        $('.goal').hide();
    }

    
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
            updateTopDonors(top_donors)
            for(var i=0; i< 5; i++){
                var recent_donors = `<p>
                        ${result.donors[i].name}
                        </p>
                        `
                $('#recent-donors').append(recent_donors);

                var top_donators_abbrev = top_donors.donors[i].name.slice(0,3) + '.'
                var top_donators = `<p>
                                    ${top_donors.donors[i].name}: ${top_donors.donors[i].amount}
                                  </p>`
                $('#top-donors').append(top_donators);
                
            }

            // load initial money raised
            $('#money-raised').text(`Amount Raised: ${result.amountRaised}`);


        }
    })
        
    
    $('button.overlay-control').click(function(event){
        // if overlay is on, clicking it turns it off and hides everything
        if($('button.overlay-control').hasClass('is-primary')){
            $('button.overlay-control').text('Stream Overlay: Off')
            $('#top-donors').hide();
            $('#recent-donors').hide();
            $('.timer').hide();
            $('.stream-info').hide();
            $('.goal').hide();
            $('.money-raised').hide();
            
        }
        else{
            // if overlay is off, clicking turns it on and shows the components that the streamer
            // wants to display
            $('button.overlay-control').text('Stream Overlay: On')
            if ($('#top-donors').hasClass('config-on')){
                $('#top-donors').show();
            }
            if ($('#recent-donors').hasClass('config-on')){
                $('#recent-donors').show();
            }
            if($('.timer').hasClass('config-on')){
                $('.timer').show();
            }
            if($('.stream-info').hasClass('config-on')){
                $('.stream-info').show();
            }
            if($('.goal').hasClass('config-on')){
                $('.goal').show(); }
            if($('.money-raised').hasClass('config-on')){
                $('.money-raised').show();       
            }       
            }
        
        $('button.overlay-control').toggleClass('is-primary')

        
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

function updateTopDonors(donors){
    tDonors = donors;
    console.log('top donors now in global', tDonors);
}