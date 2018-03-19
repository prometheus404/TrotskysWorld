var matrix = new Array();
var dragging = false;
var l;
var selRig, selCol;
var latoMinore, latoMaggiore;
var offsetX, offsetY, latoScacc;

function setup() {
    var w = windowWidth/2;
    var h = (3*windowHeight)/4;
    createCanvas(w, h);
    for(let rig = 0; rig < 8; rig++){
        matrix[rig] = new Array();
    }
    if(width < height){
        latoMinore = width;
        latoMaggiore = height;
        latoScacc = (9*latoMinore)/10;
        offsetX = 0.05*latoMinore;
        offsetY = (latoMaggiore - latoScacc)/2;
    }
    else{
        latoMinore = height;
        latoMaggiore = width;
        latoScacc = (9*latoMinore)/10;
        offsetX = (latoMaggiore - latoScacc)/2;
        offsetY = 0.05*latoMinore;
    }
}

function draw() {
    background(71, 71, 71);
    translate(offsetX, offsetY);
    for(let rig = 0; rig < 8; rig++){
        for(let col = 0; col < 8; col++){
            if((rig+col) % 2 == 0){
                fill(255);
            }
            else {
                fill(0);
            }
            l = latoScacc/8;
            rect(col*l, rig*l, l, l);
        }
    }
    for(let rig = 0; rig < 8; rig++){
        for(let col = 0; col < 8; col++){
            if(matrix[rig][col] != undefined){
                switch(matrix[rig][col].type){
                    case 'cube':
                        if(matrix[rig][col].selected == true){
                            var x = mouseX - 100;
                            var y = mouseY - 20;
                        }
                        else{
                            var x = col*l+5;
                            var y = rig*l+5;
                        }
                        fill(255, 0, 0);
                        rect(x, y, l-10, l-10);
                        break;
                    case 'sphere':
                        if(matrix[rig][col].selected == true){
                            var x = mouseX - offsetX;
                            var y = mouseY - offsetY;
                        }
                        else{
                            var x = col*l+((l-10)/2)+5;
                            var y = rig*l+((l-10)/2)+5;
                        }
                        fill(0, 255, 0);
                        ellipse(x, y, l-10, l-10);
                        break;
                }
            }
        }
    }
}
function windowResized(){
    resizeCanvas(windowWidth/2, windowHeight/2);
}
function mouseClicked(){
    var x = mouseX;
    var y = mouseY;
    if(x >= offsetX && x <= offsetX + latoScacc && y >= offsetY && y <= offsetY + latoScacc){
        var rig = (int)((y-offsetY)/l)
        console.log("riga: " + rig);
        var col = (int)((x-offsetX)/l)
        console.log("col: " + col);
        if(dragging == false && matrix[rig][col] != undefined){
            cursor(HAND);
            dragging = true;
            matrix[rig][col].selected = true;
            selRig = rig;
            selCol = col;
        }
        if(dragging == true && matrix[rig][col] == undefined){
            cursor(ARROW);
            matrix[rig][col] = new Object();
            matrix[rig][col].type = matrix[selRig][selCol].type;
            matrix[selRig][selCol] = undefined;
            matrix[rig][col].selected = false;
            dragging = false;
        }
    }
    else if(dragging == true){        //se fuori dalla scacchiera, elimina shape
        matrix[selRig][selCol] = undefined;
        dragging = false;
        cursor(ARROW);
    }

}

function crea(s){
    var placed = false;
    for(let rig = 0; rig < 8; rig++){
        for(let col = 0; col < 8; col++){
            if(matrix[rig][col] == undefined){
                switch (s) {
                            case 'cube':
                                matrix[rig][col] = new Object();
                                matrix[rig][col].type = 'cube';
                                matrix[rig][col].selected = false;
                                placed = true;
                                break;
                            case 'sphere':
                                matrix[rig][col] = new Object();
                                matrix[rig][col].type = 'sphere';
                                matrix[rig][col].selected = false;
                                placed = true;
                                break;
                }
            }
            if(placed)
                break;
        }
        if(placed)
            break;
    }
}
function pulisci(){
    for(let rig = 0; rig < 8; rig++){
        for(let col = 0; col < 8; col++){
            matrix[rig][col] = undefined;
        }
    }
}
