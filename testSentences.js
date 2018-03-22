var i = 0;
function newSentence(){
    i++;
    var id = "text"+i;
    var inp = document.createElement("input");
    inp.type = "text";
    inp.placeholder="Sentence";
    inp.style="top: 10%";
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
