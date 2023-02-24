var searchInput = $('#search');
var output = $('main');
var forecast = $('section')
var apiKey = 'b3f812b9a42f6255aa1015708fcf5fc4';
var iconURL = 'https://openweathermap.org/img/wn/';
const history = document.querySelector('.history');


function fetchWeather() {
  
  var searchText = searchInput.val().trim().toLowerCase(); 
   

    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${apiKey}&units=metric`)
  .then(function (currentData) {
    var lon = currentData.coord.lon;
    var lat = currentData.coord.lat;
    var today = moment().format('DD MMMM YYYY');
    
    output.html('');
    
    output.append(`
      <div class="col">
      <h3 class="card-title p-2">Today ${today} </h3>
              <div class="card">            
                
                <div class="card-body">
                  <h3 class="card-title">${currentData.name}</h3>
                  <p class="card-text">Temp: ${Math.round(currentData.main.temp)}&deg;C </p>
                  <p class="card-text">Humidity ${currentData.main.humidity}%</p>
                  <p class="card-text">Wind ${currentData.wind.speed} m/s</p>
                  <div class="weather-icon"><img src="${iconURL + currentData.weather[0].icon}.png"></div>
                                           
                </div>
              </div>
      </div>
          `
        
    )               
         
    return $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
  })
      .then(function (forecastData) {
       for (var castObj of forecastData.list){
        if (castObj.dt_txt.endsWith("15:00:00")){
        var date = castObj.dt_txt;        
        var weekDayName =  moment(date).format('dddd');
        var weekDayDate = moment(date).format('DD-MM-YYYY')         
        forecast.append(
          `
          <div class="col">
         
              <div class="card">            
                
                <div class="card-body">
                  <h3 class="card-title">${weekDayName}</h3>
                  <h4 class="card-title">${weekDayDate}</h4>
                  <p class="card-text">Temp: ${Math.round(castObj.main.temp)}&deg;C </p>
                  <p class="card-text">Humidity ${castObj.main.humidity}%</p>
                  <p class="card-text">Wind ${castObj.wind.speed} m/s</p>
                  <div class="weather-icon"><img src="${iconURL + castObj.weather[0].icon}.png"></div>
                                           
                </div>
              </div>
      </div>     
        `
        );

        }};

        searchInput.val('');
       
      });  forecast.html('');    

 };

 function init() {
 
  searchInput.keydown(addToStorage);
  
};

init();

   
  function saveToStorage(arr) {
    localStorage.setItem('city', JSON.stringify(arr))

  };
  
  function getCity() {
      return JSON.parse(localStorage.getItem('city')) || [];
    };


    function addToStorage(event) {  
      var keyPressed = event.keyCode;
       if (keyPressed === 13) {
          var city = getCity();
          var cityText = searchInput.val().trim().toLowerCase();  

          if(!cityText) return;
          if(city.indexOf(cityText)===-1){        

          city.push(cityText.toLowerCase());
          saveToStorage(city);
          
        }      
          displayWeather();
          

      };
    };   

    function displayWeather() {
      var city = getCity(); 
           
      history.innerHTML = "";   
      history.innerHTML = `<h2>Search history</h2> \n`
      if (city.length > 5){
        localStorage.clear();
      }
      else if(!city.length){
        history.html('<p> No city has been added. </p>');
      }
  
      else for (var item  in city){
        
        history.insertAdjacentHTML("beforeend",`<button>${city[item]}</button>`)}
             
      fetchWeather();
    };






