var debug = document.getElementById("debug");
var barra = document.getElementById("barra");

debug.onchange = function(){
    let valor = barra.lastElementChild;
    console.log(debug.value);
    console.log();
    
    
    valor.style.width = debug.value + "%";
}