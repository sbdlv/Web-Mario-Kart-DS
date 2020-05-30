const RUTA_XML_KARTS = "xml/karts.xml";
//<Barras de valores>
var velocidad = document.getElementById("vvelocidad");
var aceleracion = document.getElementById("vaceleracion");
var peso = document.getElementById("vpeso");
var manejo = document.getElementById("vmanejo");
var drift = document.getElementById("vdrift");
var items = document.getElementById("vitems");

var seccionKarts = document.getElementById("karts"); //Div donde se añaden las imagenes de los karts
var kartSeleccionado;

/*
function ajustarIframe() {
    var iFrameID = document.getElementById('iframeKarts');
    if (iFrameID) {
        // here you can make the height, I delete it first, then I make it again
        console.log("Iframe");
        console.log(iFrameID.contentWindow.document.body.scrollHeight);

        iFrameID.height = "";
        iFrameID.style.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
    }
}*/

/**
 * 
 * @param {*} event 
 */
function cambiarPersonaje(event) {
    let nombre = event.target.value;
    consultarPersonaje(nombre);

}

/**
 * Aplica los valores del kart a las barras de valores y carga la escena 3D
 * @param {Kart} kart 
 */
function cargarKart(kart) {
    //Para evitar vovler a cargar un mismo modelo
    if (kartSeleccionado != kart) {
        console.log("Cargando coche");

        kartSeleccionado = kart;
        //Barras valores
        velocidad.style.width = kartSeleccionado.velocidad + "%";
        aceleracion.style.width = kartSeleccionado.aceleracion + "%";
        peso.style.width = kartSeleccionado.peso + "%";
        manejo.style.width = kartSeleccionado.manejo + "%";
        drift.style.width = kartSeleccionado.drift + "%";
        items.style.width = kartSeleccionado.items + "%";

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
    seccionKarts.innerHTML = ""; //Resetear el div karts
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
        seccionKarts.appendChild(thumb);
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