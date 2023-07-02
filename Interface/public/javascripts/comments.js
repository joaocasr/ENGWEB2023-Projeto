$(function() {
    console.log("TEST")
    //var commentCount = 0;
    var url = window.location.href;
    var id = url.substring(url.lastIndexOf("/") + 1);
    console.log("ID: " + id);
    $.get("http://localhost:7777/api/ruas/comentarios/" + id, function(data) { // GET dos comentarios da rua com o id=id
        console.log("COMENTÁRIOS DO GET:")
        console.log(data)
        data.forEach(p => {
            console.log(">>")
            console.log(p)
            var content = `
            <li style="min-height: 50px;display: flex;display: flex;flex-direction: column;">
                <div style="display: flex;align-items: center;margin-top: 6px;margin-bottom: 6px;"><img class="w3-left" style="width: 30px; height:30px; border-radius: 50%; margin-right:14px;" src="/images/imagensdeperfil/` + p.photo + `">` +
                `<b>` + p.username + " at " + p.dateTime.substring(0, 10) + ":</b></div>" + `<p style="margin-left: 16px;margin-top: 6px;">` + p.p + "</p>" +
            `</li>`;

            $("#commentList").append(content);
            //commentCount += 1;
        });
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("GET request failed:", textStatus, errorThrown);
    });

    $("#addComment").click(function() {
        var d = new Date();
        var dateTime = d.toISOString().substring(0, 16);
        var envvar = $("#envvarbutton").val()

        var user = $("#buttonvalue").val().split(";",2)[0]
        var myphoto = $("#buttonvalue").val().split(";",2)[1]

        var content = `
            <li style="min-height: 50px;display: flex;display: flex;flex-direction: column;">
                <div style="display: flex;align-items: center;margin-top: 6px;margin-bottom: 6px;"><img class="w3-left" style="width: 30px; height:30px; border-radius: 50%; margin-right:14px;" src="/images/imagensdeperfil/` + myphoto + `">` +
                `<b>` + user + " at " + dateTime.substring(0, 10) + ":</b></div> " + `<p style="margin-left: 16px;margin-top: 6px;">` + $("#commentText").val() + "</p>" + 
            `</li>`;
        //commentCount += 1;
        $("#commentList").append(content);

        newComment = { dateTime: dateTime, username:user,photo : myphoto, rua:id, p: $("#commentText").val() };

        // post newComment
        $.post("http://localhost:7777/api/ruas/comentarios", newComment, function(data) {
            alert("Comentário adicionado com sucesso.");
        })
        $("#commentText").val("");
    });
});
