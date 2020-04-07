var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        events: { 'onStateChange': onPlayerStateChange }
    });
}
function onPlayerStateChange(event) {
    switch (event.data) {
        case 0:
            // record('video ended');
            break;
        case 1:
            // record('video playing from ' + player.getCurrentTime());
            break;
        case 2:
            // record('video paused at ' + player.getCurrentTime());
    }
}


function record(str) {
    console.log(str)
}

var debater_list = [
    { id: 1, name: "Amy Klobuchar", pic: "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/klobucha.png" },
    { id: 2, name: "Cory Booker", pic: "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/booker.png" },
    { id: 3, name: "Pete Buttigieg", pic: "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/buttigieg.png" },
    { id: 4, name: "Bernie Sanders", pic: "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/sanders.png" },
    { id: 5, name: "Joseph R. Biden Jr.", pic: "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/biden.png" },
    { id: 6, name: "Elizabeth Warren", pic: "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/warren.png" },
    { id: 7, name: "Kamala Harris", pic: "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/harris.png" },
    { id: 8, name: "Andrew Yang", pic: "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/yang.png" },
    { id: 9, name: "Beto O'Rourke", pic: "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/orourke.png" },
    { id: 10, name: "Julián Castro", pic: "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/castro.png" },
];

$(document).ready(function () {
    $("#image_name").hide();
    populate_debater_dropdowns(0);
    populate_debater_profiles();
});

function showImgName(el){
    $("#image_name").show();
    var pos = $(el).offset();
    var name = $(el).attr("alt");
    $("#image_name").html(name);
    $("#image_name").css('top',pos.top);
    $("#image_name").css('left',pos.left - "10em");

};

function hideImgName(el){
    $("#image_name").hide();
}

function populate_debater_profiles() {
    $("#profiles").html('<label>CANDIDATES</label><br/>');
    $.each(debater_list, function (index, val) {
        var html = '<img src="' + val.pic + '" alt="'+val.name+'" onmouseover="showImgName(this)" onmouseout="hideImgName(this)"></img><br/>';
        $("#profiles").append(html);
    });
}

function populate_debater_dropdowns(el) {
    var list = $($(el).nextAll()[0]);
    $.each(debater_list, function (index, item) {
        content = "<p class='list_item' id='" + index + "' onclick='item_selected(this)'>" + item.name + "</p>";
        list.append(
            $('<li></li>').html(content)
        );
    });
}

function item_selected(el) {
    var html = $(el).text() + '&nbsp<span class="caret"></span>';
    $($(el).parent().parent().prevAll()[0]).html(html);
}

function add_item_A(el) {
    var html = '<button style="width: 12em;" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" onclick="populate_debater_dropdowns(this)">Select Debater A &nbsp<span class="caret"></span></button>'
        + '<ul class="dropdown-menu">'
        + '</ul><br/>';
    $(el).before(html);
}

function add_item_B(el) {
    var html = '<button style="width: 12em;" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" onclick="populate_debater_dropdowns(this)">Select Debater B &nbsp<span class="caret"></span></button>'
        + '<ul class="dropdown-menu">'
        + '</ul><br/>';
    $(el).before(html);
}

function perform_tag() {
    player.pauseVideo();
    var time = player.getCurrentTime().toFixed(2);
    $("#attack_time").html("Time : " + secondsToMs(time));
}



function secondsToMs(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    var min = m + ":";
    return min + s;
}

