var env = require("../config/env");

$(function() {
    var commentCount = 0;
    var url = window.location.href;
    var id = url.substring(url.lastIndexOf("/") + 1); // Extract the ID from the URL

    $.get(env.apiAccessPoint + "/comment/" + id, function(data) {
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
        var newComment = { id: "p" + commentCount, dateTime: timeStamp, p: $("#commentText").val() };

        // post newComment
        $.post(env.apiAccessPoint + "/comment/" + id, newComment, function(data) {
            alert("New comment added: " + data.p);
        })
        .fail(function() {
            alert("Error adding comment");
        });

        $("#commentText").val("");
    });
});
