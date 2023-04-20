function addRowCasa() {
    var table = document.getElementById("casasTabela");
    var row = table.insertRow(-1);
    var descricaoCell = row.insertCell(0);
    var enfiteutaCell = row.insertCell(1);
    var foroCell = row.insertCell(2);
    var dataCell = row.insertCell(3);
    descricaoCell.innerHTML = '<input type="text" name="descricao" />';
    enfiteutaCell.innerHTML = '<input type="text" name="enfiteuta" />';
    foroCell.innerHTML = '<input type="text" name="foro" />';
    dataCell.innerHTML = '<input type="number" name="data" value="2023"/>';
    }

function addRowLugar() {
    var table = document.getElementById("lugaresTabela");
    var row = table.insertRow(-1);
    var textoCell = row.insertCell(0);
    var lugarCell = row.insertCell(1);
    var tipoCell = row.insertCell(2);
    var dataCell = row.insertCell(3);
    textoCell.innerHTML = '<input type="text" name="texto" />';
    lugarCell.innerHTML = '<input type="text" name="lugar" />';
    tipoCell.innerHTML = `<select name="tipo" id="tipo" style="width: 203px;">
    <option value="">Nenhuma opção</option>
    <option value="pessoa">pessoa</option>
    <option value="inst">instituição</option>
    <option value="inst">família</option>
    </select>`;
    dataCell.innerHTML = '<input type="number" name="data" value="2023"/>';
}