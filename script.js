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
    this.angle;
    this.angle2

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

        var img2 = new Image();
        img2.src = 'ant-head-image.jpeg';

        this.angle = Math.atan2(mouse_pos.y - (this.y + 20), mouse_pos.x - (this.x + 20));
        this.angle *= (180 / Math.PI);

        if (this.angle < 0){
            this.angle = 360 - (this.angle * -1);
        }

        rotation = this.angle + 90;

        c.save(); // save current state
        c.translate(this.x - 10, this.y - 10);
        c.rotate(rotation * Math.PI / 180); // rotate
        c.translate(-this.x - 10,-this.y - 10);
        c.drawImage(img, this.x, this.y, 40, 40); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

        c.save(); // save current state
        c.translate(this.x - 10, this.y - 10);
        c.rotate(rotation * Math.PI / 180); // rotate
        c.translate(-this.x - 10,-this.y - 10);
        c.drawImage(img2, this.x + 10, this.y, 20, 20); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

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
        if (down == false && up == false && right == false && left == false){
            playerVariable.dx = 0;
            playerVariable.dy = 0;
        }
        ////////////////
        else if (up == true && mouse_pos.x != this.x && mouse_pos.y != this.y){
            playerVariable.dx = Math.cos((rotation - 90) * (Math.PI / 180)) * 5;
            playerVariable.dy = Math.sin((rotation - 90) * (Math.PI / 180)) * 5;
        }

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