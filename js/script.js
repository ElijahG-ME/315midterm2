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
  
  const wb = document.getElementById("weatherBox")
    if (wb){
      const weather = await getWeather();
      const text = wmoToText(weather.code);
      wb.textContent = 
    `LIVE WEATHER 
    
    Banff: ${weather.temp}°C
    ${text}
    
    Wind Speed: ${weather.wind}`;

    let routeCost = 0;
    let travelers = 1;
    let studentdiscount = false;
    let groupdiscount = false;
  }


  checkbox = document.getElementById("student");
  if (checkbox){
      checkbox.addEventListener("change", () => {
      (checkbox.checked) ? studentdiscount = true : studentdiscount = false;
      updateTotal(routeCost, travelers, studentdiscount, groupdiscount);
    });
  }
  

  route_selector = document.getElementById("route");
  if (route_selector){
    route_selector.addEventListener("change", () => {
    switch (route_selector.value) {
      case "Banff":
        routeCost = 50;
        break;
      case "Jasper":
        routeCost = 90;
        break;
      case "Lake Louise":
        routeCost = 70;
        break;
      default:
        routeCost = 0;
        break;
    }
    updateTotal(routeCost, travelers, studentdiscount, groupdiscount);
    })

  }
  

  travelersbox = document.getElementById("qty");
  if (travelersbox){
    travelersbox.addEventListener("change", () => {
    travelers = travelersbox.value;
    (travelers >= 5) ? groupdiscount = true : groupdiscount = false;
    updateTotal(routeCost, travelers, studentdiscount, groupdiscount);
    })
  }
  

  resetBtn = document.getElementById("reset");
  if (resetBtn){
    resetBtn.addEventListener("click", () => {
      updateTotal(0, 1, false, false);
    });
  }

  bookTrip = document.getElementById("book");
  if (bookTrip){
    
    bookTrip.addEventListener("click", (e) => {
      let valid = true;
      e.preventDefault();
      if (document.getElementById("name").value === "") {
        alert("Name must be filled in");
        valid = false;
      }
      if (document.getElementById("email").value === "") {
        alert("Email must be filled in");
        valid = false;
      }
      if (document.getElementById("route").value == "None") {
        alert("Route must be selected");
        valid = false;
      }
      if (valid) {
        const confirm = document.createElement("h4");
        confirm.textContent = `Thank you ${document.getElementById("name").value}! Your booking for ${travelers} people to ${document.getElementById("route").value}
        has been received. A confirmation email has been sent to ${document.getElementById("email").value}.`
        confirm.id = "confirm";
        document.getElementById("extra").appendChild(confirm);
      }


    });


  }

  const form = document.getElementById("submitform");
  if (form){
    
    form.addEventListener("click", (e) => {
      
    e.preventDefault();
    const name = document.getElementById("contactname").value;
    const email = document.getElementById("contactemail").value;
    const phone = document.getElementById("contactphone").value;
    const message = document.getElementById("message").value;
    const phoneRegex = /^\d{10}$/;

    let valid = true;

    if (name === "") {
      alert("Name is required.");
      valid = false;
      document.getElementById("contactname").style.border = "2px solid red";
    }
    if (!email.includes("@") || !email.includes(".") || email === "") {
      alert("Email must be valid.");
      valid = false;
      document.getElementById("contactemail").style.border = "2px solid red";
    }
    if (phone === "" || !phoneRegex.test(phone)) {
      alert("Phone must be valid.");
      valid = false;
      document.getElementById("contactphone").style.border = "2px solid red";
    }
    if (message === "") {
      alert("Message cannot be empty.");
      valid = false;
      document.getElementById("message").style.border = "2px solid red"
    }

    if (valid) {
      let msg = document.createElement("h3");
      msg.textContent = `Thanks, ${name}, we will contact you soon!`
      document.getElementById("contactform").remove();
      document.getElementById("main").appendChild(msg);
    }
  });

  }
  
}
main();

