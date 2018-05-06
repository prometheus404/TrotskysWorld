var SMALL = 0.3, MEDIUM = 0.6, LARGE = 0.9;
var matrix = new Array();
var dragged = undefined, dragX, dragY;
var selX, selY;
var dimTesto;
var l, latoMinore, latoMaggiore, offsetX = 0, offsetY = 0, latoScacc;

function setup(){
	createCanvas(200, 200);
	//inizializza la scacchiera
	for(let rig = 0; rig < 8; rig++)
		matrix[rig] = new Array();
	setScreen();
	dimTesto = 15;
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
function resizeText(n){
	dimTesto = n;
}
function drawShape(x,y,shape,tag){
	var ll = l*shape.dim;
	switch(shape.type){
		case 'square':
			fill(255, 0, 0);
			rect(x, y, ll , ll);
			break;
		case 'circle':
			fill(0, 255, 0);
			ellipse(x, y, ll, ll);
			break;
		case 'triangle':
			fill(0,0,255);
			triangle(x, y + (3/8)*ll, x - (3/8)*ll, y - (3/8)*ll, x + (3/8)*ll, y - (3/8)*ll);
			break;
	}
	stroke(0);
	textSize(dimTesto);
	strokeWeight(2);
	fill(255);
	text(shape.tag,x + l/6,y + l/4,l-10,l-10);
}

function crea(s){
	if(selX != undefined && selY != undefined){	//se è selezionato un elemento
		matrix[selY][selX].type = s;				//ne sostituisce il tipo
		return;
	}
	for(let rig = 0; rig < 8; rig++){	//
		for(let col = 0; col < 8; col++){	//TROVA LA PRIMA CELLA LIBERA
			if(matrix[rig][col] == undefined){
				matrix[rig][col] = new Object();	//
				matrix[rig][col].type = s;			//CREA OGGETTO DI TIPO S
				matrix[rig][col].tag = new Array();	//
				matrix[rig][col].dim = LARGE;			//
				return;
			}
		}
	}
}

function setSize(dim){
	if(selX != undefined && selY != undefined)
		matrix[selY][selX].dim = dim;
}

function pulisci(){
	selX = undefined;
	selY = undefined;
	for(let rig = 0; rig < 8; rig++){
		for(let col = 0; col < 8; col++){
			if(matrix[rig][col] != undefined){
				for(let x of matrix[rig][col].tag)
					document.getElementById(x).onclick = function() {addTag(x);};
				matrix[rig][col] = undefined;
			}
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
	if(x == null || y == null || dragged != undefined) return;
	//se è già selezionato lo deseleziona
	if((selX == x && selY == y) || matrix[y][x] == undefined){
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
		for(let str of dragged.tag)
			document.getElementById(str).onclick = function() {addTag(str);}; //riattiva i bottoni dei tag
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
		 	if(matrix[rig][col] != undefined && matrix[rig][col].tag.indexOf(tag) != -1)
				return matrix[rig][col];
	 }
	 return -1;
}

function getPosByTag(tag){
	 for(rig = 0; rig < 8; rig++){
		 for(col = 0; col < 8; col++)
		 	if(matrix[rig][col] != undefined && matrix[rig][col].tag.indexOf(tag) != -1)
				return new Array(col, rig);
	 }
	 return -1;
}

function Square(tag){
	var elem = getElementByTag(tag);
	if(elem == -1) return null;					//magari bisogna trovare un metodo più elegante
	if(elem.type == "square") return true;
	return false;
}

function Circle(tag){
	var elem = getElementByTag(tag);
	if(elem == -1) return null;					//come sopra
	if(elem.type == "circle") return true;
	return false;
}

function Triangle(tag){
	var elem = getElementByTag(tag);
	if(elem == -1) return null;					//idem
	if(elem.type == "triangle") return true;
	return false;
}

function SameShape(tagA, tagB){
	var elem1 = getElementByTag(tagA);
	var elem2 = getElementByTag(tagB)
	if(elem1 == -1 || elem2 == -1) return null;
	if(elem1.type == elem2.type) return true;
	return false;
}

function RightOf(tagA, tagB){
	return getPosByTag(tagA)[0] < getPosByTag(tagB)[0];
}

function LeftOf(tagA, tagB){
	return getPosByTag(tagA)[0] > getPosByTag(tagB)[0];
}

function SameRow(tagA, tagB){
	return getPosByTag(tagA)[1] == getPosByTag(tagB)[1];
}

function SameCol(tagA, tagB){
	return getPosByTag(tagA)[0] == getPosByTag(tagB)[0];
}

function Between(tagA, tagB, tagC){ 											//a si trova tra b e c sulla stessa riga o la stessa colonna
	//boh poi ci penso
}

function Over(tagA, tagB){
	return getPosByTag(tagA)[1] < getPosByTag(tagB)[1];
}

function Below(tagA, tagB){
	return getPosByTag(tagA)[1] > getPosByTag(tagB)[1];
}

function Small(tag){
	var elem = getElementByTag(tag);
	if(elem == -1) return null;
	if(elem.dim == SMALL) return true;
	return false;
}

function Medium(tag){
	var elem = getElementByTag(tag);
	if(elem == -1) return null;
	if(elem.dim == MEDIUM) return true;
	return false;
}

function Large(tag){
	var elem = getElementByTag(tag);
	if(elem == -1) return null;
	if(elem.dim == LARGE) return true;
	return false;
}

function Smaller(tagA, tagB){
	var elem1 = getElementByTag(tagA);
	var elem2 = getElementByTag(tagB)
	if(elem1 == -1 || elem2 == -1) return null;
	if(elem1.dim < elem2.dim) return true;
	return false;
}

function Larger(tagA, tagB){
	var elem1 = getElementByTag(tagA);
	var elem2 = getElementByTag(tagB)
	if(elem1 == -1 || elem2 == -1) return null;
	if(elem1.dim > elem2.dim) return true;
	return false;
}

function SameSize(tagA, tagB){
	var elem1 = getElementByTag(tagA);
	var elem2 = getElementByTag(tagB)
	if(elem1 == -1 || elem2 == -1) return null;
	if(elem1.dim == elem2.dim) return true;
	return false;
}
/*
		***********************
		* GESTIONE FILE INPUT *
		***********************
*/

function readFile(path){
	var reader = new FileReader();
	reader.onload = function(event){
		var text = event.target.result;
		loadSet(text);
	};
	reader.readAsText(path.files[0]);
}

function loadSet(str){
	console.log(str);
	var text = str.split("#");
	// parte del contesto
	pulisci();																	//pulisce la scacchiera
	var shape = text[0].split("\n");
	console.log(shape);
	for(let x = 0; x < shape.length-1; x++)
		loadShape(shape[x].split(" "));
	// parte delle sentences
	for(let x = i; x > 0; x--)													//rimuove tutte le sentence presenti
		deleteSentence();
	var sentence = text[1].split("\n");
	console.log(sentence);
	for(let x = 1; x <= sentence.length -2; x++){								//per ogni sentence del file crea una sentence e la riempe con il testo
		newSentence();
		document.getElementById("text"+ (x)).value = sentence[x];
	}
}

function loadShape(token){														//crea una forma a partire da un array
	var rig = parseInt(token[0]);
	var col = parseInt(token[1]);
	matrix[rig][col] = new Object();
	matrix[rig][col].type = token[2];
	matrix[rig][col].dim = token[3];
	matrix[rig][col].tag = new Array();
	for(let i = 4; i < token.length; i++){
		selY = rig;
		selX = col;
		addTag(token[i]);
	}
}

/*
		************************
		* GESTIONE FILE OUTPUT *
		************************
*/

function saveFile(){
	var fileName = document.getElementById("filename").value;
	if(fileName.length == 0)
		return;
	else
		fileName = fileName + ".trot";
	console.log(fileName);
	var text = setToText();
	var textBlob = new Blob([text], {type:"text/plain"});
	var link = document.createElement('a');
	link.download = fileName;
	link.innerHTML = "Download File";
	if (window.webkitURL != null){
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        link.href = window.webkitURL.createObjectURL(textBlob);
    }
    else{
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        link.href = window.URL.createObjectURL(textBlob);
		link.id = "tmpLink"
        link.onclick = "document.body.removeChild(document.getElementById('tmpLink'))";
        link.style.display = "none";
        document.body.appendChild(link);
    }

    link.click();
}

function setToText(){
	var text = "";
	//parte del contesto
	for(let rig = 0; rig < 8; rig++){
		for(let col = 0; col < 8; col++){
			if(matrix[rig][col] != undefined){
				text += rig + " " + col + " " + matrix[rig][col].type + " " + matrix[rig][col].dim;
				for(let s of matrix[rig][col].tag)
					text += " " + s;
				text += "\n";
			}
		}
	}
	text += "#\n";
	//parte delle sentences
	for(let x = 1; x <= i; x++)
		text += document.getElementById("text" + x).value + "\n";

	return text;
}
