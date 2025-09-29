const sidebar = document.querySelector(".sidebar");
const cityName = document.querySelector(".city-name");
const main = document.querySelector("main");
const temp = document.querySelector(".temp");
const date = document.querySelector(".date");
const tg = document.querySelector(".timeGood");
const wind = document.querySelector(".wind-speed");
const timeSun = document.querySelector(".times");
const timesIcon = document.getElementById("icon-times");
const clock = document.querySelector(".clock");

const btnSearch = document.getElementById("btnSearch");
const search = document.querySelector(".container-search");
const btnSubmit = document.getElementById("btnSubmit");
const inpSearch = document.getElementById("inpSearch");

const now = new Date();

function btnMenu() {
  sidebar.classList.add("show");
  sidebar.classList.remove("hidden");
}

btnSearch.addEventListener("click", () => {
  search.classList.remove("hidden");
  search.classList.add("show");
});

main.addEventListener("click", (event) => {
  if (event.target === main) {
    sidebar.classList.add("hidden");
    sidebar.classList.remove("show");

    search.classList.add("hidden");
    search.classList.remove("show");
  }
});

// Weather api

const endpoint = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "&appid=ea0b8a4cfbd1fefde12f4b2172d1163b&units=metric";

let city = "";
let datas;

async function weather(city) {
  try {
    const api = endpoint + city + apiKey;
    const response = await fetch(api);
    const data = await response.json();

    datas = data;
    return data;
  } catch (err) {
    console.log("error : " + err);
  }
}

const day = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"];
const month = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
let dayNow = day[now.getDay()];
let monthNow = month[now.getMonth()];
const times = now.getHours() + ":" + now.getMinutes();
let ti, timeGood;

btnSubmit.addEventListener("click", () => {
  city = inpSearch.value;

  weather(city).then(() => {
    let sunrise = new Date(datas.sys.sunrise * 1000)
      .toLocaleString()
      .split(",");
    sunrise = sunrise[1].split(".");
    let sunset = new Date(datas.sys.sunset * 1000).toLocaleString().split(",");
    sunset = sunset[1].split(".");
    let theSun;

    if (now.getHours() < 12 && now.getHours() >= 1) {
      ti = "AM";
      timeGood = "Good Morning";
      theSun = [sunrise[0] + ":" + sunrise[1] + " AM", "Sunrise"];
      timesIcon.classList.add("bi", "bi-sunrise-fill");
    } else if (now.getHours() >= 12) {
      ti = "PM";
      timeGood = "Good Afternoon";
      theSun = [sunset[0] + ":" + sunrise[1] + " PM", "Sunset"];
      timesIcon.classList.add("bi", "bi-sunset-fill");
      if (now.getHours() >= 17) {
        timeGood = "Good Night";
      }
    } else {
      return;
    }

    console.log(timeGood);

    cityName.innerHTML = datas.name;
    temp.innerHTML = datas.main.temp + "°C";
    date.innerHTML = dayNow + " " + times + " " + ti;
    tg.innerHTML = timeGood;
    wind.innerHTML = datas.wind.speed + " m/s";
    clock.innerHTML = theSun[0];
    timeSun.innerHTML = theSun[1];
  });
});
