//Colocar archivo pdf en el canvas

function hacerPdf (){
  //variable con ruta del archivo
  var url = './assets/fabio.pdf';

  //Cargar script,  para acceder  al archivo de PDF.js.
  pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

  //crear las variables de entorno para rendereizar el archivo pdf asi como la paginacion
  var pdfDoc = null,
  pageNum = 1,
  pageRendering = false,
  pageNumPending = null,
  scale = 2,
  canvas = document.getElementById('the-canvas'),
  ctx = canvas.getContext('2d');

  /**Obtener información de la página del documento
  *
  *@param num Page Number.
  */

  //Esta funcion renderiza el PDF para mostrarlo
  function renderPage(num) {
    pageRendering = true;

    //Se usa una promesa para recuperar la pagina

    pdfDoc.getPage(num).then(function(page) {
      var viewport = page.getViewport({scale: scale});
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      //Se crea un objeto para renderizar la pagina del Pdf

      var renderContext = {
          canvasContext: ctx,
          viewport: viewport
      };
      var renderTask = page.render(renderContext);

      //Esperar hasta que se termine el renderizado

      renderTask.promise.then(function() {
          pageRendering = false;
          if (pageNumPending !== null) {
            // La nueva representación de la página está pendiente
            renderPage(pageNumPending);
            pageNumPending = null;
          }
      });
    });
    //Actualizar el contador de  las paginas
    document.getElementById('page_num').textContent = num;
  }

  //descargar el pdf de forma asincrona

  pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;

    //iniciar la primera pagina

  renderPage(pageNum);
  });
}

hacerPdf();
    
//////DIBUJAR EN EL CANVAS///////

var canvas = document.getElementById("the-canvas");
var ctx = canvas.getContext("2d");
var elemento = new Object();
var elementoActual = null;
var posicionX = 0;
var posicionY = 0;

// funcion para dibujar elemento para arrastrar

function pintarElemento(valorX,valorY){

  
  //hacerPdf();
  //ctx.fillStyle = 'white';
  //ctx.fillStyle = 'rgba(253,254,254,0.1)';
  //ctx.fillRect(0,0,500,500);
  //ctx.globalAlpha = 0.2;
  //ctx.clearRect(0,0, canvas.width,canvas.height);
  
  ctx.fillStyle =elemento.color;
  ctx.fillRect(elemento.x, elemento.y,elemento.widht,elemento.height);
  
  
};

//parametros del objeto a pintar 
elemento = ({

  x:15,
  y:15,
  widht:100,
  height:100,
  color:'red'

});


//llamar a la funcion para pintar el objeto
pintarElemento();

 //funcion para capturar la posicion del mouse dentro del canvas

 function onMousePos (canvas, e) {

  var pos = canvas.getBoundingClientRect();

  return {
    
    //retorna la posicion del mouse dentro del canvas
    x: Math.round(e.clientX - pos.left),
    y: Math.round(e.clientY - pos.top)

  };

 }
 
 //funcion para escuchar cuando se haga clic sobre el canvas

 canvas.addEventListener("mousedown", function(e) {

  var mousePos = onMousePos(canvas, e);
  
  if ( elemento.x < mousePos.x && (elemento.widht + elemento.x > mousePos.x
      && elemento.y < mousePos.y) && (elemento.height + elemento.y > mousePos.y)
     ){
  
      console.log("se ha encontrado el elemento");

      elementoActual = elemento;
      posicionX = mousePos.x - elemento.x;
      posicionY = mousePos.y - elemento.y;
  
   }
   pintarElemento();
 });

//Pintar el elemento segun la posicion el mouse

function pintarElementoMouse (){
  
  canvas.addEventListener("mousemove", function(e){

  if(elementoActual !=null){

    var mousePos = onMousePos(canvas, e);  
    console.log("entro al condicional del mousemove");
    elementoActual.x = mousePos.x - posicionX;
    elementoActual.y = mousePos.y - posicionY;
    
    pintarElemento();
  }
  
    
 });
}

pintarElementoMouse();

//funcion al levantar el clic del mouse
canvas.addEventListener("mouseup", ()=>{

  elementoActual = null;

})

 /* 
  var mousePos = onMousePos(canvas, e);
  console.log(mousePos);

    elementDraw ({
      x:10,
      y:20,} ,ctx);

         //evaluar si el mouse se encuentra sobre el canvas 
      if (ctx.isPointInPath(mousePos.x, mousePos.y)) {
        arrastrar = true;
        delta.x = X - mousePos.x;
        delta.y = Y - mousePos.y;
      }*/
   
 //});

 
 //funcion para escuchar cuando el mouse se mueva dentro del canvas
/*
canvas.addEventListener("mousemove", function(e){

  //console.log("se esta moviendo el mouse dentro del recuadro");
  //var mousePos = onMousePos(canvas, e);

  if (elementoActual !=null) {

    elementoActual.x = e.clientX;
    elementoActual = e.clientY;
  }
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
   


}, false);

 //funcion para escuchar cuando se levante el clic del mouse

 canvas.addEventListener("mouseup",function(e){

  arrastrar =  false;

 }, false );

*/


 /*
 var caja = document.getElementById('cajaPrueba');

 caja.addEventListener('mousemove', () => {
  
  console.log("Esta moviendo el mouse sobre el elemento");

 });
 
 var canvas = document.getElementById('the-canvas');
 canvas.addEventListener('mousemove',()=>{

  console.log("Se esta moviendo sobre el elemento canvas");

 }) */

 //////////////////////////////

/*
var canvas = document.getElementById("the-canvas");
if (canvas && canvas.getContext) {
  var ctx = canvas.getContext("2d");
  if (ctx) {
    var arrastrar = false;
    var delta = new Object();
    var L = 5;
    var paso = 2;
    var R = 100;
    var X = canvas.width / 2;
    var Y = canvas.height / 2;

    function dibujarUnaEstrella(R, L, paso, X, Y) {

      ctx.fillStyle = "#6ab150";
      var estrella = L / paso
      var rad = (2 * Math.PI) / estrella;

      ctx.beginPath();
      for (var i = 0; i < L; i++) {
        x = X + R * Math.cos(rad * i);
        y = Y + R * Math.sin(rad * i);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    dibujarUnaEstrella(R, L, paso, X, Y);

    function oMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return { // devuelve un objeto
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
      };
    }

    canvas.addEventListener("mousedown", function(evt) {
      var mousePos = oMousePos(canvas, evt);

      console.log("Se ha echo clic sobre el elemento");

      dibujarUnaEstrella(R, L, paso, X, Y);
      if (ctx.isPointInPath(mousePos.x, mousePos.y)) {
        arrastrar = true;
        delta.x = X - mousePos.x;
        delta.y = Y - mousePos.y;
      }
    }, false);

    canvas.addEventListener("mousemove", function(evt) {
      var mousePos = oMousePos(canvas, evt);

      console.log("Se esta movienod sobre el elemento dentro del canvasa")

      if (arrastrar) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        X = mousePos.x + delta.x, Y = mousePos.y + delta.y

        dibujarUnaEstrella(R, L, paso, X, Y);
      }
    }, false);

    canvas.addEventListener("mouseup", function(evt) {
      arrastrar = false;
    }, false);
  }
}
*/