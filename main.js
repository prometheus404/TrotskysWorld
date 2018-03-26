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
	    latoScacc = (9*latoMinore)/10;
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
    			stroke(255,255,0);
    			strokeWeight(4);
    		}
    		else{
    			stroke(0);
    			strokeWeight(1);
    		}
    		drawShape(x,y,matrix[rig][col]);
    	}
    }
    //disegna l'oggetto che viene draggato
    if(dragged != undefined){
    	drawShape(mouseX - offsetX, mouseY - offsetY, dragged);
    }
}

function drawShape(x,y,shape,tag){
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
	stroke(0);
	strokeWeight(1);
	fill(255);
	text(shape.tag,x + l/6,y + l/4,l-10,l-10);
}

function crea(s){
	for(let rig = 0; rig < 8; rig++){	//
		for(let col = 0; col < 8; col++){	//TROVA LA PRIMA CELLA LIBERA
			if(matrix[rig][col] == undefined){
				matrix[rig][col] = new Object();	//
				matrix[rig][col].type = s;			//CREA OGGETTO DI TIPO S
				matrix[rig][col].tag = new Array();	//
				return;
			}
		}
	}
}

function pulisci(){
	for(let rig = 0; rig < 8; rig++){
		for(let col = 0; col < 8; col++){
			for(let x of matrix[rig][col].tag)
				document.getElementById(x).onclick = function() {addTag(x);};
			matrix[rig][col] = undefined;
		}
	}
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

/*
		**********************
		* GESTIONE SELEZIONE *
		**********************
*/

function mouseClicked(){
	var x = posToCol(mouseX);
	var y = posToRig(mouseY);
	if(x == null || y == null || matrix[y][x] == undefined || dragged != undefined) return;
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
		**************************
		* GESTIONE TRASCINAMENTO *
		**************************
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
	if(x == null || y == null){
		for(let x of matrix[rig][col].tag)
			document.getElementById(x).onclick = function() {addTag(x);}; //riattiva i bottoni dei tag
		dragged = undefined;	//se trascinato fuori dalla scacchiera elimina l'oggetto trascinato
		if(dragX == selX && dragY == selY){
			selY = undefined;
			selX = undefined;	//evita che venga selezionata una casella vuota
		}
		return;
	}
	if(matrix[y][x] == undefined){
		matrix[y][x] = Object.create(dragged);
		dragged = undefined;
	}
	else{
		matrix[dragY][dragX] = Object.create(dragged);
		dragged = undefined;
	}
}

/*
		****************
		* GESTIONE TAG *
		****************
*/

function addTag(str){
	if(selX == undefined || selY == undefined) return;
	matrix[selY][selX].tag.push(str);
	document.getElementById(str).onclick = function() {removeTag(str);};
}

function removeTag(str){
	if(selX == undefined || selY == undefined || matrix[selY][selX].tag.indexOf(str) == -1) return;
	matrix[selY][selX].tag.splice(matrix[selY][selX].tag.indexOf(str), 1); //elimina il tag
	document.getElementById(str).onclick = function() {addTag(str);};
}

/*
		**************
		* LOGIC EVAL *
		**************
*/

function getElementByTag(tag){
	 for(rig = 0; rig < 8; rig++){
		 for(col = 0; col < 8; col++)
		 	if(matrix[rig][col].tag.indexOf(tag) != -1)
				return matrix[rig][col];
	 }
	 return -1;
}

function getPosByTag(tag){
	 for(rig = 0; rig < 8; rig++){
		 for(col = 0; col < 8; col++)
		 	if(matrix[rig][col].tag.indexOf(tag) != -1)
				return new Array(col, rig);
	 }
	 return -1;
}

function Square(tag){
	var elem = getElementByTag(tag);
	if(elem == -1) return false;
	if(elem.type == "cube") return true;
	return false;
}

function Circle(tag){
	var elem = getElementByTag(tag);
	if(elem == -1) return false;
	if(elem.type == "sphere") return true;
	return false;
}

function Triangle(tag){
	var elem = getElementByTag(tag);
	if(elem == -1) return false;
	if(elem.type == "triangle") return true;
	return false;
}

function RightOf(tagA, tagB){
	return getPosByTag(tagA)[0] < getPosByTag(tagB)[0];
}

function LeftOf(tagA, tagB){
	return getPosByTag(tagA)[0] > getPosByTag(tagB)[0];
}

function Over(tagA, tagB){
	return getPosByTag(tagA)[1] < getPosByTag(tagB)[1];
}

function Below(tagA, tagB){
	return getPosByTag(tagA)[1] > getPosByTag(tagB)[1];
}
