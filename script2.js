//Colocar archivo pdf en el canvas

function hacerPdf (){
  //variable con ruta del archivo
  var url = './assets/fabio.pdf';

  //Cargar script para acceder  al archivo de PDF.js.
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

  //poder visualizar las demas paginas

  
		function queueRenderPage(num) {
		  if (pageRendering) {
			pageNumPending = num;
		  } else {
			renderPage(num);
		  }
		}
	
	
		 //funcion para ver la pagina anterior
			
		function onPrevPage() {
		  if (pageNum <= 1) {
			return;
		  }
		  pageNum--;
		  queueRenderPage(pageNum);
		}
		document.getElementById('prev').addEventListener('click', onPrevPage);
	
		//funcion para ver la siguiente pagina
  
    function onNextPage() {
		  if (pageNum >= pdfDoc.numPages) {
			return;
		  }
		  pageNum++;
		  queueRenderPage(pageNum);
		}
    document.getElementById('next').addEventListener('click', onNextPage);
    
           
  //descargar el pdf de forma asincrona

  pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;

    //iniciar la primera pagina

  renderPage(pageNum);
  });
}
 hacerPdf();   
 
/*
 //ELEMENTO ARRASTRABLE

 const  elemento_arrastrar = document.getElementById('elementoArrastrar');
 const  elemento_dejar = document.getElementById('elementoDejar');


 elemento_arrastrar.addEventListener('dragstart' , (e)=> {

  e.dataTransfer.setData('text/plain',e.target.id)
    

 })

elemento_dejar.addEventListener('dragover', (e)=>{

  e.preventDefault();

})


elemento_dejar.addEventListener('drop',(e)=>{

  e.preventDefault();
  const element = document.getElementById(e.dataTransfer.getData('text'))
  element.classList.remove('active');
  elemento_dejar.appendChild(elemento_arrastrar.removeChild(element))
  console.log('se ha movido el objeto correctamente');

})
*/

 //////DIBUJAR EN EL CANVAS///////

var canvas = document.getElementById("the-canvas");
var ctx = canvas.getContext("2d");
var elemento = new Object();
var elementoActual = null;
var posicionX = 0;
var posicionY = 0;
var imagen = new Image();
imagen.src = './assets/firma.png';
var textoElemento = 'Arrastre el elemento!';
// funcion para dibujar elemento para arrastrar

function pintarElemento(valorX,valorY){

  ctx.fillStyle = elemento.color;
  ctx.lineWidth = elemento.anchoBorde;
  ctx.strokeStyle = elemento.borde;
  ctx.font="bold 20px arial"; //estilo de texto
  ctx.strokeText(textoElemento,elemento.x, elemento.y);
  ctx.fillRect(elemento.x, elemento.y,elemento.widht,elemento.height);
  //ctx.drawImage(imagen,elemento.x,elemento.y,elemento.widht,elemento.height);
  ctx.strokeRect(elemento.x, elemento.y,elemento.widht,elemento.height)
    //console.log('el valor de elemento' + elemento);
  //console.log('el valor de elementoActual' + elementoActual);
  
};

//parametros del objeto a pintar 
elemento = ({

  x:0,
  y:250,
  widht:250,
  height:100,
  color:'rgba( 254, 255, 255 ,0.1)',
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
  elemento.color = 'rgb( 106, 206, 224 )';
  console.log ('El valor de Y' + ' ' + elemento.y + ' ' +  'el valor de x' + ' ' + elemento.x);
  
  hacerPdf();
 
})

window.onload = pintarElemento();
