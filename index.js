// since were not working with ids we cant use getElementById, we will use querySelector to select the form element with the class of weatherForm
const weatherForm = document.querySelector('.weatherForm'); //querySelector returns first element in class
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');
const apiKey = 'c938cfcbf5c0ee33da56ff06796b0101'; // Api key for OpenWeatherMap API

weatherForm.addEventListener("submit", async event => { //event listener tries submit and runs the event

    event.preventDefault(); //prevent default form submission which refreshes the page and clears the input field

    const city = cityInput.value; // get the value of the input field above

    if (city) { //if city is not empty, call getWeatherData function
        try{
            const weatherData = await getWeatherData(city); //call getWeatherData function to fetch weather data from OpenWeatherMap API and await for the response (note async function is used to handle asynchronous operations)
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city."); //calls displayError function to show error message if input field is empty
    }

});

// data from this function gets sent to eventlistener
async function getWeatherData(city) { //async function to fetch weather data from OpenWeatherMap API

    // api call for city name from OpenWeatherMap website
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`; // make sure you wrap with ` the key above tab

    const response = await fetch(apiURL); //fetch weather data from OpenWeatherMap API and await for the response

    console.log(response); //log the response to the console for debugging purposes

    if(!response.ok){ //if response is not ok (from console), throw an error with the status text
        throw new Error("Could not fetch weather data");
    }

    return await response.json(); //return the response as a JSON object
}

function displayWeatherInfo(data) { //function to display weather data on the webpage

    console.log(data); //log the data to the console for debugging purposes (inspect -> console -> Object (main for the data))

    // how to access data as seen in console {} used for data deconstruction/ accessing files [] is used for arrays.
    const {name: city,
           main: {temp,humidity}, 
           weather: [{description, id}]} = data; //destructure the data object to get the city name, temperature, humidity, weather id and description

    card.textContent = ''; //clear any previous content in the card
    card.style.display = 'flex'; //display the card

    // create elements to display the weather information in div card
    const cityDisplay = document.createElement('h1'); 
    const tempDisplay = document.createElement('p'); 
    const humidityDisplay = document.createElement('p'); 
    const descDisplay = document.createElement('p'); 
    const weatherEmoji = document.createElement('p'); 
    
    //cahnge the text content of the elements to display the weather information from the data object
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp -273.15).toFixed(1)}°C`; //convert temperature from Kelvin to Celsius and round with toFixed to 1 decimal place
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = `${description}`;
    // call getWeatherEmoji function to get the weather emoji based on the weather id from api
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add('cityDisplay'); //add cityDisplay class style from css file to the h1 element
    tempDisplay.classList.add('tempDisplay');
    humidityDisplay.classList.add('humidityDisplay');
    descDisplay.classList.add('descDisplay');
    weatherEmoji.classList.add('weatherEmoji');

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId){

    // switch based on codes from api website documentation https://openweathermap.org/api/weather-conditions#Icon-list
    switch(true){
        case (weatherId >= 200 && weatherId < 300): //thunderstorm
            return '⛈️';
        case (weatherId >= 300 && weatherId < 400): //drizzle
            return '🌦️';
        case (weatherId >= 500 && weatherId < 600): //rain
            return '🌧️';
        case (weatherId >= 600 && weatherId < 700): //snow
            return '❄️';
        case (weatherId >= 700 && weatherId < 800): //atmosphere
            return '🌫️';
        case (weatherId === 800): //clear
            return '☀️';
        case (weatherId > 800 && weatherId < 810): //clouds
            return '☁️';
        default:
            return '🌈'; //default emoji for unknown weather conditions
    }
}

function displayError(message) { //function to display error message on the webpage
    
    const errorDisplay = document.createElement('p'); //create a new paragraph element to display the error message
    errorDisplay.textContent = message;
    errorDisplay.classList.add('errorDisplay'); //add errorDisplay class style from css file to the paragraph element

    card.textContent = ''; //clear any previous content in the card
    card.style.display = 'flex'; //display the card
    card.appendChild(errorDisplay); //append the error message to the card
}