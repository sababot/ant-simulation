var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

document.addEventListener('keydown', aim, true);
document.addEventListener('keyup', aim2, true);

canvas.addEventListener("mousemove", e => {

    mouse_pos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    }
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var left = false;
var right = false;
var up = false;
var down = false;
let jump = 0;
let rotation = 0;
let rotation2 = 0;
let rotation3 = 0;
let rotation4 = 0;

let secondsPassed = 0;
let oldTimeStamp = 0;

function QueenAnt(x, y, infected){
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.r = 15;
    this.m = 2.5;
    this.colliding = true;
    this.infected = infected;
    this.vel = 1;
    this.jump_vel = 10;
    this.health = 100;
    this.move_x_left = true;
    this.move_x_right = true;
    this.move_y_up = true;
    this.move_y_down = true;
    this.speed_rate = 0;
    this.rotation = 0;
    this.diff = 0;
    this.diff2 = 0;

    this.draw = function(){
        /* Graphics
        c.beginPath();
        c.rect(this.x, this.y, 40, 40);
        if (this.health <= 0){
            c.fillStyle = "black";
        }
        else{
            c.fillStyle = "#ff5961";
        }

        c.fill();
        */

        var img = new Image();
        img.src = 'ant-head.png';

        var img2 = new Image();
        img2.src = 'ant-middle.png';

        var img3 = new Image();
        img3.src = 'ant-butt.png';

        /*
        c.save(); // save current state
        c.beginPath();
        c.arc(this.x - 20 + this.targetx, this.y - 20 + this.targety, 4, 0, 2 * Math.PI);
        c.fillStyle = "#68f907";
        c.fill();
        c.stroke();
        c.restore(); // restore original states (no rotation etc)
        */

        c.save(); // save current state
        c.translate(this.x - 15, this.y - 15);
        c.rotate(this.rotation * Math.PI / 180); // rotate
        c.translate(-this.x - 15,-this.y - 15);
        c.drawImage(img, this.x - 15, this.y - 15, 60, 60); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

        c.save(); // save current state
        c.translate(this.x - 15, this.y - 15);
        c.rotate(this.diff * Math.PI / 180); // rotate
        c.translate(-this.x - 15,-this.y - 15);
        c.drawImage(img2, this.x - 15, this.y - 15, 60, 60); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

        c.save(); // save current state
        c.translate(this.x - 15, this.y - 15);
        c.rotate(this.diff2 * Math.PI / 180); // rotate
        c.translate(-this.x - 15,-this.y - 15);
        c.drawImage(img3, this.x - 15, this.y - 15, 60, 60); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

        ///////////////////////////

        if (right == true && up == true){
            this.rotation += 4;
        }

        else if (left == true && up == true){
            this.rotation -= 4;
        }

        //////////// Difference 1

        if (this.diff < this.rotation && (this.rotation - this.diff) < 15){
            this.diff += 2.75;
        }

        else if (this.diff > this.rotation && (this.rotation - this.diff) > -15){
            this.diff -= 2.75;
        }

        else if (this.diff < this.rotation){
            this.diff += 4;
        }

        else if (this.diff > this.rotation){
            this.diff -= 4;
        }

        //////////// Difference 2

        if (this.diff2 < this.rotation && (this.rotation - this.diff2) < 25){
            this.diff2 += 2.75;
        }

        else if (this.diff2 > this.rotation && (this.rotation - this.diff2) > -25){
            this.diff2 -= 2.75;
        }

        else if (this.diff2 < this.rotation){
            this.diff2 += 4;
        }

        else if (this.diff > this.rotation){
            this.diff2 -= 4;
        }

        /*
        if (left == true && up == true && this.x > 0){
            c.save(); // save current state
            c.translate(this.x - 20, this.y - 20);
            c.rotate((rotation - 2.5) * Math.PI / 180); // rotate
            c.translate(-this.x - 20,-this.y - 20);
            c.drawImage(img, this.x, this.y, 40, 40); // draws a chain link or dagger
            c.restore(); // restore original states (no rotation etc)
            rotation -= 2.5;
        }
        
        ////////////////
        else if (right == true && up == true && this.x < window.innerWidth - 41){
            c.save(); // save current state
            c.translate(this.x - 20, this.y - 20);
            c.rotate((rotation + 2.5) * Math.PI / 180); // rotate
            c.translate(-this.x - 20,-this.y - 20);
            c.drawImage(img, this.x, this.y, 40, 40); // draws a chain link or dagger
            c.restore(); // restore original states (no rotation etc)
            rotation += 2.5;
        }
        
        ////////////////
        else {
            c.save(); // save current state
            c.translate(this.x - 20, this.y - 20);
            c.rotate(rotation * Math.PI / 180); // rotate
            c.translate(-this.x - 20,-this.y - 20);
            c.drawImage(img, this.x, this.y, 40, 40); // draws a chain link or dagger
            c.restore(); // restore original states (no rotation etc)
        }
        */

        /*
        if (down == true && right == false && left == false && this.y < window.innerWidth - 41){
            playerVariable.dy = 5;
        }
        else if ((down == true && right == true) || (down == true && left == true) && this.y < window.innerHeight - 41){
            playerVariable.dy = 3.5;
        }
        */
        playerVariable.dy = 0;

        ////////////////
        if (up == false){
            if (this.speed_rate > 0){
                this.speed_rate -= 0.5;
            }
        }
        ////////////////
        else if (up == true){
            if (this.speed_rate < 5){
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

function Ant(x, y, infected){
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.r = 15;
    this.m = 2.5;
    this.colliding = true;
    this.infected = infected;
    this.vel = 1;
    this.jump_vel = 10;
    this.health = 100;
    this.move_x_left = true;
    this.move_x_right = true;
    this.move_y_up = true;
    this.move_y_down = true;
    this.angle;
    this.destination = [0, 0];
    this.angular_rotation = Math.floor((Math.random() * 3.5) + 1);
    this.angular_rotation2 = 3.5;
    this.angular_rotation3 = 4;
    this.targetx = 0;
    this.targety = 0;
    this.targetangle = 0;
    this.speed = Math.floor((Math.random() * 4.5) + 1);
    this.rotation = Math.floor((Math.random() * 300) + 1);
    this.diff = this.rotation;
    this.diff2 = this.rotation;
    this.count_max = Math.floor((Math.random() * 50) + 1);
    this.count = 0;
    this.dir = 0;

    this.draw = function(){
        /* Graphics
        c.beginPath();
        c.rect(this.x, this.y, 40, 40);
        if (this.health <= 0){
            c.fillStyle = "black";
        }
        else{
            c.fillStyle = "#ff5961";
        }

        c.fill();
        */

        this.img = new Image();
        this.img.src = 'ant-head.png';

        this.img2 = new Image();
        this.img2.src = 'ant-middle.png';

        this.img3 = new Image();
        this.img3.src = 'ant-butt.png';

        this.angle = Math.atan2((this.y + this.targety) - (this.y + 20), (this.x + this.targetx) - (this.x + 20));
        this.angle *= (180 / Math.PI);
        this.angle += 90;

        if (this.angle < 0){
            this.angle = 360 - (this.angle * -1);
        }

        this.targetx = Math.cos(this.targetangle * (Math.PI / 180)) * 80;
        this.targety = Math.sin(this.targetangle * (Math.PI / 180)) * 80;

        /*
        c.save(); // save current state
        c.beginPath();
        c.arc(this.x - 20 + this.targetx, this.y - 20 + this.targety, 4, 0, 2 * Math.PI);
        c.fillStyle = "#68f907";
        c.fill();
        c.stroke();
        c.restore(); // restore original states (no rotation etc)
        */

        c.save(); // save current state
        c.translate(this.x - 15, this.y - 15);
        c.rotate(this.rotation * Math.PI / 180); // rotate
        c.translate(-this.x - 15,-this.y - 15);
        c.drawImage(this.img, this.x - 15, this.y - 15, 60, 60); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

        c.save(); // save current state
        c.translate(this.x - 15, this.y - 15);
        c.rotate(this.diff * Math.PI / 180); // rotate
        c.translate(-this.x - 15,-this.y - 15);
        c.drawImage(this.img2, this.x - 15, this.y - 15, 60, 60); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

        c.save(); // save current state
        c.translate(this.x - 15, this.y - 15);
        c.rotate(this.diff2 * Math.PI / 180); // rotate
        c.translate(-this.x - 15,-this.y - 15);
        c.drawImage(this.img3, this.x - 15, this.y - 15, 60, 60); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

        ///////////////////////////

        if (this.count == 0 && Math.floor((Math.random() * 2) + 1) == 1){
            this.count = Math.floor((Math.random() * 50) + 1);
            this.dir = 0;
        }

        else if (this.count == 0 && Math.floor((Math.random() * 2) + 1) == 2){
            this.count = Math.floor((Math.random() * 50) + 1);
            this.dir = 1;
        }

        if (this.count > 0 && this.dir == 1){
            this.rotation += 3;
            this.count -= 1;
        }

        else if (this.count > 0 && this.dir == 0){
            this.rotation -= 3;
            this.count -= 1;
        }

        if (this.diff < this.rotation && (this.rotation - this.diff) < 15){
            this.diff += 2.75;
        }

        else if (this.diff > this.rotation && (this.rotation - this.diff) > -15){
            this.diff -= 2.75;
        }

        else if (this.diff < this.rotation){
            this.diff += 4;
        }

        else if (this.diff > this.rotation){
            this.diff -= 4;
        }

        //////////// Difference 2

        if (this.diff2 < this.rotation && (this.rotation - this.diff2) < 30){
            this.diff2 += 2.75;
        }

        else if (this.diff2 > this.rotation && (this.rotation - this.diff2) > -30){
            this.diff2 -= 2.75;
        }

        else if (this.diff2 < this.rotation){
            this.diff2 += 4;
        }

        else if (this.diff > this.rotation){
            this.diff2 -= 4;
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

var playerVariable = new QueenAnt(canvas.width / 2, canvas.height / 2);
var ants = [];

for (var i = 0; i < 25; i++){
    ants.push(new Ant(Math.floor((Math.random() * canvas.width) + 1), Math.floor((Math.random() * canvas.height) + 1)));
}

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