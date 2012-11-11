var faceDetection = {

    init : function(video,canvas){

        this.w =  video.clientWidth,
        this.h = video.clientHeight,

        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        var htracker = new headtrackr.Tracker({
            ui : false,
            headPosition : false
//            smoothing : false
        });

        htracker.init(video, canvas);
        htracker.start();

        var self = this;

        document.addEventListener('facetrackingEvent', function(event){
            self.drawBox(event);
        })

        document.addEventListener('headtrackrStatus',
            function (event) {
                switch (event.status){
                    case 'detecting':
                        $('#status').html('Finding Camera...');
                        break;
                    case 'found':
                        $('#status').html('Camera Found');
                        break;
                }
            }
        );

    },

    drawVideo : function() {
        this.context.drawImage(this.video1,0,0,w/4,h/4);
    },

    drawBox : function(event){

        this.drawCrosshairs();
        var coords = this.getBoxCoords();

        var x = coords[0];
        var y = coords[1];
        var w = coords[2];
        var h = coords[3];

        this.context.strokeRect(x,y,w,h);

    },

    getBoxCoords : function (){

        var x, y, w, h;
        var context = this.context;

        context.lineWidth = 3;
        context.strokeStyle = "#f00";

        w = event.width;
        h = event.height;
        x = event.x - w/2;
        y = event.y - h/2;
        context.strokeRect(x, y, w, h);

        this.alertPositioning(x,y,w,h);

        return [x,y,w,h];

    },

    alertPositioning : function (x,y,w,h){

        if (!!(x || y || w || h)){

            var canvas = this.canvas;

            var cx = x + w/2
            var cy = y + h/2;

            var targetx = canvas.width/2;
            var targety = canvas.height/2.2;

            var threshhold = canvas.width/6;

            var dist = Math.sqrt((cx - targetx)*(cx - targetx) + (cy - targety)*(cy - targety));

            var move
            if (cx > targetx)
                moveLR = $('<i class="icon-arrow-left"></i>');
            else
                moveLR = $('<i class="icon-arrow-right"></i>');

            if (cy < targety)
                moveUD = $('<i class="icon-arrow-up"></i>');
            else
                moveUD = $('<i class="icon-arrow-down"></i>');


            var matching;

            if (dist > threshhold){
                matching = 'poor ';
            }
            else if (dist > threshhold/3){
                matching = 'good ';
            }
            else {
                matching = 'excellent';
            }

            $('#matching').html(matching);

            if (matching != 'excellent')
                $('#matching').append(moveLR,moveUD);
        }

    },

    drawCrosshairs : function (){

        var context = this.context;
        var canvas = this.canvas;

        context.lineWidth = 3;
        context.strokeStyle = "lightgreen";

        //vertical line
        context.beginPath();
        context.moveTo(canvas.width/2, 0);
        context.lineTo(canvas.width/2,canvas.height);
        context.stroke();

        context.lineWidth = 2;
        context.strokeStyle = "lightgreen";

        //horizontal line
        context.beginPath();
        context.moveTo(0,canvas.height/2.2);
        context.lineTo(canvas.width,canvas.height/2.2);
        context.stroke();

    }

}

var videoInput = document.getElementById('myCamera');
var canvasInput = document.getElementById('faceDetect_canvas');

faceDetection.init(videoInput,canvasInput);
