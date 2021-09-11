const APIURL = 'https://goweather.herokuapp.com/weather/';

const citynameEl = document.getElementById('cityname');
const temperatureEl = document.getElementById('temperature');
const dateEl = document.getElementById('date');
const citysearch = document.getElementById('citysearch');
const form = document.getElementById('form');
const windspeed = document.getElementById('windspeed');
const unit = document.getElementById('unit');
const description = document.getElementById('description');
const population = document.getElementById('population');
const day1 = document.getElementById('day1');
const day2 = document.getElementById('day2');
const day3 = document.getElementById('day3');
const day1temp = document.getElementById('day1temp');
const day2temp = document.getElementById('day2temp');
const day3temp = document.getElementById('day3temp');
const day1wind = document.getElementById('day1wind');
const day2wind = document.getElementById('day2wind');
const day3wind = document.getElementById('day3wind');

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var d = new Date();

var date = dayNames[d.getDay()] + ", " + monthNames[d.getMonth()] + ' ' + d.getDate() + 'th, ' + d.getFullYear();

days = [day1, day2, day3]
for (let i = 0; i <= 2; i++) {
    d.setDate(d.getDate() + 1)
    days[i].innerText = dayNames[d.getDay()].slice(0, 3) + ", " + monthNames[d.getMonth()].slice(0, 3) + ' ' + d.getDate() + 'th';
}


dateEl.innerText = date;


async function getWeather(weather) {
    const resp = await fetch(APIURL + weather);
    const respData = await resp.json();
    console.log(respData)
    changeWeatherData(respData);
}

function changeWeatherData(data) {
    if (data.temperature[0] === '+') {
        temperatureEl.innerText = data.temperature.slice(1);
    } else {
        temperatureEl.innerText = data.temperature;
    }

    windspeed.innerText = "Wind Speed: " + data.wind;
    description.innerText = data.description;
    day1temp.innerText = data.forecast[0].temperature
    day2temp.innerText = data.forecast[1].temperature
    day3temp.innerText = data.forecast[2].temperature
    day1wind.innerText = data.forecast[0].wind
    day2wind.innerText = data.forecast[1].wind
    day3wind.innerText = data.forecast[2].wind

}

function isCelsius() {
    const currentTemp = temperatureEl.innerText;
    const u = currentTemp.split("");
    const v = u.reverse();
    return (v[0] === "C");
}

function changeToFahrenheit() {
    const currentText = temperatureEl.innerText;
    const day1t = day1temp.innerText;
    const day2t = day2temp.innerText;
    const day3t = day3temp.innerText;

    xs = [currentText, day1t, day2t, day3t];
    elements = [temperatureEl, day1temp, day2temp, day3temp]
    for (let i = 0; i < xs.length; i++) {
        const u = xs[i].split("°");
        const fahrenheit = Math.round(((parseInt(u[0]) * (9/5)) + 32)).toString();
        elements[i].innerText = fahrenheit + "°F"; 
    }
}

function changeToCelsius() {
    const currentText = temperatureEl.innerText;
    const day1t = day1temp.innerText;
    const day2t = day2temp.innerText;
    const day3t = day3temp.innerText;
    
    xs = [currentText, day1t, day2t, day3t];
    elements = [temperatureEl, day1temp, day2temp, day3temp]
    for (let i = 0; i < xs.length; i++) {
        const u = xs[i].split("°");
        const celsius = Math.round(((5*parseInt(u[0]) - 160) / 9)).toString();
        elements[i].innerText = celsius + "°C"; 
    }
}

unit.addEventListener('click', () => {
    if (isCelsius()) {
        changeToFahrenheit();
    } else {
        changeToCelsius();
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const weather = citysearch.value;

    fetch("./worldcities.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (weather.toLowerCase() === data[i].name.toLowerCase()) {
                    citynameEl.innerText = data[i].name + ', ' + data[i].country;
                    population.innerText = 'Population: ' + data[i].pop.toString();
                    break;
                }
                citynameEl.innerText = "City not Found!";
            }
        });

    if (weather) {
        getWeather(weather);
    };
});
