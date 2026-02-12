async function getWeather(){
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=51.1784&longitude=115.5708&current_weather=true";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const t = data.current_weather.temperature;
    const w = data.current_weather.windspeed;
    const code = data.current_weather.weathercode;
    return {code: code, temp: t, wind: w};
  } catch {
    
  }
}

function wmoToText(code) {
  const weatherCodes = {
      0: "Clear sky",
      2: "Partly cloudy",
      3: "Overcast",

      45: "Fog",

      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",

      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",

      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail"
  };

  return weatherCodes[code] || "Unknown weather condition";
}

function updateTotal(routeCost, travelers, studentdiscount, groupdiscount) {
  let subtotal = routeCost * travelers;
  let discount = 0;
  if (studentdiscount) { discount += 0.15; }
  if (groupdiscount) { discount += 0.1;}
  const estimated_total = (subtotal * (1-discount)) * 1.05;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

  document.getElementById("estTotal").textContent = `Estimated Total: ${formatter.format(estimated_total)}`;
}

async function main(){
  const weather = await getWeather();
  const text = wmoToText(weather.code);
  document.getElementById("weatherBox").textContent = 
  `LIVE WEATHER 
  
  Banff: ${weather.temp}°C
  ${text}
  
  Wind Speed: ${weather.wind}`;

  let routeCost = 0;
  let travelers = 1;
  let studentdiscount = false;
  let groupdiscount = false;


  checkbox = document.getElementById("student");
  checkbox.addEventListener("change", () => {
    (checkbox.checked) ? studentdiscount = true : studentdiscount = false;
    updateTotal(routeCost, travelers, studentdiscount, groupdiscount);
  });

  route_selector = document.getElementById("route");
  route_selector.addEventListener("change", () => {
    switch (route_selector.value) {
      case "C2B":
        routeCost = 50;
        break;
      case "E2J":
        routeCost = 90;
        break;
      case "C2LL":
        routeCost = 70;
        break;
      default:
        routeCost = 0;
        break;
    }
    updateTotal(routeCost, travelers, studentdiscount, groupdiscount);
  })

  travelersbox = document.getElementById("qty");
  travelersbox.addEventListener("change", () => {
    travelers = travelersbox.value;
    (travelers >= 5) ? groupdiscount = true : groupdiscount = false;
    updateTotal(routeCost, travelers, studentdiscount, groupdiscount);
  })

  resetBtn = document.getElementById("reset");
  resetBtn.addEventListener("click", () => {
    updateTotal(0, 1, false, false);
  });

  bookTrip = document.getElementById("book");
  bookTrip.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.getElementById("name").value === "") {
      alert("Name must be filled in");
    }
    if (document.getElementById("email").value === "") {
      alert("Email must be filled in");
    }
    if (document.getElementById("route").value == "None") {
      alert("Route must be selected");
    }
  });

}
main();

