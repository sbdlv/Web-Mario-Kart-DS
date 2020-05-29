const RUTA_XML_KARTS = "karts.xml";
var velocidad = document.getElementById("vvelocidad");
var aceleracion = document.getElementById("vaceleracion");
var peso = document.getElementById("vpeso");
var manejo = document.getElementById("vmanejo");
var drift = document.getElementById("vdrift");
var items = document.getElementById("vitems");
var seccionKarts = document.getElementById("karts");
var kartSeleccionado;


function ajustarIframe() {
    var iFrameID = document.getElementById('iframeKarts');
    if (iFrameID) {
        // here you can make the height, I delete it first, then I make it again
        console.log("Iframe");
        console.log(iFrameID.contentWindow.document.body.scrollHeight);

        iFrameID.height = "";
        iFrameID.style.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
    }
}

function cambiarPersonaje(event) {
    let nombre = event.target.value;
    consultarPersonaje(nombre);

}

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
//Variables
const BASE_URL_THUMB = "img/karts/",
    FORMATO_THUMB = ".png";

var datosXML;
var karts;

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

function consultarPersonaje(nombre) {
    var karts = new Set();
    seccionKarts.innerHTML = "";
    let path = "karts/kart[propietario='" + nombre + "']";
    var nodes = datosXML.evaluate(path, datosXML, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext();
    while (result) {
        let nombre = result.getElementsByTagName("nombre")[0].innerHTML;
        let thumb = document.createElement("img");
        thumb.classList.add("kartIMG");
        thumb.classList.add("col");
        thumb.setAttribute("src", BASE_URL_THUMB + nombre + FORMATO_THUMB);
        thumb.value = nombre;
        thumb.onclick = function () {
            let kart = consultarKart(nombre);
            cargarKart(kart);
        }
        karts.add(thumb);
        result = nodes.iterateNext();
    }
    for (let kart of karts) {
        seccionKarts.appendChild(kart);
    }
}

function consultarKart(kart) {
    let path = "karts/kart[nombre='" + kart + "']";
    var nodes = datosXML.evaluate(path, datosXML, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext();
    var kart = new Kart();

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