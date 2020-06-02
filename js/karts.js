const RUTA_XML_KARTS = "/xml/karts.xml";
//Barras de valores
const BARRA_VELOCIDAD = document.getElementById("vvelocidad");
const BARRA_ACELERACION = document.getElementById("vaceleracion");
const BARRA_PESO = document.getElementById("vpeso");
const BARRA_MANEJO = document.getElementById("vmanejo");
const BARRA_DRIFT = document.getElementById("vdrift");
const BARRA_ITEMS = document.getElementById("vitems");

const SECCION_KARTS = document.getElementById("karts"); //Div donde se añaden las imagenes de los karts
var kartSeleccionado;
var botonesPersonajes = document.getElementsByClassName("btnPersonaje");

for (let boton of botonesPersonajes){
    boton.onclick = function(){
        consultarPersonaje(event.target.value);
    }
}

/**
 * Aplica los valores del kart a las barras de valores y carga la escena 3D
 * @param {Kart} kart 
 */
function cargarKart(kart) {
    //Para evitar vovler a cargar un mismo modelo. La primera vez la var kartSeleccionado sera null, por lo que se permitira cargar el modelo
    
    if (kartSeleccionado == null || kartSeleccionado.nombre != kart.nombre) {
        console.log("Cargando coche");

        kartSeleccionado = kart;
        //Barras valores
        BARRA_VELOCIDAD.style.width = kartSeleccionado.velocidad + "%";
        BARRA_ACELERACION.style.width = kartSeleccionado.aceleracion + "%";
        BARRA_PESO.style.width = kartSeleccionado.peso + "%";
        BARRA_MANEJO.style.width = kartSeleccionado.manejo + "%";
        BARRA_DRIFT.style.width = kartSeleccionado.drift + "%";
        BARRA_ITEMS.style.width = kartSeleccionado.items + "%";

        //3D
        createScene(kartSeleccionado.nombre); //Llamada a 3d.js
    }

}

//Consulat XML & XPath
//Constantes de miniaturas
const BASE_URL_THUMB = "img/karts/",
    FORMATO_THUMB = ".png";

var datosXML; //Los datos del XML

//Clase Kart
class Kart {
    constructor(nombre, propietario, velocidad, aceleracion, peso, manejo, drift, items) {
        this.nombre = nombre;
        this.propietario = propietario;
        this.velocidad = velocidad;
        this.aceleracion = aceleracion;
        this.peso = peso;
        this.manejo = manejo;
        this.drift = drift;
        this.items = items;
    }
}

//XML
//Realizar peticion de los datos XML
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        datosXML = this.responseXML;
        //Valores principales 
        consultarPersonaje("Mario");
        cargarKart(consultarKart("B Dasher"));
    }
};
xhttp.open("GET", RUTA_XML_KARTS, true);
xhttp.send();

/**
 * Carga las imagenes de los karts propietarios del personaje parametrizado.
 * @param {String} nombre El nombre del personaje a consultar.
 */
function consultarPersonaje(nombre) {
    SECCION_KARTS.innerHTML = ""; //Resetear el div karts
    let path = "karts/kart[propietario='" + nombre + "']"; //Path para sacar los karts del personaje
    var nodes = datosXML.evaluate(path, datosXML, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext(); //Ponemos el puntero en el primero resultado.
    //Recorremos los resultados y generamos los elementos <img> de los karts
    while (result) {
        let nombre = result.getElementsByTagName("nombre")[0].innerHTML;
        let thumb = document.createElement("img");
        thumb.classList.add("kartIMG");
        thumb.classList.add("col");
        thumb.setAttribute("src", BASE_URL_THUMB + nombre + FORMATO_THUMB);
        thumb.value = nombre;
        //Función para más tarde controlar los clicks en las imagenes 
        thumb.onclick = function () {
            let kart = consultarKart(nombre);
            cargarKart(kart);
        }
        result = nodes.iterateNext(); //Siguiente resultado
        SECCION_KARTS.appendChild(thumb);
    }
}

/**
 * Devuelve el objeto kart con el nombre parametrizado.
 * @param {String} kart el nombre del kart a consultar.
 * @returns {Kart} El kart consultado.
 */
function consultarKart(kart) {
    let path = "karts/kart[nombre='" + kart + "']"; //El path a analizar
    var nodes = datosXML.evaluate(path, datosXML, null, XPathResult.ANY_TYPE, null); //Ejecutamos el XML Path
    var result = nodes.iterateNext(); //Iteramos el primer resultado
    var kart = new Kart();

    //Creación del objeto kart
    kart.nombre = result.getElementsByTagName("nombre")[0].innerHTML;
    kart.propietario = result.getElementsByTagName("propietario")[0].innerHTML;
    kart.velocidad = result.getElementsByTagName("velocidad")[0].innerHTML;
    kart.aceleracion = result.getElementsByTagName("aceleracion")[0].innerHTML;
    kart.peso = result.getElementsByTagName("peso")[0].innerHTML;
    kart.manejo = result.getElementsByTagName("manejo")[0].innerHTML;
    kart.drift = result.getElementsByTagName("drift")[0].innerHTML;
    kart.items = result.getElementsByTagName("items")[0].innerHTML;

    return kart;
}