function evaluate(s){
    var numPar = 0;
    var operators = new Array();
    var posOperators = new Array();
    s = s.replace(/\s/g,'');

    //trova gli operatori principali e ne salva posizione e tipo in due array
    for(let i = 0; i < s.length; i++){
        if(s.charAt(i) == '(') numPar++;
        if(s.charAt(i) == ')') numPar--;
        if(numPar == 0 && (s.charAt(i) == '&' || s.charAt(i) == '|')){
            operators.push(s.charAt(i));
            console.log(s.charAt(i)),
            posOperators.push(i);
            console.log(i);
        }
    }
    console.log("numero operatori:"+operators.length);

    //se alla fine il numero di parentesi è diverso da 0 errore
    if(numPar != 0){
        return error();
    }

    //se non trova operatori prova a valutare la stringa come atomica
    if(operators.length == 0){
         try{
            return eval(s);                                                     //altrimenti è il valore
         }
         catch(e){                                                              //se non funziona toglie le parentesi e riprova
             var par1 = s.indexOf('(');
             var par2 = s.lastIndexOf(')');
             if(par1 == -1 || par2 == -1) return error();                       //se non ci sono parentesi lancia un errore
             s = s.substring(1, s.length-1);
             return evaluate(s); //ripeti la valutazione
         }
    }

    var result = evaluate(s.substring(0, posOperators[0]));                     //setta il risultato di partenza con il valore della prima parte
    console.log("primo elem:"+result);

    for(let x = 0; x < posOperators.length; x++){                               //mano a mano ci aggiunge le altre
        var start = posOperators[x];
        console.log("prossimo init" + start);
        console.log("prossimo fin" + ((x == posOperators.length - 1)?s.length:posOperators[x+1]));
        console.log('prossimo str:' + s.substring(posOperators[x]+1, x == posOperators.length - 1? s.length : posOperators[x+1]));
        var next = evaluate(s.substring(posOperators[x]+1, x == posOperators.length - 1? s.length : posOperators[x+1]));
        console.log("prossimo val:"+next);
        switch(operators[x]){
            case '&': result = result && next;
            case '|': result = result || next;
        }
        console.log("risultato parziale:" + result);
    }
    console.log("risultato:"+result);
    return result;                                                              //ritorna il risultato
}

function error(){
    console.log("errore");
    alert("syntax error");
    //colora la striscia
    return undefined;
}
