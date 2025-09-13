from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)

key = 'e33384b4c1fd428aa30162046251309'
weather_base_url = 'http://api.weatherapi.com/v1'

# simple mapping from condition keywords to Material Design Icon names
MDI_MAP = {
    'clear': 'mdi-weather-sunny',
    'sun': 'mdi-weather-sunny',
    'partly': 'mdi-weather-partly-cloudy',
    'cloud': 'mdi-weather-cloudy',
    'overcast': 'mdi-weather-cloudy',
    'rain': 'mdi-weather-pouring',
    'drizzle': 'mdi-weather-rainy',
    'shower': 'mdi-weather-rainy',
    'snow': 'mdi-snowflake',
    'sleet': 'mdi-snowflake',
    'thunder': 'mdi-weather-lightning',
    'storm': 'mdi-weather-lightning',
    'fog': 'mdi-weather-fog',
    'mist': 'mdi-weather-fog',
    'haze': 'mdi-weather-hazy'
}

@app.route('/', methods=['GET', 'POST'])
def home():
    info = None
    error = None
    if request.method == 'POST':
        city = request.form.get('city')
        if not city:
            error = "Please enter a city name."
        else:
            weather_url = f"{weather_base_url}/current.json?key={key}&q={city}"
            air_url = f"{weather_base_url}/current.json?key={key}&q={city}&aqi=yes"
            try:
                weather_resp = requests.get(weather_url)
                air_resp = requests.get(air_url)
                weather = weather_resp.json()
                airquality = air_resp.json().get('current', {}).get('air_quality', {})
                if 'error' in weather or not weather_resp.ok:
                    error = "Error fetching weather data."
                else:
                    current = weather.get('current', {})
                    # choose a local icon based on condition text and day/night
                    condition_text = (current.get('condition') or {}).get('text', '').lower()
                    is_day = current.get('is_day', 1)
                    def choose_icon(text, is_day_flag):
                        if 'clear' in text or 'sun' in text:
                            return 'icons/clear-day.svg' if is_day_flag else 'icons/clear-night.svg'
                        if 'partly' in text or 'few' in text or 'mostly' in text:
                            return 'icons/partly-cloudy.svg'
                        if 'cloud' in text or 'overcast' in text:
                            return 'icons/cloudy.svg'
                        if 'rain' in text or 'drizzle' in text or 'shower' in text:
                            return 'icons/rain.svg'
                        if 'snow' in text or 'sleet' in text or 'blizzard' in text:
                            return 'icons/snow.svg'
                        if 'thunder' in text or 'storm' in text or 'lightning' in text:
                            return 'icons/thunder.svg'
                        if 'fog' in text or 'mist' in text or 'haze' in text:
                            return 'icons/fog.svg'
                        return 'icons/partly-cloudy.svg'

                    icon_path = choose_icon(condition_text, is_day)
                    # pick an mdi icon class if possible
                    mdi_icon = None
                    for k,v in MDI_MAP.items():
                        if k in condition_text:
                            mdi_icon = v
                            break
                    info = {
                        'location': weather.get('location', {}),
                        'weather': current,
                        'air_quality': airquality,
                        'icon_url': f"/static/{icon_path}",
                        'mdi_icon': mdi_icon
                    }
            except Exception:
                error = "Error fetching data."
    return render_template('index.html', info=info, error=error)


@app.route('/forecast', methods=['GET', 'POST'])
def forecast_page():
    error = None
    forecast_info = None
    city = request.values.get('city')
    days = int(request.values.get('days') or 3)
    if city:
        try:
            url = f"{weather_base_url}/forecast.json?key={key}&q={city}&days={days}&aqi=no&alerts=no"
            resp = requests.get(url)
            if resp.ok:
                forecast_info = resp.json()
                # attach mdi icon names to each day when possible
                try:
                    for fd in forecast_info.get('forecast', {}).get('forecastday', []):
                        text = (fd.get('day', {}).get('condition', {}).get('text') or '').lower()
                        fd['mdi_icon'] = None
                        for k,v in MDI_MAP.items():
                            if k in text:
                                fd['mdi_icon'] = v
                                break
                except Exception:
                    pass
            else:
                error = 'Error fetching forecast data.'
        except Exception:
            error = 'Error fetching forecast data.'
    return render_template('forecast.html', forecast=forecast_info, error=error)


@app.route('/api/forecast', methods=['GET'])
def api_forecast():
    city = request.args.get('city')
    days = request.args.get('days', 3)
    if not city:
        return jsonify({'error':'city required'}), 400
    try:
        url = f"{weather_base_url}/forecast.json?key={key}&q={city}&days={days}&aqi=no&alerts=no"
        resp = requests.get(url)
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return jsonify({'error':'fetch failed'}), 500

# ... keep your API endpoints if you want them ...

if __name__ == '__main__':
    app.run(port=8080, debug=True)