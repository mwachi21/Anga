        function getAllInfo() {
            const city = document.getElementById('city').value;
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '';
            if (!city) {
                resultDiv.textContent = 'Please enter a city name.';
                return;
            }
            Promise.all([
                fetch(`/city?city=${encodeURIComponent(city)}`).then(res => res.json()),
                fetch(`/airquality?city=${encodeURIComponent(city)}`).then(res => res.json())
            ])
            .then(([weather, airquality]) => {
                if (weather.error || airquality.error) {
                    resultDiv.textContent = 'Error fetching data.';
                    return;
                }
                let html = '';

                // Location
                if (weather.location) {
                    html += `<div class="section"><h2>Location</h2>
                        <table class="info-table">
                            <tr><td>Name</td><td>${weather.location.name || ''}</td></tr>
                            <tr><td>Region</td><td>${weather.location.region || ''}</td></tr>
                            <tr><td>Country</td><td>${weather.location.country || ''}</td></tr>
                            <tr><td>Lat/Lon</td><td>${weather.location.lat}, ${weather.location.lon}</td></tr>
                            <tr><td>Local Time</td><td>${weather.location.localtime || ''}</td></tr>
                        </table>
                    </div>`;
                }

                // Weather
                if (weather.current) {
                    html += `<div class="section"><h2>Weather</h2>
                        <table class="info-table">
                            <tr><td>Temperature</td><td>${weather.current.temp_c} °C / ${weather.current.temp_f} °F</td></tr>
                            <tr><td>Condition</td><td>${weather.current.condition ? weather.current.condition.text : ''}</td></tr>
                            <tr><td>Wind</td><td>${weather.current.wind_kph} kph (${weather.current.wind_dir})</td></tr>
                            <tr><td>Humidity</td><td>${weather.current.humidity} %</td></tr>
                            <tr><td>Feels Like</td><td>${weather.current.feelslike_c} °C / ${weather.current.feelslike_f} °F</td></tr>
                        </table>
                    </div>`;
                }

                // Air Quality
                if (Object.keys(airquality).length > 0) {
                    html += `<div class="section"><h2>Air Quality</h2>
                        <table class="info-table">
                            <tr><td>CO (Carbon Monoxide)</td><td>${airquality.co ? airquality.co.toFixed(2) : 'N/A'} µg/m³</td></tr>
                            <tr><td>NO₂ (Nitrogen Dioxide)</td><td>${airquality.no2 ? airquality.no2.toFixed(2) : 'N/A'} µg/m³</td></tr>
                            <tr><td>O₃ (Ozone)</td><td>${airquality.o3 ? airquality.o3.toFixed(2) : 'N/A'} µg/m³</td></tr>
                            <tr><td>SO₂ (Sulphur Dioxide)</td><td>${airquality.so2 ? airquality.so2.toFixed(2) : 'N/A'} µg/m³</td></tr>
                            <tr><td>PM2.5</td><td>${airquality.pm2_5 ? airquality.pm2_5.toFixed(2) : 'N/A'} µg/m³</td></tr>
                            <tr><td>PM10</td><td>${airquality.pm10 ? airquality.pm10.toFixed(2) : 'N/A'} µg/m³</td></tr>
                            <tr><td>US EPA Index</td><td>${airquality['us-epa-index'] || 'N/A'}</td></tr>
                            <tr><td>GB DEFRA Index</td><td>${airquality['gb-defra-index'] || 'N/A'}</td></tr>
                        </table>
                    </div>`;
                }

                resultDiv.innerHTML = html;
            })
            .catch(() => {
                resultDiv.textContent = 'Error fetching data.';
            });
        }