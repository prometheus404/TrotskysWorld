function evaluate(s){
    var numPar = 0;
    var operators = new Array();
    var posOperators = new Array();
    s = s.replace(/\s/g,'');

    //trova gli operatori principali e ne salva posizione e tipo in due array
    for(let i = 0; i < s.length; i++){
        if(s.charAt(i) == '(') numPar++;
        if(s.charAt(i) == ')') numPar--;
        if(numPar == 0 && (s.charAt(i) == '&' || s.charAt(i) == '|' || s.charAt(i) == '-' || s.charAt(i) == '_')){
            operators.push(s.charAt(i));
            console.log(s.charAt(i));
            posOperators.push(i);
            console.log(i);
        }
    }
    console.log("numero operatori:"+operators.length);
    console.log(s);

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
             console.log(s.charAt(1));
             console.log(s.substring(par1+1, par2));
             console.log(s.charAt(0));
             switch(s.charAt(0)){
                 case '%':  console.log('esiste');
                            return exist(s.charAt(1), s.substring(par1+1, par2));
                            break;
                 case '$':  console.log('perogni');
                            return forEach(s.charAt(1), s.substring(par1+1, par2));
                            break;
                 case '!':  console.log('!');
                            if(s.charAt(1) == '%')
                                return !exist(s.charAt(2), s.substring(par1+1, par2));
                            if(s.charAt(1) == '('){
                                return !evaluate(s.substring(2,par2));
                            }
                 default:   s = s.substring(1, s.length-1);
                            return evaluate(s); //ripeti la valutazione
             }
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
            case '&': result = result && next; break;
            case '|': result = result || next; break;
            case '-': result = !result || (result && next); break;
            case '_': result = (result && next) || (!result && !next); break;
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


/*
        ************************
        * FIRST ORDER LANGUAGE *
        ************************
*/

function forEach(variable, sentence){
    console.log(variable);
    sentence = replaceAll(sentence, variable, "'"+variable+"'");
    //console.log(sentence);
    for(let rig = 0; rig < 8; rig++){
        for(let col = 0; col < 8; col++){
            if(matrix[rig][col] != undefined){
                matrix[rig][col].tag.push(variable);
                var res = evaluate(sentence);
                matrix[rig][col].tag.splice(matrix[rig][col].tag.indexOf(variable), 1);
                if(!res)
                    return false;
            }
        }
    }
    return true;
}

function exist(variable, sentence){
    sentence = replaceAll(sentence, variable,"'"+variable+"'");
    //console.log(sentence);
    for(let rig = 0; rig < 8; rig++){
        for(let col = 0; col < 8; col++){
            if(matrix[rig][col] != undefined){
                matrix[rig][col].tag.push(variable);
                var res = evaluate(sentence);
                matrix[rig][col].tag.splice(matrix[rig][col].tag.indexOf(variable), 1);
                if(res)
                    return true;
            }
        }
    }
    return false;
}

function replaceAll(str, toReplace, replaceWith){
    return str.split(toReplace).join(replaceWith);
}
