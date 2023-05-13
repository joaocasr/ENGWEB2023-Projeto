function addRowCasa() {
    var table = document.getElementById("casasTabela");
    var row = table.insertRow(-1);
    var descricaoCell = row.insertCell(0);
    var enfiteutaCell = row.insertCell(1);
    var foroCell = row.insertCell(2);
    var dataCell = row.insertCell(3);
    var numeroCell = row.insertCell(4);
    descricaoCell.innerHTML = '<input type="text" name="descricao" />';
    enfiteutaCell.innerHTML = '<input type="text" name="enfiteuta" />';
    foroCell.innerHTML = '<input type="text" name="foro" />';
    dataCell.innerHTML = '<input type="number" name="data_casa"/>';
    numeroCell.innerHTML = '<input type="number" name="numero"/>';
    }

function addRowLugar() {
    var table = document.getElementById("lugaresTabela");
    var row = table.insertRow(-1);;
    var lugarCell = row.insertCell(0);
    var tipoCell = row.insertCell(1);
    var entidadeCell = row.insertCell(2);
    var dataCell = row.insertCell(3);
    lugarCell.innerHTML = '<input type="text" name="lugar" />';
    tipoCell.innerHTML = `<select name="tipo" id="tipo" style="width: 203px;">
    <option value="">Nenhuma opção</option>
    <option value="pessoa">pessoa</option>
    <option value="inst">instituição</option>
    <option value="inst">família</option>
    </select>`;
    entidadeCell.innerHTML = '<input type="text" name="entidade" />';
    dataCell.innerHTML = '<input type="number" name="data"/>';
}

exports.format = function (rua){
    rua['listacasas']=[]
    if(typeof(rua['numero'])=='string' && rua['numero']!= ""){
        rua['listacasas'][0]={
            'número':rua['numero'],
            'enfiteuta':rua['enfiteuta'],
            'foro':rua['foro'],
            'data':rua['data_casa'],
            'desc':{
                'para':{
                    'text':rua['descricao']}}
            }
    }else if (typeof(rua['numero'])=='object'){
        for (let i = 0; i < rua['numero'].length; i++){
            rua['listacasas'][i]={
                'número':rua['numero'][i],
                'enfiteuta':rua['enfiteuta'][i],
                'foro':rua['foro'][i],
                'data':rua['data_casa'][i],
                'desc':{
                    'para':{
                        'text':rua['descricao'][i]}}
                }
        }
    }

    if (rua['lugar']== ""){
        delete(rua['lugar'])
    }else if(typeof(rua['lugar'])=='string'){
        rua['lugar']=[rua['lugar']]
    }

    if (rua['data']== ""){
        delete(rua['data'])
    }else if (typeof(rua['data'])=='string'){
        rua['data']=[rua['data']]
    }

    entidades=[]
    if(typeof(rua['entidade'])=='string' && rua['entidade']!= ""){
        entidades={
            'tipo':rua['tipo'],
            'text':rua['entidade']
            }
    }else if (typeof(rua['entidade'])=='object'){
        for (let i = 0; i < rua['entidade'].length; i++){
            entidades[i]={
                'tipo':rua['tipo'][i],
                'text':rua['entidade'][i]
                }
        }
    }

    if(typeof(rua['para'])=='string'){
        rua['para']=[{
            lugar: rua['lugar'],
            data: rua['data'],
            entidade: entidades,
            text: rua['para'],
        }]
    }
    return rua
}