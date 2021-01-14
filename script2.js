//Colocar archivo pdf en el canvas

 //variable con ruta del archivo
var url = './assets/fabio.pdf';

 //Cargar script para acceder  al archivo de PDF.js.
 pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

  var pdfDoc = null,
  pageNum = 1,
  pageRendering = false,
  pageNumPending = null,
  scale = 2,
  canvas = document.getElementById('the-canvas'),
  ctx = canvas.getContext('2d');

  //Funcion para renderizar el PDF y mostrarlo
  function renderPage(num) {
    pageRendering = true;

    //Se usa una promesa para tomar la  primera pagina y declarar el tamaño del pdf dentro del canvas

    pdfDoc.getPage(num).then(function(page) {
      var viewport = page.getViewport({scale: scale});
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      //Se crean las propiedades del contexto para renderizar el pdf en el viewport 

      var renderContext = {
          canvasContext: ctx,
          viewport: viewport
      };
      var renderTask = page.render(renderContext);

      //Promesa para renderizar el documento pdf

      renderTask.promise.then(function() {
          pageRendering = false;
          if (pageNumPending !== null) {
            
            renderPage(pageNumPending);
            pageNumPending = null;
          }
      });
    });
    //Mostrar la primera pagina
    document.getElementById('page_num').textContent = num;
    
  }
    
  //funcion para validar la pagina actual 
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
      //console.log('este es el numero de pagina'+ pageNum);
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

      var botonAtras = document.getElementById('prev');
      var botonAdelante = document.getElementById('next');
      botonAtrasEvent = botonAtras.addEventListener('click',() =>{

      var numPage = null;

      numPage = pageNum;

      });

      botonAdelanteEvent = botonAdelante.addEventListener('clic',()=>{

        numPage = pageNum;

      })

      if (botonAtrasEvent){

        renderPage(numPage); 
        console.log('entro en el primer condicional');

      }else if (botonAdelanteEvent) {

        renderPage(pageNum);
        console.log('entro en el segundo condicional');

      }else {

        renderPage(pageNum);
        console.log('entro en el ultimo condicional' + pageNum);
      }
   
    });
//}
  
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

//hacer scroll dentro del canvas
/*
var width = window.innerWidth;
var height = window.innerHeight;

var estado = new Konva.Stage ({

  container: 'elementoDejar',
  widht : width,
  height : height,
  dragabble: true,
});

var capa = new Konva.Layer ();
estado.add(capa);

estado.draw();*/


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

function pintarElemento(){

  ctx.fillStyle = elemento.color;
  ctx.lineWidth = elemento.anchoBorde;
  ctx.strokeStyle = elemento.borde;
  ctx.font="bold 20px Arial"; //estilo de texto
  ctx.strokeText(textoElemento,elemento.x, elemento.y);
  ctx.fillRect(elemento.x, elemento.y,elemento.widht,elemento.height);
  //ctx.drawImage(imagen,elemento.x,elemento.y,elemento.widht,elemento.height);
  ctx.strokeRect(elemento.x, elemento.y,elemento.widht,elemento.height)
  
};

//parametros del objeto a pintar 
elemento = ({

  x:0,
  y:250,
  widht:250,
  height:70,
  color:'rgba( 254, 255, 255 ,0.1)',
  borde:'rgba( 231, 139, 139 ,0.1)',
  anchoBorde :2

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
  
      //console.log("se ha encontrado el elemento");

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
    elementoActual.x = mousePos.x - posicionX;
    elementoActual.y = mousePos.y - posicionY;

    var scrollY = elementoActual.y;
    var scrollX = elementoActual.x;
    window.scroll(scrollX,scrollY);
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
  elemento.color = 'rgb( 254, 255, 255 )';
    
  renderPage(pageNum);
  
})
