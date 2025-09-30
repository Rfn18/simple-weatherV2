const sidebar = document.querySelector(".sidebar");
const cityName = document.querySelector(".city-name");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
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

const toggle = document.querySelector(".slider");

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

footer.addEventListener("click", (event) => {
  if (event.target === footer) {
    sidebar.classList.add("hidden");
    sidebar.classList.remove("show");

    search.classList.add("hidden");
    search.classList.remove("show");
  }
});

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".sidebar").classList.toggle("dark-mode");
  document.querySelector(".container-search").classList.toggle("dark-mode");
  document.querySelector(".input-search").classList.toggle("dark-mode-search");
  inpSearch.classList.toggle("dark-mode-color");
  document.getElementById("btnSubmit").classList.toggle("dark-mode-color");
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
    if (datas.cod === "404") {
      alert(datas.message);
    } else {
      search.classList.add("hidden");
      search.classList.remove("show");
      let sunrise = new Date(datas.sys.sunrise * 1000)
        .toLocaleString()
        .split(",");
      sunrise = sunrise[1].split(".");
      console.log(sunrise);
      let sunset = new Date(datas.sys.sunset * 1000)
        .toLocaleString()
        .split(",");
      sunset = sunset[1].split(".");
      let theSun;

      if (now.getHours() < 12 && now.getHours() >= 1) {
        ti = "AM";
        timeGood = "Good Morning";
        theSun = [sunrise[0] + ":" + sunrise[1] + " AM", "Sunrise"];
        console.log(theSun);
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

      cityName.innerHTML = datas.name;
      temp.innerHTML = datas.main.temp + "°C";
      date.innerHTML = dayNow + " " + times + " " + ti;
      tg.innerHTML = timeGood;
      wind.innerHTML = datas.wind.speed + " m/s";
      clock.innerHTML = theSun[0];
      timeSun.innerHTML = theSun[1];

      if (JSON.parse(localStorage.getItem("city name")) === null) {
        localStorage.setItem("city name", JSON.stringify([city]));
      } else {
        const length = JSON.parse(localStorage.getItem("city name")).length;
        for (let i = 0; i < length; i++) {
          if (JSON.parse(localStorage.getItem("city name"))[i] === city) {
            return;
          }
        }

        let citys = JSON.parse(localStorage.getItem("city name") || "[]");
        if (!Array.isArray(citys)) {
          citys = [];
        }

        citys.push(city);
        localStorage.setItem("city name", JSON.stringify(citys));
      }

      inpSearch.value = "";
    }
  });
});

function historys(citys) {
  citys.forEach((city, index) => {
    const history = document.querySelector(".container-history");
    const li = document.createElement("li");
    li.innerHTML = `${index + 1}. ${city}`;
    history.appendChild(li);
  });
}

window.addEventListener("load", () => {
  const citys = JSON.parse(localStorage.getItem("city name"));
  historys(citys);
});
