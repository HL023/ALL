// Created by Giulio Purgatorio, check my other VERY useful stuff here https://github.com/GPurgatorio
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "darkslategray";
const HERO_COLOUR = 'rgb(0, 255, 0)';
const PROJECTILE_COLOUR = 'red';
const CIRCLE_COLOUR = 'blue';
const RADIUS = 10;
const add_speed = 0.5;
const sub_speed = 0.1;
const be_dark = 'black';
const be_white = 'white';
const virus = 10;
const MAX_virus = 2000;
const virus_RADIUS = 5;

let hero = [ {x: 225, y: 225} ]

let projectiles = [];
let circles = [];

let score;
let lvl;
let gameSpeed;
let gotHit;
let counter;
let leftPressed = false, rightPressed = false, upPressed = false, downPressed = false, spacebar = false;

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", mouseClickHandler, false);

// When the page loads, calls this
callMain(); 


// Which causes the Main function to be called with all the variables to default
function callMain() {
    gotHit = false;
    score = 0;
    lvl = 0;
    counter = 0;
    gameSpeed = 1;
    projectiles.splice(0, projectiles.length);
    circles.splice(0, circles.length);
    main();
}


function main() {
    
    if (gotHit) {
        updateHighest();
        callMain();             // resets the variables and restart
        return;                 // (Should the Hero return to the starting position? Meh)
    }

    clearCanvas();
    drawCircles();
    createProjectile();
    drawProjectiles();
    moveHero();
    drawHero();
    checkHero();

    requestAnimationFrame(main);
}


// Clears the Canvas :^)
function clearCanvas() {
    ctx.beginPath();
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokeStyle = CANVAS_BORDER_COLOUR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.closePath();
}


// Draws the Hero :^)
function drawHero() {
    ctx.beginPath();
    if(spacebar)
        ctx.fillStyle = be_white;
    else
        ctx.fillStyle = HERO_COLOUR;
    ctx.fillRect(hero[0].x - 5, hero[0].y - 5, 10, 10);
    ctx.strokeRect(hero[0].x - 5, hero[0].y - 5, 10, 10);
    ctx.closePath();
}


// Checks the gotHit boolean
function checkHero() {

    if (!gotHit) {                  // If a RedBall (projectiles) still hasn't hit the Hero
        
        score += 3;             // Normal speed score
        
        if(score / 300 > lvl) {
            lvl += 1;
            gameSpeed += 1;
        }

        document.getElementById('score').innerHTML = score;
    }
}


// Pushes a new RedBall (a.k.a. Projectile), now forcing the calculation inside the create method #efficiency
function createProjectile() {
    
    if(projectiles.length < 2) {      // Number of RedBalls (projectiles) depends on the gameSpeed
        
        let projectileX = randomTen(0, gameCanvas.width);           
        let projectileY = randomTen(0, gameCanvas.height);
        let randomness = Math.floor(Math.random()*2) % 2;
        let angle;
        
        // X, Y and angle changing to be "fair" (very close to) on where to start (top, left, right, down)
        if(projectileX < projectileY) {

            if(randomness == 0) {           // Spawns LEFT
                angle = Math.random()*180;
                projectiles.push( { x: 10, 
                                    y: projectileY, 
                                    dx: (virus*Math.cos(angle))/10, 
                                    dy: (virus*Math.sin(angle))/10
                                } )
            }
            else {                          // Spawns RIGHT
                angle = Math.random()*180+180;
                projectiles.push( { x: gameCanvas.width-10, 
                                    y: projectileY, 
                                    dx: (virus*Math.cos(angle))/10, 
                                    dy: (virus*Math.sin(angle))/10
                                } )
            }
        }

        else {          
            if(randomness == 0) {           // Spawns UP
                angle = Math.random()*180-90;
                projectiles.push( { x: projectileX, 
                                    y: 10, 
                                    dx: (virus*Math.cos(angle))/10, 
                                    dy: (virus*Math.sin(angle))/10
                                } )
            }
            else {                          // Spawns DOWN
                angle = Math.random()*180+90;
                projectiles.push( { x: projectileX, 
                                    y: gameCanvas.height-10, 
                                    dx: (virus*Math.cos(angle))/10, 
                                    dy: (virus*Math.sin(angle))/10
                                } )
            }
    }
}
}

// Draws RedBalls (projectiles)
function drawProjectiles() {
    projectiles.forEach(stuffProjectile);
}


