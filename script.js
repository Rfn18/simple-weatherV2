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
const isEmpty = document.querySelector(".isEmpty");
const riwayat = document.querySelector(".history");

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
  document.querySelector(".container-auth").classList.toggle("default-mode");
  document.getElementById("btnSubmit").classList.toggle("dark-mode-color");
  document.querySelectorAll("a").forEach((a) => {
    a.classList.toggle("dark-mode-color");
  });
  inpSearch.classList.toggle("dark-mode-color");
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

const day = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
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
          // dark mode when night come
          document.body.classList.toggle("dark-mode");
          document.querySelector(".sidebar").classList.toggle("dark-mode");
          document
            .querySelector(".container-search")
            .classList.toggle("dark-mode");
          document
            .querySelector(".input-search")
            .classList.toggle("dark-mode-search");
          document
            .querySelector(".container-auth")
            .classList.toggle("default-mode");
          document
            .getElementById("btnSubmit")
            .classList.toggle("dark-mode-color");
          document.querySelectorAll("a").forEach((a) => {
            a.classList.toggle("dark-mode-color");
          });
          inpSearch.classList.toggle("dark-mode-color");
        }
      } else {
        return;
      }
      const cloudsCondition = datas.weather[0].main;
      document.getElementById(
        "cloud-icon"
      ).src = `assets/${cloudsCondition}.png`;

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
    const card = document.createElement("div");
    const li = document.createElement("li");
    const i = document.createElement("i");
    const p = document.createElement("p");
    i.classList = ("bi", "bi-search");
    card.classList = "card-history";
    history.appendChild(card);
    li.innerHTML = `${city}`;
    p.innerHTML = "x";

    card.addEventListener("click", () => {
      inpSearch.value = city;
    });

    p.addEventListener("click", () => {
      let citys = JSON.parse(localStorage.getItem("city name"));
      citys = citys.filter((cit) => cit !== city);
      window.location.reload();

      localStorage.setItem("city name", JSON.stringify(citys));
    });

    card.appendChild(i);
    card.appendChild(li);
    card.appendChild(p);
  });
}

if (localStorage.getItem("city name") == "[]" || localStorage.getItem("city name") == null) {
  search.classList.add("show");
  isEmpty.classList.add("visible");
  riwayat.classList.add("hidden");
}

window.addEventListener("load", () => {
  const citys = JSON.parse(localStorage.getItem("city name"));
  historys(citys);
});
