// Store the Search City Value & API Key, Set Data Variable
var city = $('#searchValue').val();
const apiKey = '&appid=55c2aaa51a8ed764680bc6f9d89bd204';
var date = new Date();

// Event Listener for Enter Key After City Name is Entered
$('#searchValue').keypress(function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $('#searchBtn').click();
    }
});

// On Click Event Listener on Search Button after City Name is Entered
// Executes API Query for City and Returns Desired Values
$('#searchBtn').on('click', function () {
    $('#forecastH5');
    // Search Value from City Search Input
    city = $('#searchValue').val();
    // Clear City Input Box After Search is Initiated
    $('#searchValue').val('');

    // Execute API Search & Return Data
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + apiKey,
        method: 'GET'
    }).then(function (response) {
        console.log(response)
        // Save Current City Search to a List in the Search Section on the HTML
        makeList();

        // Run Current Conditions Function & Display in 'Today' Section on HTML
        getCurrentConditions(response);

        // Run 5-Day Forecast Function & Display in '5-Day Forcast' Section on HTML
        getCurrentForecast(response);
    })
});

// Function to Create a List of Previously Searched Cities
function makeList() {
    var listItem = $('<li>').addClass('list-group-item list-item').text(city);
    $('.list').append(listItem);
}

// Function to Display the Weather for the Searched City for 'Today' in Main Section
function getCurrentConditions(response) {
    // Get and Convert Temperature to Degrees Farenheit
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    // Rounds Temperature to the Nearest Degree
    tempF = Math.round(tempF);

    // Removes Existing Content & Child Nodes from the 'Today' Div
    $('#today').empty();

    // Get, Format, and Add Current Forcast Data to 'Today' Div
    $('#today').append(
        $('<img>').addClass('weather-img').attr('src', 'https://openweathermap.org/img/w/' + response.weather[0].icon + '.png'),
        $('<h4>').addClass('card-title').text(response.name),
        $('<h5>').addClass('card-title').text(date.toLocaleDateString('en-US')),
        $('<p>').addClass('card-text').text('Temperature: ' + tempF + ' °F'),
        $('<p>').addClass('card-text').text('Humidity: ' + response.main.humidity + '%'),
        $('<p>').addClass('card-text').text('Wind Speed: ' + response.wind.speed + ' MPH')
    )

    // Get Latitude and Longitude for Searched City
    var cityLon = response.coord.lon;
    var cityLat = response.coord.lat;
    console.log(cityLon, cityLat);

    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?lat=${cityLat}&lon=${cityLon}&units=imperial&exclude=minutely,hourly${apiKey}`,
        method: 'GET',
    }).then(function (uvi) {
        console.log(uvi);


        $('#today').append(
            $('<p>').addClass('card-text').text('UV Index: ' + uvi.value + ' of 10')
        )
    })
}

// Function to Create and Display the 5-Day Forecast
function getCurrentForecast() {

    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial${apiKey}`,
        method: 'GET'
    }).then(function (response) {

        // Removes Existing Content & Child Nodes from the '5-Day Forecast' Div
        $('#forecast').empty();



        // Create For Loop to Capture Forecast Data for 'Today'+1 through 'Today'+5
        for (var i = 5; i < 40; i += 8) {
            var results = response.list

            // Get, Format, and Add Current Forcast Data to '5-Day Forecast' Div
            $('#forecast').append(
                $('<div>').addClass('card mr-2  ml-3 forecast-card').append(
                    $('<div>').addClass('card-body').append(
                        $('<h5>').addClass('card-title').text(new Date(results[i].dt_txt).toLocaleDateString('en-US')),
                        $('<img>').addClass('forecast-img').attr('src', 'https://openweathermap.org/img/w/' + results[i].weather[0].icon + '.png'),
                        $('<p>').addClass('card-text').text('Temperature: ' + Math.round(results[i].main.temp) + ' °F'),
                        $('<p>').addClass('card-text').text('Humidity: ' + results[i].main.humidity + '%')
                    )
                )
            )
        }
    });
}