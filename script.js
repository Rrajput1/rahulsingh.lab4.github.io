function handleLocationSearch() {
    let locationSearchInput = document.getElementById("locationSearchInput").value;
  
    if (locationSearchInput.trim().length != 0) {
      let getGeoCodeUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(locationSearchInput)}`;
  
      fetch(getGeoCodeUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error');
          }
          return response.json();
        })
        .then((data) => {
          if (data.length != 0) {
            const displayLocationName = data[0].display_name;
            updateLocationHeading(displayLocationName);
  
            const { lat, lon } = data[0];
            const { formattedTodayDate, formattedTomorrowDate } = getFormattedDates();
  
            const todaySunriseSunsetUrl = `https://api.sunrisesunset.io/json?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lon)}&date=${formattedTodayDate}`;
            todaySunriseSunsetApiCall(todaySunriseSunsetUrl, formattedTodayDate);
  
            const tomorrowDateSunriseSunsetUrl = `https://api.sunrisesunset.io/json?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lon)}&date=${formattedTomorrowDate}`;
            tomorrowSunriseSunsetApiCall(tomorrowDateSunriseSunsetUrl, formattedTomorrowDate);
          } else {
            console.log("Error");
          }
        })
        .catch((error) => {
          console.log("Error from GeoCode API -> ", error);
        });
    } else {
      console.log("Please enter Location");
    }
  }
  
  function updateLocationHeading(displayLocationName) {
    document.getElementById("todayLocationHeading").innerHTML = displayLocationName;
    document.getElementById("tomorrowLocationHeading").innerHTML = displayLocationName;
  }
  
  function getFormattedDates() {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);
    const formattedTodayDate = todayDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTomorrowDate = tomorrowDate.toISOString().split('T')[0]; // YYYY-MM-DD
  
    return { formattedTodayDate, formattedTomorrowDate };
  }
  
  function todaySunriseSunsetApiCall(todaySunriseSunsetUrl, todayDate) {
    fetch(todaySunriseSunsetUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error');
        }
        return response.json();
      })
      .then((data) => {
        const sunriseSunsetApiData = data.results;
        updateSunriseSunsetData("today", sunriseSunsetApiData, todayDate);
      })
      .catch((error) => {
        console.error("Error from SunriseSunset API -> ", error);
      });
  }
  
  function tomorrowSunriseSunsetApiCall(tomorrowDateSunriseSunsetUrl, tomorrowDate) {
    fetch(tomorrowDateSunriseSunsetUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error');
        }
        return response.json();
      })
      .then((data) => {
        const sunriseSunsetApiData = data.results;
        updateSunriseSunsetData("tomorrow", sunriseSunsetApiData, tomorrowDate);
      })
      .catch((error) => {
        console.error("Error from SunriseSunset API -> ", error);
      });
  }
  
  function updateSunriseSunsetData(day, sunriseSunsetApiData, date) {
    document.getElementById(`${day}SunriseText`).innerHTML = sunriseSunsetApiData.sunrise;
    document.getElementById(`${day}SunsetText`).innerHTML = sunriseSunsetApiData.sunset;
    document.getElementById(`${day}DawnText`).innerHTML = sunriseSunsetApiData.dawn;
    document.getElementById(`${day}DuskText`).innerHTML = sunriseSunsetApiData.dusk;
    document.getElementById(`${day}DayLengthText`).innerHTML = sunriseSunsetApiData.day_length;
    document.getElementById(`${day}SolarNoonText`).innerHTML = sunriseSunsetApiData.solar_noon;
    document.getElementById(`${day}TimeZoneText`).innerHTML = sunriseSunsetApiData.timezone;
    document.getElementById(`${day}Date`).innerHTML = date;
  }
  