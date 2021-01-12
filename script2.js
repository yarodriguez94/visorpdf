//Colocar archivo pdf en el canvas

function hacerPdf (){
  //variable con ruta del archivo
  var url = './assets/anexo.pdf';

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
  //ctx.fillRect(10,10,500,500);
  //ctx.globalAlpha = 0.2;
  //ctx.clearRect(0,0, canvas.width,canvas.height);
  
  ctx.fillStyle = elemento.color;
  ctx.lineWidth = elemento.anchoBorde;
  ctx.strokeStyle = elemento.borde;
  ctx.fillRect(elemento.x, elemento.y,elemento.widht,elemento.height);
  ctx.strokeRect(elemento.x, elemento.y,elemento.widht,elemento.height)
  
};

//parametros del objeto a pintar 
elemento = ({

  x:150,
  y:250,
  widht:100,
  height:100,
  color:'red',
  borde:'rgba( 161, 167, 167 ,0.2)',
  anchoBorde :2

});

//elemento.color= 'black';

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

 //console.log(elemento.y);
 
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
   
   //elemento.x = mousePos.x;
   //elemento.y = mousePos.y;
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
    
    //pintarElemento();
    elementoActual.color = 'rgba(255, 255,255, 0.0)';
   }
 
   pintarElemento();
    
 });
}
pintarElementoMouse();

//funcion al levantar el clic del mouse
canvas.addEventListener("mouseup", ()=>{

  elementoActual = null;
  console.log('este es el valor del elementoActual' + elementoActual + 'y este es el valor del elemento inicial' + elemento );
  elemento.color = 'blue';
  console.log ('El valor de Y' + ' ' + elemento.y + ' ' +  'el valor de x' + ' ' + elemento.x);
  
  hacerPdf();
 
})

window.onload = pintarElemento();