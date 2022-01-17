var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

document.addEventListener('keydown', aim, true);
document.addEventListener('keyup', aim2, true);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var left = false;
var right = false;
var up = false;
var down = false;
let jump = 0;

function Player(x, y, infected){
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
        img.src = 'ant-image.png';

        // Movement
        if (left == true && up == false && down == false && this.x > 0){
            playerVariable.dx = -5;

            c.save(); // save current state
            c.translate(this.x, this.y);
            c.rotate(-83); // rotate
            c.translate(-this.x,-this.y);
            c.drawImage(img, this.x, this.y, 40, 40); // draws a chain link or dagger
            c.restore(); // restore original states (no rotation etc)
        }
        else if ((left == true && up == true) || (left == true && down == true) && this.x > 0){
            playerVariable.dx = -3.5;
        }
        ////////////////
        if (right == true && up == false && down == false && this.x < window.innerWidth - 41){
            playerVariable.dx = 5;

            c.save(); // save current state
            c.translate(this.x, this.y);
            c.rotate(-80); // rotate
            c.translate(-this.x,-this.y);
            c.drawImage(img, this.x, this.y, 40, 40); // draws a chain link or dagger
            c.restore(); // restore original states (no rotation etc)
        }
        else if ((right == true && up == true) || (right == true && down == true) && this.x < window.innerWidth - 41){
            playerVariable.dx = 3.5;
        }
        ////////////////
        if (up == true && right == false && left == false && this.y > 0){
            playerVariable.dy = -5;
        }
        else if ((up == true && right == true) || (up == true && left == true) && this.y > 0){
            playerVariable.dy = -3.5;
        }
        ////////////////
        if (down == true && right == false && left == false && this.y < window.innerWidth - 41){
            playerVariable.dy = 5;
        }
        else if ((down == true && right == true) || (down == true && left == true) && this.y < window.innerHeight - 41){
            playerVariable.dy = 3.5;
        }
        ////////////////
        if (down == false && up == false && right == false && left == false){
            playerVariable.dx = 0;
            playerVariable.dy = 0;

            c.save(); // save current state
            c.translate(this.x, this.y);
            c.rotate(Math.PI/180); // rotate
            c.translate(-this.x,-this.y);
            c.drawImage(img, this.x, this.y, 40, 40); // draws a chain link or dagger
            c.restore(); // restore original states (no rotation etc)
        }
        ////////////////

        if (this.y > window.innerHeight- 40){
            this.y = window.innerHeight - 40;
        }
        else if (this.y < 0){
            this.y = 0;
        }

        if (this.x > window.innerWidth - 40){
            this.x = window.innerWidth - 40;
        }
        else if (this.x < 0){
            this.x = 1;
        }

        // Movement
        this.x += this.dx;
        this.y += this.dy;
    }
}

var playerVariable = new Player(canvas.width / 2, canvas.height / 2);

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

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    // GameObjects
    playerVariable.draw();

    c.restore();
}

animate();