var matrix = new Array();
var dragged = undefined, dragX, dragY;
var selX, selY;
var l, latoMinore, latoMaggiore, offsetX = 0, offsetY = 0, latoScacc;

function setup(){
	createCanvas(200, 200);
	//inizializza la scacchiera
	for(let rig = 0; rig < 8; rig++)
		matrix[rig] = new Array();
	setScreen();
}

function windowResized(){
	setScreen();
}

function setScreen(){
	//adatta allo schermo
	var w = windowWidth/2;
	var h = (3*windowHeight)/4;
	resizeCanvas(w,h);
	//setta variabili posizionamento
	if(width < height){
	    latoMinore = width;
	    latoMaggiore = height;
	    latoScacc = (9*latoMinore)/10;
	    offsetX = 0.05*latoMinore;	//lascia un 10% di spazio sul lato piu piccolo
	    offsetY = (latoMaggiore - latoScacc)/2;	//regola il lato maggiore di conseguenza
	}
	else{
	    latoMinore = height;
	    latoMaggiore = width;
	    latoScacc = (9*latoMinore)/10;w
	    offsetX = (latoMaggiore - latoScacc)/2;
	    offsetY = 0.05*latoMinore;
    }
}

function draw(){
	background(71,71,71);
	translate(offsetX, offsetY);
	stroke(0);
	strokeWeight(1);
	rectMode(CENTER);
	//triangleMode(CENTER);
	//disegna la scacchiera
	for(let rig = 0; rig < 8; rig++){
        for(let col = 0; col < 8; col++){
            if((rig+col) % 2 == 0){		//
                fill(255);				//
            }							// DISEGNA QUADRATI BIANCHI
            else {						// E NERI ALTERNATI
                fill(0);				//
            }							//
            l = latoScacc/8;
            rect(col*l + l/2, rig*l + l/2, l, l);
        }
    }
    //disegna gli oggetti shape
    for(let rig = 0; rig < 8; rig++){
    	for(let col = 0; col < 8; col++){
    		//se la cella è vuota passa al prossimo
    		if(matrix[rig][col] == undefined)
    			continue;
    		//altrimenti disegna la forma
    		var x = col*l + l/2;
    		var y = rig*l + l/2;
    		if(rig == selY && col == selX){
    			stroke(0,255,0);
    			strokeWeight(4);
    		}
    		else{
    			stroke(0);
    			strokeWeight(1);
    		}
    		drawShape(x,y,matrix[rig][col])
    	}
    }
    //disegna l'oggetto che viene draggato
    if(dragged != undefined){
    	drawShape(mouseX - offsetX, mouseY - offsetY, dragged);
    }
}

function drawShape(x,y,shape){
	switch(shape.type){
		case 'cube':
			fill(255, 0, 0);
			rect(x, y, l-10, l-10);
			break;
		case 'sphere':
			fill(0, 255, 0);
			ellipse(x, y, l-10, l-10);
			break;
		case 'triangle':
			fill(0,0,255);
			triangle(x, y + (3/8)*l, x - (3/8)*l, y - (3/8)*l, x + (3/8)*l, y - (3/8)*l);
			break;
	}
}

function crea(s){
	for(let rig = 0; rig < 8; rig++){	//
		for(col = 0; col < 8; col++){	//TROVA LA PRIMA CELLA LIBERA
			if(matrix[rig][col] == undefined){
				matrix[rig][col] = new Object();	//
				matrix[rig][col].type = s;			//CREA OGGETTO DI TIPO S
				return;
			}
		}
	}
}

function pulisci(){
	for(let rig = 0; rig < 8; rig++)
		for(let col = 0; col < 8; col++)
			matrix[rig][col] = undefined;
}

function posToRig(y){
	if(y < offsetY ||y > offsetY + latoScacc)
		return null;
	return (int)((y-offsetY)/l);
}

function posToCol(x){
	if(x < offsetX ||x > offsetX + latoScacc)
		return null;
	return (int)((x-offsetX)/l);
}

function mouseClicked(){
	var x = posToCol(mouseX);
	var y = posToRig(mouseY);
	if(x == null || y == null) return;
	//se è già selezionato lo deseleziona
	if(selX == x && selY == y){
		selX = undefined;
		selY = undefined;
	}
	//altrimenti lo seleziona
	else{
		selX = x;
		selY = y;
	}
}

/*
		*********************************
		*PARTE DEDICATA AL TRASCINAMENTO*
		*********************************
*/
function mousePressed(){
	dragX = posToCol(mouseX);
	dragY = posToRig(mouseY);
}

function mouseDragged(){
	if(dragged == undefined && dragX != null && dragY != null){
		dragged = Object.create(matrix[dragY][dragX]);
		matrix[dragY][dragX] = undefined;
	}
}

function mouseReleased(){
	if(dragged == null) return;
	var x = posToCol(mouseX);
	var y = posToRig(mouseY);
	if(x == null || y == null) return;
	if(matrix[y][x] == undefined){
		matrix[y][x] = Object.create(dragged);
		dragged = undefined;
	}
}