// Called by drawProjectile() on every RedBall (projectiles)
function stuffProjectile(projectilePart) {                  // Both draw and Move -> stuff :^)
    
    let x = hero[0].x;
    let y = hero[0].y;
    
    // This simple calculation means "Is the Hero touching this projectile?"
    if(Math.sqrt((projectilePart.x-x)*(projectilePart.x-x) + (projectilePart.y-y)*(projectilePart.y-y)) < RADIUS && spacebar == false)
        gotHit = true;

    for(var n = 0; n < circles.length; n++) {
        let circ = circles[n];
        let dist = Math.sqrt((circ.x-projectilePart.x)*(circ.x-projectilePart.x) + (circ.y-projectilePart.y)*(circ.y-projectilePart.y)) -circ.r -virus_RADIUS;
        // This simple calculation means "Are you inside this circle?"
        if(dist < 0) { 
            if(projectilePart.x < circ.x){ 
                projectilePart.x -= Math.abs(dist);
                projectilePart.dx = -1 * projectilePart.dx;
            }
            else if (projectilePart.x > circ.x){
                projectilePart.x += Math.abs(dist);
                projectilePart.dx = -1 * projectilePart.dx + sub_speed;
            }              
            if(projectilePart.y < circ.y){
                projectilePart.y -= Math.abs(dist);
                projectilePart.dy = -1 * projectilePart.dy - sub_speed;
            }
            else if (projectilePart.y > circ.y){
                projectilePart.y += Math.abs(dist);
                projectilePart.dy = -1 * projectilePart.dy + sub_speed; 
            }             
            }
        }
    


    // Moves the projectile
    projectilePart.x += projectilePart.dx;
    projectilePart.y += projectilePart.dy;

    
    if(projectilePart.x > gameCanvas.width-virus_RADIUS || projectilePart.x < virus_RADIUS){
        if(projectilePart.x > gameCanvas.width-virus_RADIUS){
            let dist2 = Math.sqrt((gameCanvas.width-virus_RADIUS - projectilePart.x)*(gameCanvas.width-virus_RADIUS - projectilePart.x)) - virus_RADIUS;
            projectilePart.x += dist2;
        }
        else {
            let dist3 = Math.sqrt((projectilePart.x - virus_RADIUS)*(projectilePart.x-virus_RADIUS)) - 10;
            projectilePart.x += -1 * dist3;
        }
        projectilePart.dx = -1 * projectilePart.dx;
        if(projectiles.length < MAX_virus)
            projectiles.push( {
                x: projectilePart.x, 
                y: projectilePart.y, 
                dx: projectilePart.dx, 
                dy:  projectilePart.dy 
            } )
        else{
            if(projectilePart.dx < 0){
                projectilePart.dx += -0.1;
            }
            else{
                projectilePart.dx += 0.1;
            }
        }
        projectilePart.dy = -1 * projectilePart.dy;
    } 
    if(projectilePart.y > gameCanvas.height-virus_RADIUS || projectilePart.y < virus_RADIUS){
        if(projectilePart.y > gameCanvas.height-virus_RADIUS){
            let dist5 = Math.sqrt((gameCanvas.height-virus_RADIUS - projectilePart.y)*(gameCanvas.height-virus_RADIUS - projectilePart.y)) - virus_RADIUS;
            projectilePart.y += dist5;
        }
        else {
            let dist4 = Math.sqrt((projectilePart.y - virus_RADIUS)*(projectilePart.y-virus_RADIUS)) - virus_RADIUS;
            projectilePart.y += -1 * dist4;
        }
        projectilePart.dy = -1 * projectilePart.dy;
        if(projectiles.length < MAX_virus)
            projectiles.push( {
                x: projectilePart.x, 
                y: projectilePart.y, 
                dx: projectilePart.dx, 
                dy: projectilePart.dy 
            } )
        projectilePart.dx = -1 * projectilePart.dx;
    }
    
    // Draws the projectile
    
    ctx.beginPath();
    if(spacebar)
        ctx.fillStyle = be_dark;
    else
        ctx.fillStyle = PROJECTILE_COLOUR;
    ctx.arc(projectilePart.x, projectilePart.y, virus_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}


// Moves the Hero :^)
function moveHero() {
    
    touchingCircles();

    if(leftPressed && hero[0].x > 9)
        hero[0].x = hero[0].x - 4;
    else if(rightPressed && hero[0].x < gameCanvas.width - 9)
        hero[0].x = hero[0].x + 4;
    if(upPressed && hero[0].y > 9)
        hero[0].y = hero[0].y - 4;
    else if(downPressed && hero[0].y < gameCanvas.height - 9)
        hero[0].y = hero[0].y + 4;
    touchingCircles();
}


// If the Hero is touching a BlueBall (circles) he gets "knocked" a bit away
function touchingCircles() {
    
    let a = hero[0].x;
    let b = hero[0].y;
    
    for(var n = 0; n < circles.length; n++) {
        
        let circ = circles[n];
        let dist = Math.sqrt((circ.x-a)*(circ.x-a) + (circ.y-b)*(circ.y-b)) -circ.r -5;
        // This simple calculation means "Are you inside this circle?"
        if(dist < 0 && spacebar != true) {   
            
            if(a < circ.x)
                hero[0].x = hero[0].x - Math.abs(dist);
            else if (a > circ.x)
                hero[0].x = hero[0].x + Math.abs(dist);
            
            if(b < circ.y)
                hero[0].y = hero[0].y - Math.abs(dist);
            else if (b > circ.y)
                hero[0].y = hero[0].y + Math.abs(dist);
            
            return true;
        }
    }
    
    return false;
}


// Creates a BlueBall (circles)
function createCircle() { 

    if(circles.length < 5 && counter >= 40) {               // No more than 5 because of REASONZ
        counter = 0;
        let tmpX = Math.random()*(gameCanvas.width-37);
        let tmpY = Math.random()*(gameCanvas.height-37);
        if(tmpX < 37) tmpX += 37;                           // All of this is just to prevent "out of bounds"
        if(tmpY < 37) tmpY += 37;                           // on the hero, which would make you invincible
        circles.push( {x: tmpX, y: tmpY, r: 3});
    }
    
    else
        counter += 1 % 60;
}


// Can you see how lazy I am? Both create and draw in the same function huehue
function drawCircles(){
    createCircle();
    circles.forEach(drawCircle);
}


// Simply draws the circle, called by drawCircles()
function drawCircle(circlePart) {
    
    if(circlePart.r < 18) {             // "18" is simply the maximum range, I'm lazy and I won't put a constant
        circlePart.r += 0.1;
        ctx.fillStyle = CIRCLE_COLOUR;
    }
    
    else 
        ctx.fillStyle = "blue";            // Easter Egg for whoever knows me AHAHAH

    // Draws the BlueBall (circles)
    ctx.beginPath();
    ctx.arc(circlePart.x, circlePart.y, circlePart.r, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}


// If clicking, calls hitTest with pointer's relatives coordinates
function mouseClickHandler(e) {
    hitTest(e.x - gameCanvas.offsetLeft, e.y - gameCanvas.offsetTop);
}


// If the click is inside any BlueBall (circles)..
function hitTest(ex, ey) {
    
    for(var n = 0; n < circles.length; n++) { 
        
        let xc = circles[n].x;
        let yc = circles[n].y;
        
        if(Math.sqrt((xc-ex)*(xc-ex) + (yc-ey)*(yc-ey)) < circles[n].r) {
            counter = 0;                                // reset the counter for smoothness
            score += Math.floor(10000/circles[n].r);    // get points for hitting the circle
            circles.splice(n,1);                        // remove the circle
        }
    }
}

// Key Handler (Down)
function keyDownHandler(e) {
    if(e.keyCode == 37) 
        leftPressed = true;
    if(e.keyCode == 39) 
        rightPressed = true;
    if(e.keyCode == 38) 
        upPressed = true;
    if(e.keyCode == 40) 
        downPressed = true;
    if(e.keyCode == 32)
        spacebar = true;
}


// Key Handler (Up)
function keyUpHandler(e) {
    if(e.keyCode == 37) 
        leftPressed = false;
    if(e.keyCode == 39) 
        rightPressed = false;
    if(e.keyCode == 38) 
        upPressed = false;
    if(e.keyCode == 40) 
        downPressed = false;
    if(e.keyCode == 32)
        spacebar = false;
}


// Simple random
function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}


// Updates the highest score (this run), if needed
function updateHighest() {
    let tmp = highest.innerHTML;
    if(tmp < score)
        highest.innerHTML = score; 
}

