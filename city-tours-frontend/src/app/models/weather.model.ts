export class WeatherModel {
   constructor(
      public coord: WeatherCoord,
      public weather: WeatherInfo[],
      public base: string,
      public main: WeatherMain,
      public visibility: number,
      public wind: WindInfo,
      public clouds: CloudInfo,
      public dt: number,
      public sys: SysInfo,
      public timezone: number,
      public id: number,
      public name: string,
      public cod: number
   ) {}
}

export class WeatherCoord {
   constructor(public lon: number, public lat: number) {}
}

export class WeatherInfo {
   constructor(public id: number, public main: string, public description: string, public icon: string) {}
}

export class WeatherMain {
   constructor(
      public temp: number,
      public feels_like: number,
      public temp_min: number,
      public temp_max: number,
      public pressure: number,
      public humidity: number
   ) {}
}

export class WindInfo {
   constructor(public speed: number, public deg: number, public gust: number) {}
}

export class CloudInfo {
   constructor(public all: number) {}
}

export class SysInfo {
   constructor(
      public type: number,
      public id: number,
      public country: string,
      public sunrise: number,
      public sunset: number
   ) {}
}
