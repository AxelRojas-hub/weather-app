import { key } from "./key"

let ciudad:string = "Comodoro Rivadavia"

interface ApiResponse  {
    location:{
        country: string;
        name: string;
    },
    current:{
        last_updated: string;
        temp_c: number;
        condition: {
            text: string,
            icon: string
        },
        wind_kph: number,
        humidity: number
    },
    forecast:{
    forecastday:[];
    }
}
let data:ApiResponse;


async function fetchData():Promise<void>{
    const url:string =`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${ciudad}&days=3&aqi=no&alerts=no&lang=es`
    try {
        const response = await fetch(url)
        if(!response.ok){
            throw new Error(`Error: ${response.status}`)
        }

        data = await response.json();

    } catch (error) {
        console.error(error);
    }
}
function cambiarDom():void{
    fetchData().then(()=>{
        //Agrega el nombre del pais de la ciudad buscada como titulo de card
        const paisCard = document.querySelector(".primary-card-title") as HTMLElement;
        paisCard.innerHTML = `${data.location.country}<br>`; // Asignación correcta
        //Agrega el nombre de la ciudad como subtexto de la tarjeta
        const ciudadCard = document.querySelector(".small-city") as HTMLElement;
        ciudadCard.textContent = data.location.name;
        //Agrega la tempratura en grados celsius
        const temperatura = document.querySelector(".primary-temp") as HTMLElement;
        temperatura.textContent = String(data.current.temp_c)+"°";
        //Agrega la imagen y el texto alt
        const imagen = document.querySelector(".primary-img") as HTMLImageElement;
        imagen.src = data.current.condition.icon;
        imagen.alt = data.current.condition.text;
        const imgSubText =document.querySelector(".primary-temp-subtext") as HTMLImageElement 
        imgSubText.innerHTML =data.current.condition.text;

        const wind = document.querySelector(".primary-card-wind") as HTMLElement;
        wind.innerHTML = "<b>Viento: </b>" + data.current.wind_kph + "km/h"

        const humidity = document.querySelector(".primary-card-hum") as HTMLElement;
        humidity.innerHTML = "<b>Humedad: </b>" + data.current.humidity + "%"
        console.log(data.forecast)
        
        //Ahora hace lo mismo con las cards secundarias
        let dias:Array<any> = data.forecast.forecastday;
        //Inserta dias de la semana
        document.getElementById("title-1")!.innerHTML= getDayOfWeek(dias[0].date);
        document.getElementById("title-2")!.innerHTML= getDayOfWeek(dias[1].date);
        document.getElementById("title-3")!.innerHTML= getDayOfWeek(dias[2].date);
        //Inserta fecha
        document.getElementById("small-1")!.innerHTML= formatDate(dias[0].date);
        document.getElementById("small-2")!.innerHTML= formatDate(dias[1].date);
        document.getElementById("small-3")!.innerHTML= formatDate(dias[2].date);
        //Inserta imagenes
        (document.getElementById("sec-img-1") as HTMLImageElement).src = (dias[0].day.condition.icon) ;
        (document.getElementById("sec-img-2") as HTMLImageElement).src = (dias[1].day.condition.icon) ;
        (document.getElementById("sec-img-3") as HTMLImageElement).src = (dias[2].day.condition.icon) ;

        (document.getElementById("sec-img-1") as HTMLImageElement).src = (dias[0].day.condition.icon) ;
        (document.getElementById("sec-img-2") as HTMLImageElement).src = (dias[1].day.condition.icon) ;
        (document.getElementById("sec-img-3") as HTMLImageElement).src = (dias[2].day.condition.icon) ;
        
        document.getElementById("sec-temp-1")!.innerHTML = (dias[0].day.avgtemp_c + "°");
        document.getElementById("sec-temp-2")!.innerHTML = (dias[1].day.avgtemp_c + "°");
        document.getElementById("sec-temp-3")!.innerHTML = (dias[2].day.avgtemp_c + "°");
        
        (document.getElementById("sec-img-1") as HTMLImageElement).alt = (dias[0].day.condition.text);
        (document.getElementById("sec-img-2") as HTMLImageElement).alt = (dias[1].day.condition.text);
        (document.getElementById("sec-img-3") as HTMLImageElement).alt = (dias[2].day.condition.text);
        

    });
}

//Procesamiento de fechas
function getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[date.getDay()];
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
}



const inputCity = document.querySelector(".inputCity") as HTMLInputElement | null;
inputCity!.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    ciudad = inputCity!.value; // Actualiza la ciudad antes de hacer el fetch
    cambiarDom();
  }
});

// Realiza un primer fetch con la ciudad inicial
cambiarDom();