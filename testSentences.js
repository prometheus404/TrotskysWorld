var i = 0;
function newSentence(){
    i++;
    var id = "text"+i;
    var inp = document.createElement("input");
    inp.type = "text";
    inp.placeholder="Sentence";
    inp.style="top: 0%";
    inp.id = id;
    inp.class = "sentInput"
    var div = document.getElementById("sentences");
    div.appendChild(inp);
}

function deleteSentence(){
    var id = "text"+i;
    var inp = document.getElementById(id);
    var div = document.getElementById("sentences");
    div.removeChild(inp);
    i--;

}

function evaluateSentence(){
    for(let x = 0; x < i; x++){
        console.log(x);
        console.log(document.getElementById("text"+ (x+1)).value);
        if(evaluate(document.getElementById("text"+ (x+1)).value))                                                   //se la frase è vera chiama trueSentence
            trueSentence(x+1);
        else                                                                    //altrimenti chiama falseSentence
            falseSentence(x+1);
    }
}

function trueSentence(i){
    //fill
    var id = "text"+i;
    console.log("true");
    document.getElementById(id).style.borderColor = "#33e02a";
    console.log("verde");
}

function falseSentence(){
    console.log('false');
    //fill
    var id = "text"+i;
    document.getElementById(id).style.borderColor = "red";
    console.log("rosso");
}
