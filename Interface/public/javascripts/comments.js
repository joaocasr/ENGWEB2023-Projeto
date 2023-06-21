var env = require("../config/env");

$(function() {
    var commentCount = 0;
    var url = window.location.href;
    var id = url.substring(url.lastIndexOf("/") + 1);
    console.log("ENTROUUUU SIUUU")
    $.get(env.apiAccessPoint + "/ruas/comentarios/" + id, function(data) { // GET dos comentarios da rua com o id=id
        alert("Getting comments!");
        data.forEach(p => {
            $("#commentList").append("<li><b>" + p.dateTime + "</b>: " + p.p + "</li>");
            commentCount += 1;
        });
    })
    .fail(function() {
        alert("Error getting comments");
    });

    $("#addComment").click(function() {
        var d = new Date();
        var timeStamp = d.toISOString().substring(0, 16);
        var contents = "<li><b>" + timeStamp + "</b>: " + $("#commentText").val() + "</li>";
        commentCount += 1;
        $("#commentList").append(contents);

        var user = $(this).data('username');
        var photo = $(this).data('photo');
        
        comautor = {username:user,img:photo}
        newComment = { _id: commentCount, dateTime: timeStamp, autor:comautor, p: $("#commentText").val() };

        // post newComment
        $.post(env.apiAccessPoint + "/ruas/comentarios/" + id, newComment, function(data) {
            alert("Comentário adicionado com sucesso.");
        })
        .fail(function() {
            alert("Error adding comment");
        });

        $("#commentText").val("");
    });
});
