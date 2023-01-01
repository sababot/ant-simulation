var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

// INIT
c.imageSmoothingEnabled = false;
document.addEventListener('keydown', aim, true);
document.addEventListener('keyup', aim2, true);

// GLOBAL VARIABLES
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var left = false;
var right = false;
var up = false;
var down = false;
let jump = 0;
let rotation = 0;

let secondsPassed = 0;
let oldTimeStamp = 0;

// PLAYER ANT VARIABLE
function PlayerAnt(x, y, infected){
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.speed_rate = 0;
    this.rotation = 0;
    this.max_speed = 1.5;
    this.angular_speed = 2;

    this.draw = function(){
        var img = new Image();
        img.src = 'ant-template.png';

        c.save(); // save current state
        c.translate(this.x - 7.5, this.y - 7.5);
        c.rotate(this.rotation * Math.PI / 180); // rotate
        c.translate(-this.x - 7.5,-this.y - 7.5);
        c.drawImage(img, this.x - 7.5, this.y - 7.5, 30, 30); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

        ///////////////////////////

        if (right == true && up == true){
            this.rotation += this.angular_speed;
        }

        else if (left == true && up == true){
            this.rotation -= this.angular_speed;
        }

        ////////////////
        if (up == false){
            if (this.speed_rate > 0){
                this.speed_rate -= 0.5;
            }
        }
        ////////////////
        else if (up == true){
            if (this.speed_rate < this.max_speed){
                this.speed_rate += 0.5;
            }
        }

        playerVariable.dx = Math.cos((this.rotation - 90) * (Math.PI / 180)) * this.speed_rate;
        playerVariable.dy = Math.sin((this.rotation - 90) * (Math.PI / 180)) * this.speed_rate;

        if (this.y > window.innerHeight){
            this.y = window.innerHeight;
        }
        else if (this.y < 40){
            this.y = 40;
        }

        if (this.x > window.innerWidth){
            this.x = window.innerWidth;
        }
        else if (this.x < 40){
            this.x = 40;
        }

        // Movement
        this.x += this.dx;
        this.y += this.dy;
    }
}

// ANT VARIABLE
function Ant(x, y, rotation, infected){
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.angular_rotation = rotation;
    this.speed = 1.5;
    this.rotation = Math.floor((Math.random() * 360) + 1);
    this.count = 0;
    this.dir = 0;
    this.angular_speed = 2;

    this.draw = function(){
        this.img = new Image();
        this.img.src = 'ant-template.png';

        c.save(); // save current state
        c.translate(this.x - 7.5, this.y - 7.5);
        c.rotate(this.rotation * Math.PI / 180); // rotate
        c.translate(-this.x - 7.5,-this.y - 7.5);
        c.drawImage(this.img, this.x - 7.5, this.y - 7.5, 30, 30); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

        ///////////////////////////

        if (this.count == 0 && Math.floor((Math.random() * 3) + 1) == 1){
            this.count = Math.floor((Math.random() * 10) + 1);
            this.dir = 0;
        }

        else if (this.count == 0 && Math.floor((Math.random() * 3) + 1) == 2){
            this.count = Math.floor((Math.random() * 10) + 1);
            this.dir = 1;
        }

        else if (this.count == 0 && Math.floor((Math.random() * 3) + 1) == 3){
            this.count = Math.floor((Math.random() * 50) + 15);
            this.dir = 2;
        }

        if (this.count > 0 && this.dir == 1){
            this.rotation += this.angular_speed;
            this.count -= 1;
        }

        else if (this.count > 0 && this.dir == 0){
            this.rotation -= this.angular_speed;
            this.count -= 1;
        }

        else if (this.count > 0 && this.dir == 2){
            this.rotation += 0;
            this.count -= 1;
        }

        ////////////////

        this.dx = Math.cos((this.rotation - 90) * (Math.PI / 180)) * this.speed;
        this.dy = Math.sin((this.rotation - 90) * (Math.PI / 180)) * this.speed;

        if (this.y > window.innerHeight){
            this.y = window.innerHeight;
        }
        else if (this.y < 40){
            this.y = 40;
        }

        if (this.x > window.innerWidth){
            this.x = window.innerWidth;
        }
        else if (this.x < 40){
            this.x = 40;
        }

        // Movement
        this.x += this.dx;
        this.y += this.dy;
    }
}

// SPAWN PLAYER ANT
var playerVariable = new PlayerAnt(canvas.width / 2, canvas.height / 2);

// SPAWN ANTS
var ants = [];
for (var i = 0; i < 120; i++){
    ants.push(new Ant(canvas.width / 2, canvas.height / 2, i * 3));
}

// PLAYER CONTROLS
function aim(e){
    if(e.keyCode == 37 || e.keyCode == 65){
        left = true;
    }

    if(e.keyCode == 39 || e.keyCode == 68){
        right = true;
    }

    if(e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 32){
        up = true;
    }

    if(e.keyCode == 40 || e.keyCode == 83){
        down = true;
    }
}

function aim2(e){
    if((e.keyCode == 37 && left == true) || (e.keyCode == 65 && left == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        left = false;
    }

    if((e.keyCode == 39 && right == true) || (e.keyCode == 68 && right == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        right = false;
    }

    if((e.keyCode == 38 && up == true) || (e.keyCode == 87 && up == true) || (e.keyCode == 32 && up == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        up = false;
    }

    if((e.keyCode == 40 && down == true) || (e.keyCode == 83 && down == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        down = false
    }
}

// UPDATE
function animate(timeStamp){
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < ants.length; i++){
        ants[i].draw();
    }

    // GameObjects
    playerVariable.draw();

    c.restore();
}

animate();