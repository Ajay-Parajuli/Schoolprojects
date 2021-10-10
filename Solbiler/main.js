
    var htmlkrop = document.getElementById("krop");
    var skabelon = document.getElementById('skabelon_output');
    var searchButton = document.getElementById("search-button");
    var dateFrom = document.getElementById("hent");
    var dateTo = document.getElementById("aflevere");



    var todaysDate = new Date().toISOString().split("T")[0];


    dateFrom.value = todaysDate;
    dateTo.value = todaysDate;

    function calculatePeriodInDays(){
      var dateFromValue = dateFrom.value;
      var dateToValue = dateTo.value;


      var millisecondsInADay = 1000 * 60 * 60 * 24;
      var rentalPeriodInDays =
      Math.round(
        (new Date(dateToValue).getTime() - new Date(dateFromValue).getTime()) /
          millisecondsInADay
      ) + 1;
  
    return rentalPeriodInDays;
      
    }

    function calculateRentalPrice(price = 0) {
      var baseRentalPrice = 495;
      var dailyRentalPrice = 100;
      var vatRate = 0.25;
      var rentalPeriodInDays = calculatePeriodInDays();
    
      var resultExclVat =
        baseRentalPrice + rentalPeriodInDays * (dailyRentalPrice + price);
      var resultInclVat = resultExclVat * (1 + vatRate);
    
      return resultInclVat;
    }

    function formatPrice(number) {
     
      if (Number.isNaN(number)) {
        return "Ukendt pris";
      } else {
        return number.toLocaleString("da-DK", {
          style: "currency",
          currency: "DKK",
        });
      }
    }
    

    function showCar(carObject) {
        var klon = skabelon.content.cloneNode(true);


      var rentalPrice = calculateRentalPrice(carObject.price);


        var billedetag = klon.querySelector("img");
        var captiontag = klon.querySelector("strong");
        var kategori = klon.querySelector("p1");
        var kategori1 = klon.querySelector("p2");
        var kategori2 = klon.querySelector("p3");
        var kategori3 = klon.querySelector("p4");
        var price = klon.querySelector(".b");
        var btn = klon.querySelector("button");

        price.style.color = "red";
       


        billedetag.src = carObject.billedfil;
        billedetag.alt = carObject.billedtekst;
        captiontag.textContent = carObject.billedtekst;
        kategori.textContent = carObject.disc;
        kategori1.textContent = `Personer: ${carObject.disc1}`;
        kategori2.textContent = `Kufferter: ${carObject.disc2}`;
        kategori3.textContent = carObject.disc3;
        price.textContent = formatPrice(rentalPrice);
        btn.textContent = carObject.button;      

        htmlkrop.appendChild(klon);
    }





    
    function handleSearch(event) {
      event.preventDefault();
      htmlkrop.innerHTML = "";
      var requiredPersonCount = document.getElementById("person-count").value;
      var requiredLuggageCount = document.getElementById("luggage-count").value;
    
    
    
    fetch("https://api.jsonbin.io/v3/b/6137835885791e1732a16c5d", {
        headers: {
          "X-Master-Key":
            "$2b$10$tN8eKqJfEQVS6Rcn7OnT8eoO9J31mC9kzQZ7sbIjL8XYv.M6JxxKm",
          "X-Bin-Meta": false,
        },
      })
        .then(function (response) {
        
          return response.json();
        })
        .then(function (cars) {
          
          for (var car of cars) {
            if (
              car.disc1 >= Number(requiredPersonCount) &&
              car.disc2 >= Number(requiredLuggageCount)
            ) {
              
              showCar(car);
            }
          }
        })
        .catch(function (error) {
      
          htmlkrop.innerHTML = `<p class="error-message">Noget gik galt: "${error.message}".</p>`;
        });
    
    }


searchButton.addEventListener("click", handleSearch);
