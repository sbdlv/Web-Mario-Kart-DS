const RUTA_XML_CIRCUITOS = "/xml/circuitos.xml";
const seccionCircuitos = document.getElementById("seccionCircuitos");
const PATH_XML_COPA = "circuitos/circuito[copa='"
const PATH_XML_CIRCUITO = "circuitos/circuito[nombre='"
const RUTA_IMAGENES_CIRCUITOS = "/img/circuitos/"

const NOMBRE_CIRCUITO = document.getElementById("nombreCircuito");
const IMAGEN_CIRCUITO = document.getElementById("imagenCircuito");
const DESCRIPCION_CIRCUITO = document.getElementById("descripcionCircuito");

//Funciones para los botoes de las copas
for (let boton of document.getElementsByClassName("botonCopa")) {
    boton.onclick = function () {
        consultarCopa(event.target.value);
    }
}

//XML
//Realizar peticion de los datos XML
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        datosXML = this.responseXML;
        //Valores principales 

    }
};
xhttp.open("GET", RUTA_XML_CIRCUITOS, true);
xhttp.send();

class Circuito {
    constructor(nombre, imagen, descripcion) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.descripcion = descripcion;
    }
}

function consultarCopa(copa) {
    seccionCircuitos.innerHTML = ""; //Resetear el div de circuitos
    let path = PATH_XML_COPA + copa + "']"; //Path para sacar los karts del personaje
    var nodes = datosXML.evaluate(path, datosXML, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext(); //Ponemos el puntero en el primero resultado.
    //Recorremos los resultados y generamos los elementos <img> de los karts
    while (result) {
        let nombre = result.getElementsByTagName("nombre")[0].innerHTML;
        console.log(nombre);

        let imagen = result.getElementsByTagName("imagen")[0].innerHTML;
        let thumb = document.createElement("img");
        thumb.classList.add("imagenCircuito");
        thumb.classList.add("ml-4");
        thumb.classList.add("mr-4");

        thumb.setAttribute("src", RUTA_IMAGENES_CIRCUITOS + imagen);
        thumb.value = nombre;
        //Función para más tarde controlar los clicks en las imagenes 
        thumb.onclick = function () {
            cargarCircuito(consultarCircuito(nombre));
        }
        result = nodes.iterateNext(); //Siguiente resultado
        seccionCircuitos.appendChild(thumb);
    }
}

/**
 * 
 * @param {String} nombre 
 * @returns {Circuito}
 */
function consultarCircuito(nombre) {    
    let path = PATH_XML_CIRCUITO + nombre + "']"; //Path para sacar los karts del personaje
    var nodes = datosXML.evaluate(path, datosXML, null, XPathResult.ANY_TYPE, null);


    var result = nodes.iterateNext();


    if (result) {
        let circuito = new Circuito(result.getElementsByTagName("nombre")[0].innerHTML,
            result.getElementsByTagName("imagen")[0].innerHTML,
            result.getElementsByTagName("descripcion")[0].innerHTML);
        console.log(circuito);

        return circuito;
    }
}

/**
 * 
 * @param {Circuito} circuito 
 */
function cargarCircuito(circuito) {
    NOMBRE_CIRCUITO.innerText = circuito.nombre;
    IMAGEN_CIRCUITO.setAttribute("src", RUTA_IMAGENES_CIRCUITOS + circuito.imagen);
    DESCRIPCION_CIRCUITO.innerText = circuito.descripcion;
}

