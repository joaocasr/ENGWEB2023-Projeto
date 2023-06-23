function showConfirm(rua){
    if (confirm("Tem a certeza que pretende eliminar a rua: "+ rua.nome+" ?")) {
        window.location.href = "/delete/"+rua.id
    }
    return false;
}
