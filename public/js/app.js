console.log("Client side javascript file is loaded!");
fetch("http://localhost:3000/weather?adress=paris").then((res) => {
  res.json().then((data) => {
    if (data.error) console.log(data.error);
    else console.log(data);
  });
});
