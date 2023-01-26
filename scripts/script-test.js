// CANVAS CONTEXT
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

// KEYBOARD/MOUSE INPUT
document.addEventListener('keydown', aim, true);
document.addEventListener('mousemove', e=> {
    mouse_pos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    }
});

canvas.onmousedown = function(e){
    foods.push(new Food(mouse_pos.x, mouse_pos.y, 25));
}

// GLOBAL VARIABLES
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var pause = false;
let home_radius = 30;

let secondsPassed = 0;
let oldTimeStamp = 0;

var ants = [];
var foods = [];
var to_food_trails = [];
var to_home_trails = [];

var total_food = 0;


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

    this.trail_count = 0;

    this.has_food = false;
    this.path = [];
    this.path_index = 0;
    this.path_x;
    this.path_y;
    this.following_trail = false;
    this.trail_to_follow;

    this.movement = function() {
        if (this.has_food == false && this.following_trail == false){ // if searching for food
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

            // follow to food trails if close
            for (let i = 0; i < to_food_trails.length; i++)
            {
                for (let j = 0; j < to_food_trails[i].length; j++){
                    if (Math.sqrt(Math.pow(to_food_trails[i][j][0] - this.x, 2) + Math.pow(to_food_trails[i][j][1] - this.y, 2)) < 10){
                        this.following_trail = true;
                        this.trail_to_follow = [i, j];
                    }
                }
            }
        }

        else if (this.following_trail == true && this.has_food == false){
            //console.log(this.trail_to_follow);
            if (this.following_trail == true){
                this.rotation = + 90 + Math.atan2(to_food_trails[this.trail_to_follow[0]][this.trail_to_follow[1]][1] - this.y, to_food_trails[this.trail_to_follow[0]][this.trail_to_follow[1]][0] - this.x) * (180 / Math.PI);

                if (Math.sqrt(Math.pow(to_food_trails[this.trail_to_follow[0]][this.trail_to_follow[1]][0] - this.x, 2) + Math.pow(to_food_trails[this.trail_to_follow[0]][this.trail_to_follow[1]][1] - this.y, 2)) < 2){
                    if (this.trail_to_follow[1] != to_food_trails[this.trail_to_follow[0]].length - 1)
                        this.trail_to_follow[1] += 1;
                    else{
                        this.has_food = true;
                        this.following_trail = false;
                        this.path = to_food_trails[this.trail_to_follow[0]]
                    }
                }
            }
        }

        else if (this.has_food == true && this.following_trail == false){
            // store current trail point coordinate
            this.path_x = this.path[this.path_index][0];
            this.path_y = this.path[this.path_index][1];

            // rotate towards current trail point
            this.rotation = + 90 + Math.atan2(Math.floor(this.path_y) - this.y, Math.floor(this.path_x) - this.x) * (180 / Math.PI);

            // move to next trail point
            if (Math.sqrt(Math.pow(this.path_x - this.x, 2) + Math.pow(this.path_y - this.y, 2)) < 2 && this.path_index != 0)
                this.path_index -= 1;
            else if (Math.sqrt(Math.pow(this.path_x - this.x, 2) + Math.pow(this.path_y - this.y, 2)) < 2 && this.path_index == 0){
                to_food_trails.push(this.path);
                this.path = [];
                this.has_food = false;
                total_food += 5;
            }
        }

        // calculate movement with rotation
        this.dx = Math.cos((this.rotation - 90) * (Math.PI / 180)) * this.speed;
        this.dy = Math.sin((this.rotation - 90) * (Math.PI / 180)) * this.speed;

        // perform movement
        this.x += this.dx;
        this.y += this.dy;

        console.log(this.following_trail);
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
                this.rotation -= 5;
            else
                this.rotation += 5;
        }
        else if (this.y < 0){
            if (this.rotation <= 180)
                this.rotation += 5;
            else
                this.rotation -= 5;
        }

        if (this.x > window.innerWidth){
            if (this.rotation <= 90)
                this.rotation -= 5;
            else
                this.rotation += 5;
        }

        else if (this.x < 0){
            if (this.rotation <= 270)
                this.rotation -= 5;
            else
                this.rotation += 5;
        }
    }

    this.trail = function() {
        var max_trail_count = 10;
        var trail_point_lifetime = 3000;

        if (this.trail_count == 0){
            if (!this.has_food){
                // to_food_trails.push([this.x, this.y, trail_point_lifetime]);
                this.path.push([this.x, this.y]);
            }

            else
                to_home_trails.push([this.x, this.y, trail_point_lifetime]);

            this.trail_count = max_trail_count;
        }

        else
            this.trail_count--;
    }

    this.get_food = function() {
        if (this.has_food == false){
            for (var i = 0; i < foods.length; i++){
                if (Math.sqrt(Math.pow(foods[i].x - this.x, 2) + Math.pow(foods[i].y - this.y, 2)) < foods[i].amount){
                    foods[i].amount -= 5;
                    this.has_food = true;
                    this.path_index = this.path.length - 2;
                }
            }
        }
    }

    this.update = function() {
        this.movement();
        this.boundaries();
        this.trail();
        this.draw();
        this.get_food();
    }
}

function Food(x, y, amount) {
    this.x = x;
    this.y = y;
    this.amount = amount;

    this.draw = function(){
        c.beginPath();
        c.arc(this.x - (this.amount / 4), this.y - (this.amount / 4), this.amount, 0, 2 * Math.PI);
        c.fillStyle = "#e67b10";
        c.fill();
    }
}

// SPAWN ANTS
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

        // DRAW TRAILS
        for (var i = 0; i < to_food_trails.length; i++){
            if (to_food_trails[i][2] > 0){
                c.beginPath();
                c.arc(to_food_trails[i][0] - 10, to_food_trails[i][1] - 10, to_food_trails[i][2]/500, 0, 2 * Math.PI);
                c.fillStyle = "#6588c9";
                c.fill();
                to_food_trails[i][2] -= 1;
            }
            else
                to_food_trails.splice(1, i);
        }

        for (var i = 0; i < to_home_trails.length; i++){
            if (to_home_trails[i][2] > 0){
                c.beginPath();
                c.arc(to_home_trails[i][0] - 10, to_home_trails[i][1] - 10, to_home_trails[i][2]/500, 0, 2 * Math.PI);
                c.fillStyle = "red";
                c.fill();
                to_home_trails[i][2] -= 1;
            }
            else
                to_home_trails.splice(1, i);
        }

        // DRAW ANTS
        for (var i = 0; i < ants.length; i++){
            ants[i].update();
        }

        // DRAW FOOD
        for (var i = 0; i < foods.length; i++){
            foods[i].draw();
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

        // DRAW STATS
        c.beginPath();
        c.font = "20px Monospace";
        c.fillStyle = "black";
        c.textAlign = "center";
        c.fillText(String(total_food), (canvas.width / 2) - 8, (canvas.height / 2) - 2);

        // RESTORE CANVAS STATE 
        c.restore();
    }

    requestAnimationFrame(animate);
}

animate();