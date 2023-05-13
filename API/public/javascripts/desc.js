function showDesc(house){
    //if(desc.para.text)
    //    var description = $('<p>'+ text + '</p>')
    //else
    if(house){
        var description = $('<p> '+ house.text +' </p>')
    }else{
        var description = $('<p> '+ 'De momento não existe descrição para a(s) casa(s) selecionada(s)' +' </p>')
    }

    $("#modaldesc").empty()
    $("#modaldesc").append(description)
    $("#modaldesc").modal()

}