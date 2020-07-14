const search = async (adress) => {
  const res = await fetch("http://localhost:3000/weather?adress=" + adress);
  const data = await res.json();
  return data;
};

const form = document.getElementById("form");
const adress = document.getElementById("adress");
const msg1 = document.getElementById("msg1");
const msg2 = document.getElementById("msg2");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  msg1.textContent = "Loading ...";
  search(adress.value).then((weather) => {
    if (weather.error) msg1.textContent = weather.error;
    else {
      msg1.textContent = weather.forecast;
      msg2.textContent = weather.location;
    }
  });
  //form.(createElement("p")
});
