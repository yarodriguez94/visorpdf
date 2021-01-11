// If absolute URL from the remote server is provided, configure the CORS
		// header on that server.
		var url = './assets/fabio.pdf';

		// Loaded via <script> tag, create shortcut to access PDF.js exports.
		var pdfjsLib = window['pdfjs-dist/build/pdf'];

		// The workerSrc property shall be specified.
		pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
		//pdfjsLib.GlobalWorkerOptions.workerSrc = '<?php echo sc_url_library('prj', 'pdfjs','build/pdf.worker.js'); ?>';

			
		var pdfDoc = null,
		pageNum = 1,
		pageRendering = false,
		pageNumPending = null,
		scale = 2,
		canvas = document.getElementById('the-canvas'),
		ctx = canvas.getContext('2d');

		/**
		 * Get page info from document, resize canvas accordingly, and render page.
		 * @param num Page number.
		 */
	
		 //Esta funcion renderiza el PDF para mostrarlo
		 function renderPage(num) {
		  pageRendering = true;
		  // Using promise to fetch the page
		  pdfDoc.getPage(num).then(function(page) {
			var viewport = page.getViewport({scale: scale});
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			// Render PDF page into canvas context
			var renderContext = {
			  canvasContext: ctx,
			  viewport: viewport
			};
			var renderTask = page.render(renderContext);

			// Wait for rendering to finish
			renderTask.promise.then(function() {
			  pageRendering = false;
			  if (pageNumPending !== null) {
				// New page rendering is pending
				renderPage(pageNumPending);
				pageNumPending = null;
			  }
			});
		  });

		  // Update page counters
		  document.getElementById('page_num').textContent = num;
		}

		/**
		 * If another page rendering in progress, waits until the rendering is
		 * finised. Otherwise, executes rendering immediately.
		 */
	/*
		function queueRenderPage(num) {
		  if (pageRendering) {
			pageNumPending = num;
		  } else {
			renderPage(num);
		  }
		}
	
	*/	
		 //Displays previous page.
		 
	/*
		function onPrevPage() {
		  if (pageNum <= 1) {
			return;
		  }
		  pageNum--;
		  queueRenderPage(pageNum);
		}
		document.getElementById('prev').addEventListener('click', onPrevPage);
	*/
		/**
		 * Displays next page.
		 */
	/*	function onNextPage() {
		  if (pageNum >= pdfDoc.numPages) {
			return;
		  }
		  pageNum++;
		  queueRenderPage(pageNum);
		}
		document.getElementById('next').addEventListener('click', onNextPage);
*/
		/**
		 * Asynchronously downloads PDF.
		 */
		pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
		  pdfDoc = pdfDoc_;
		  document.getElementById('page_count').textContent = pdfDoc.numPages;

		  // Initial/first page rendering
		  renderPage(pageNum);
		});
		
		//saber eje x y eje y
		
		var elemento = document.getElementById('the-canvas');
		var posicion = elemento.getBoundingClientRect();

		//console.log("la posicion" + posicion.top, posicion.right, posicion.bottom, posicion.left);
		
		//ELEMENTO ARRASTRABLE

		const elementoArrastrar = document.getElementById('elemento-arrastrar')
		const elementoSoltar = document.getElementById('elemento-soltar')

		//iniciar el evento de arrastre
		elementoArrastrar.addEventListener('dragstart', (e) => {
			e.dataTransfer.setData('text/plain',e.target.id)//traer el id del elemento arrastrado
			console.log(e.target.id);
		});
		
		//zona para soltar el elemento
		elementoSoltar.addEventListener('dragover', (e) => {

			e.preventDefault()
		})

        //soltar el elemento en otra zona
		elementoSoltar.addEventListener('drop', (e) => {

			e.preventDefault()
			const elemento = document.getElementById(e.dataTransfer.getData('text'))
			//console.log(e.dataTransfer.getData)
			//elemento.classList.remove('active')
            elementoSoltar.appendChild(elementoArrastrar.removeChild(elemento))
            //elementoArrastrar.appendChild(elementoSoltar.removeChild(elemento))

            
            
        })

        
        elementoArrastrar.addEventListener('drop',(e) => {

            e.preventDefault()
            const elemento2 = document.getElementById(e.dataTransfer.getData('text'))
            console.log(e.dataTransfer.getData)
            elementoArrastrar.appendChild(elementoSoltar.removeChild(elemento2))

        })
	
		
		//dibujar una estrella

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

	//Leeer la posicion del mouse
    function oMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return { // devuelve un objeto
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
      };
    }

    canvas.addEventListener("mousedown", function(evt) {
      var mousePos = oMousePos(canvas, evt);

      dibujarUnaEstrella(R, L, paso, X, Y);
      if (ctx.isPointInPath(mousePos.x, mousePos.y)) {
        arrastrar = true;
        delta.x = X - mousePos.x;
        delta.y = Y - mousePos.y;
      }
    }, false);

    canvas.addEventListener("mousemove", function(evt) {
      var mousePos = oMousePos(canvas, evt);

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