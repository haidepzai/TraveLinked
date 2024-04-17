import { ApiURLStore } from 'src/app/models/ApiURLs/ApiURLStore';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeatherModel } from 'src/app/models/weather.model';

@Injectable({
   providedIn: 'root',
})
export class WeatherService {
   constructor(private http: HttpClient) {}

   getWeatherByLocation(city: string): Observable<WeatherModel> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      return this.http.get<WeatherModel>(`${ApiURLStore.GET_WEATHER_BY_LOCATION}?city=${city}`, {
         headers,
      });
   }

   getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherModel> {
      const headers = new HttpHeaders({
         'Content-Type': 'application/json',
      });
      return this.http.get<WeatherModel>(`${ApiURLStore.GET_WEATHER_BY_COORDINATES}?lat=${lat}&lon=${lon}`, {
         headers,
      });
   }
}
