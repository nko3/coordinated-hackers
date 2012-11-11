w = video1.clientWidth;
h = video1.clientHeight;

$canvas = $('#canvas');
canvas = $canvas.get(0);

canvas.width = w/4;
canvas.height = h/4;
context = canvas.getContext('2d');

var videoInput = document.getElementById('video1');
var canvasInput = document.getElementById('canvas');

var htracker = new headtrackr.Tracker({
    ui : false,
    headPosition : false,
    smoothing : false
});

htracker.init(videoInput, canvasInput);
htracker.start();

document.addEventListener('facetrackingEvent', function(event){
    drawBox(event);
})

document.addEventListener('headtrackrStatus',
    function (event) {
//        console.log(event.status)
        switch (event.status){
            case 'detecting':
                $('#status').html('Finding Camera...');
                break;
            case 'found':
                $('#status').html('Camera Found');
//                setTimeout(function(){$('#status').html('')},500)
                break;
        }
    }
);

function drawVideo() {
    context.drawImage(video1,0,0,w/4,h/4);
};

function drawBox(event){

    drawCrosshairs();
    var coords = getBoxCoords();

    var x = coords[0];
    var y = coords[1];
    var w = coords[2];
    var h = coords[3];

    context.strokeRect(x,y,w,h);

};

function getBoxCoords(){

    var x, y, w, h;

    context.lineWidth = 3;
    context.strokeStyle = "#f00";

    w = event.width;
    h = event.height;
    x = event.x - w/2;
    y = event.y - h/2;
    context.strokeRect(x, y, w, h);

    alertPositioning(x,y,w,h);

    return [x,y,w,h];

};

function alertPositioning(x,y,w,h){

    if (!!(x || y || w || h)){
        var cx = x + w/2
        var cy = y + h/2;

        var targetx = canvas.width/2;
        var targety = canvas.height/2.2;

        var threshhold = canvas.width/6;

        var dist = Math.sqrt((cx - targetx)*(cx - targetx) + (cy - targety)*(cy - targety));

        var matching;

        if (dist > threshhold){
            matching = 'bad';
        }
        else if (dist > threshhold/3){
            matching = 'good';
        }
        else {
            matching = 'excellent';
        }

        $('#matching').html(matching);
    }

};

function drawCrosshairs(){
    context.lineWidth = 2;
    context.strokeStyle = "green";

    //vertical line
    context.beginPath();
    context.moveTo(canvas.width/2, 0);
    context.lineTo(canvas.width/2,canvas.height);
    context.stroke();

    //horizontal line
    context.beginPath();
    context.moveTo(0,canvas.height/2.2);
    context.lineTo(canvas.width,canvas.height/2.2);
    context.stroke();
};