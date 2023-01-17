// CANVAS CONTEXT
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

// KEYBOARD INPUT
document.addEventListener('keydown', aim, true);

// GLOBAL VARIABLES
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var pause = false;
let home_radius = 30;

let secondsPassed = 0;
let oldTimeStamp = 0;



// ANT VARIABLE
function Ant(x, y, rotation, infected){
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;

    this.angular_rotation = rotation;
    this.rotation = rotation;
    this.angular_speed = 2;

    this.speed = 1.5;
    this.movement_count = 0;
    this.dir = 0;

    this.trail_points = [];
    this.trail_count = 0;

    this.movement = function() {
        // decide random direction to move
        if (this.movement_count == 0 && Math.floor((Math.random() * 3) + 1) == 1){
            this.movement_count = Math.floor((Math.random() * 10) + 1);
            this.dir = 0;
        }

        else if (this.movement_count == 0 && Math.floor((Math.random() * 3) + 1) == 2){
            this.movement_count = Math.floor((Math.random() * 10) + 1);
            this.dir = 1;
        }

        else if (this.movement_count == 0 && Math.floor((Math.random() * 3) + 1) == 3){
            this.movement_count = Math.floor((Math.random() * 50) + 15);
            this.dir = 2;
        }

        // perform random direction rotation
        if (this.movement_count > 0 && this.dir == 1){
            this.rotation += this.angular_speed;
            this.movement_count -= 1;
        }

        else if (this.movement_count > 0 && this.dir == 0){
            this.rotation -= this.angular_speed;
            this.movement_count -= 1;
        }

        else if (this.movement_count > 0 && this.dir == 2){
            this.rotation += 0;
            this.movement_count -= 1;
        }

        // calculate movement with rotation
        this.dx = Math.cos((this.rotation - 90) * (Math.PI / 180)) * this.speed;
        this.dy = Math.sin((this.rotation - 90) * (Math.PI / 180)) * this.speed;

        // perform movement
        this.x += this.dx;
        this.y += this.dy;
    }

    this.draw = function(){
        // load ant image
        this.img = new Image();
        this.img.src = 'images/ant.png';

        // draw ant
        c.save(); // save current state
        c.translate(this.x - 7.5, this.y - 7.5);
        c.rotate(this.rotation * Math.PI / 180); // rotate
        c.translate(-this.x - 7.5,-this.y - 7.5);
        c.drawImage(this.img, this.x - 7.5, this.y - 7.5, 30, 30); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)
    }

    this.boundaries = function() {
        if (this.y > window.innerHeight){
            if (this.rotation <= 180)
                this.rotation -= 2;
            else
                this.rotation += 2;
        }
        else if (this.y < 0){
            if (this.rotation <= 180)
                this.rotation += 2;
            else
                this.rotation -= 2;
        }

        if (this.x > window.innerWidth){
            if (this.rotation <= 90)
                this.rotation -= 2;
            else
                this.rotation += 2;
        }

        else if (this.x < 0){
            if (this.rotation <= 270)
                this.rotation -= 2;
            else
                this.rotation += 2;
        }
    }

    this.trail = function() {
        var max_trail_count = 50;
        var trail_point_lifetime = 1000;

        if (this.trail_count == 0){
            this.trail_points.push([this.x, this.y, trail_point_lifetime])
            this.trail_count = max_trail_count;
        }

        else
            this.trail_count--;

        for (var i = 0; i < this.trail_points.length; i++){
            if (this.trail_points[i][2] > 0){
                c.beginPath();
                c.arc(this.trail_points[i][0] - 10, this.trail_points[i][1] - 10, this.trail_points[i][2]/200, 0, 2 * Math.PI);
                c.fillStyle = "darkblue";
                c.fill();
                this.trail_points[i][2] -= 1;
            }
            else
                this.trail_points.splice(1, i);
        }
    }

    this.update = function() {
        this.movement();
        this.boundaries();
        this.trail();
        this.draw();
    }
}

// SPAWN ANTS
var ants = [];
for (var i = 0; i < 50; i++){
    if ((i * 2) < 90)
        ants.push(new Ant(canvas.width / 2 + (Math.cos((90 - (i * 2)) * (Math.PI / 180)) * home_radius), canvas.height / 2 - (Math.sin((90 - (i * 2)) * (Math.PI / 180)) * home_radius), i * 2));
    else if ((i * 2) < 180 && (i * 2) > 90)
        ants.push(new Ant(canvas.width / 2 + (Math.cos((90 - (i * 2)) * (Math.PI / 180)) * home_radius), canvas.height / 2 - (Math.sin((90 - (i * 2)) * (Math.PI / 180)) * home_radius), i * 2));
    else if ((i * 2) < 270 && (i * 2) > 180)
        ants.push(new Ant(canvas.width / 2 - (Math.cos((270 - (i * 2)) * (Math.PI / 180)) * home_radius), canvas.height / 2 + (Math.sin((270 - (i * 2)) * (Math.PI / 180)) * home_radius), i * 2));
    else if ((i * 2) > 270)
        ants.push(new Ant(canvas.width / 2 - (Math.cos(((i * 2) - 270) * (Math.PI / 180)) * home_radius), canvas.height / 2 - (Math.sin(((i * 2) - 270) * (Math.PI / 180)) * home_radius), i * 2));
}

// CONTROLS
function aim(e){
    if(e.keyCode == 32){
        if (pause == false){
            pause = true;
        }
        else if (pause == true){
            pause = false;
        }
    }
}

// UPDATE
function animate(timeStamp){
    if (pause == false){
        // TIME FPS MANAGEMENT
        secondsPassed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;

        // CLEAR SCREEN FOR NEXT FRAME
        c.clearRect(0, 0, canvas.width, canvas.height);

        // DRAW ANTS
        for (var i = 0; i < ants.length; i++){
            ants[i].update();
        }

        // DRAW HOME
        c.beginPath();
        c.arc(canvas.width/2 - (home_radius / 4), canvas.height/2 - (home_radius / 4), home_radius, 0, 2 * Math.PI);
        c.fillStyle = "darkgrey";
        c.fill();
        c.stroke();

        // DRAW HELP
        c.beginPath();
        c.font = "20px Monospace";
        c.fillStyle = "darkgrey"
        c.fillText('SPACE   Pause/Resume', 10, 20);
        c.fillText('  +     Increment Speed', 10, 40);
        c.fillText('  -     Decrement Speed', 10, 60);

        // RESTORE CANVAS STATE 
        c.restore();
    }

    requestAnimationFrame(animate);
}

animate();