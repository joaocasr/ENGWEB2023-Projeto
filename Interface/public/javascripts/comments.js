$(function() {    
    var commentCount = 0;
    var url = window.location.href;
    var id = url.substring(url.lastIndexOf("/") + 1);
    $.get("http://localhost:7777/api/ruas/comentarios/" + id, function(data) { // GET dos comentarios da rua com o id=id
        console.log(data)
        data.forEach(p => {
            console.log(">>")
            console.log(p)
            $("#commentList").append("<li><b>" + p.dateTime + "</b>: " + p.p + "</li>");
            commentCount += 1;
        });
    })

    $("#addComment").click(function() {
        var d = new Date();
        var timeStamp = d.toISOString().substring(0, 16);
        var contents = "<li><b>" + timeStamp + "</b>: " + $("#commentText").val() + "</li>";
        commentCount += 1;
        $("#commentList").append(contents);

        var user = $("#buttonvalue").val().split(";",2)[0]
        var myphoto = $("#buttonvalue").val().split(";",2)[1]
        
        newComment = { _id: commentCount, dateTime: timeStamp, username:user,photo : myphoto, rua:id, p: $("#commentText").val() };

        // post newComment
        $.post("http://localhost:7777/api/ruas/comentarios/" + id, newComment, function(data) {
            alert("Comentário adicionado com sucesso.");
        })
        $("#commentText").val("");
    });
});
