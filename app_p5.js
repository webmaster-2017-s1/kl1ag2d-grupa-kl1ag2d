var bg;
var halfColor;
var borderColor;
var paddleColor;
var scoreColor;
var ballColor;
var ballStroke; // sprawdza uderzenia
var ballStrokeSize;
var ballStrokeColor;
var ballSize;
var ballDirX; // kierunek X piłki
var ballDirY; // kierunek Y piłki
var ballSpeedX; //prędkość piłki w kierunku Y (ustawiana w oparciu o miejsce, w które piłka uderzyła rakietkę, losowo na starcie
var ballInc;
var ballSpeedY; // prędkość piłki w kierunku Y (ustawiana w oparciu o miejsce, w które piłka uderzyła rakietkę, losowo na starcie
var y0; // paddle Y reflect zone | center <-> 5%
var y10; // paddle Y reflect zone | center -> 10%
var y20; // paddle Y reflect zone | center -> 20%
var y40; // paddle Y reflect zone | center -> 40%
var y50; // paddle Y reflect zone | center -> 50%
var paddleW; // szerokość paletki
var paddleH; // wysokość paletki
var paddleR; // kulistość paletki
var paddleS; // szybkość paletki
var progStart; // uruchamia się tylko na początku przy włączeniu
var playGame; // gra rozpoczyna się tylko w przypadku kliknięcia spacjii
var introMsg; // wiadomość wyświetlana przed rozpoczęciem pierwszej gry
var mX;// rakietki nie wychodzą poza ekran
var mY;// rakietki nie wychodzą poza ekran
var ballSound; // dźwięk rykoszetu
var loseSoundL; //dźwięk przegranej strony lewej
var loseSoundR; //dźwięk przegranej strony prawej
var scoreL; // wynik po lewej stronie, startuje od 0
var scoreR; // wynik po prawej stronie, startuje od 
var roundFlag;

var keys = new Array(); // klucz do sterowania rakietkami

var leftPaddle;
var rightPaddle;

// {
function setup()
{
  createCanvas(1900,1000); //wielkość canvasu (szerokość, wysokość)
  bg = color(15, 15, 15); //kolor tła
  halfColor = color(3, 0, 253); //kolor linii na środku
  borderColor = color(250, 255,250); //kolor krawędzi (dół, góra)
  paddleColor = color(0, 255, 0); //kolor paletki
  scoreColor = color( 3, 0, 253); //kolor punktacji (cyfry)
  ballColor = color(0, 255, 0); //kolor piłki
  ballStroke = false; // sprawdzanie czy występuje uderzenie
  ballStrokeSize = 1; // jeśli tak, to zmienia strokeWeight
  ballStrokeColor = color(255, 255, 255); // jeśli tak, to zmienia kolor uderzenia
  ballSize = 20; //wielkość piłki
  ballSpeedX = 14; //prędkość piłki
  ballInc = 2;
  y0 = 0.5; // paddle Y reflect zone | center <-> 5%
  y10 = 2; // paddle Y reflect zone | center -> 10%
  y20 = 3; // paddle Y reflect zone | center -> 20%
  y40 = 4.5; // paddle Y reflect zone | center -> 40%
  y50 = 6; // paddle Y reflect zone | center -> 50%
  paddleW = 10; // szerokość paletek
  paddleH = 120; // wysokość paletek
  paddleR = 5; // paddle roundness
  paddleS = 15  ; // szybkość paletek
  progStart = true; // otwiera się tylko przy otwieraniu gry
  playGame = false; // gra rozpoczyna się po kliknięciu spacji
  introMsg = true; // wiadomość wyświetlana przed rozpoczęciem gry
  //ballSound = getSound("rpg/hit-whack"); // ricochet sound
  //oseSoundL = getSound("sounds/Fail.mp3");
  //loseSoundR = getSound("sounds/Fail.mp3");
  scoreL = 0; // wynik po lewej stronie
  scoreR = 0; // wynik po prawej stronie
  roundFlag = false;
  textFont("monospace");
  
  rectMode(CENTER);
  textAlign(CENTER,CENTER);
//Rakietki
    leftPaddle = new Paddle(); //lewa paletka
    leftPaddle.posX = 0 + paddleW/2;//pozycja startowa lewej paletki (X)
    leftPaddle.posY = windowHeight/2; // pozycja startowa lewej paletki (Y)
    leftPaddle.up = 65; // klawisz do przesuwania lewej paletki do góry
    leftPaddle.down = 83; // klawisz do przesuwania lewej paletki do dołu

    rightPaddle = new Paddle(); //prawa paletka
    rightPaddle.posX = windowWidth + 40; //pozycja startowa prawej paletki (X)
    rightPaddle.posY = windowHeight/2; // pozycja startowa prawej paletki (Y)
    rightPaddle.up = 72; // klawisz do przesuwania prawej paletki do góry
    rightPaddle.down = 74; // klawisz do przesuwania prawej paletki do dołu
    // }
    //https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes - link z numerami przycisków w JS
}
//Zmienne



//przeciwne klawisze nie mogą anulować wykonywania ruchu
keyPressed = function() {
    keys[keyCode] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
};

//rakietka
var Paddle = function() {
};

Paddle.prototype.draw = function() {
    noStroke();
    fill(paddleColor);
    rect(this.posX, this.posY, paddleW, paddleH, paddleR);
};

Paddle.prototype.move = function() {
    // A/S i H/J negują się nawzajem z przeciwną prędkością -Y
    if (keyIsPressed && keys[this.up]) { //A
        this.posY -= paddleS;
    }
    
    else if (keyIsPressed && keys[this.down]) { //S
        this.posY += paddleS;
    }
    
    this.posY = constrain(this.posY, 0 + paddleH/2, height - paddleH/2);
};

// Piłka

var Ball = function() {
};

Ball.prototype.draw = function() {
    if (ballStroke) {
        strokeWeight(ballStrokeSize);
        stroke(ballStrokeColor);
    }
    else {
        noStroke();
    }
    fill(ballColor);
    ellipse(this.posX, this.posY, ballSize, ballSize);
};

Ball.prototype.reflect = function(bY, pY) {
    
    // centrowanie
    if ((bY >= pY - paddleH/20) && (bY <= pY + paddleH/20)) { // center <-> 5%
        ballSpeedY = y0;
    }
    
    // powyżej środka (mniejsza wartość Y)
    else if ((bY >= pY - paddleH/10) && (bY <= pY)) { // center -> 10%
        ballSpeedY = y10;
        ballDirY = -1;
    }
    else if ((bY >= pY - paddleH/5) && (bY <= pY)) { // center -> 20%
        ballSpeedY = y20;
        ballDirY = -1;
    }
    else if ((bY >= pY - paddleH/2.5) && (bY <= pY)) { // center -> 40%
        ballSpeedY = y40;
        ballDirY = -1; 
    }
    else if ((bY >= pY - paddleH/2) && (bY <= pY)) { // center -> 50% : last 10% of edge
        ballSpeedY = y50;
        ballDirY = -1; 
    }
    
    // poniżej środka (większa wartość Y)
        else if ((bY <= pY + paddleH/10) && (bY >= pY)) { // center -> 10%
        ballSpeedY = y10;
        ballDirY = 1;
    }
    else if ((bY <= pY + paddleH/5) && (bY >= pY)) { // center -> 20%
        ballSpeedY = y20;
        ballDirY = 1; 
    }
    else if ((bY <= pY + paddleH/2.5) && (bY >= pY)) { // center -> 40%
        ballSpeedY = y40;
        ballDirY = 1; 
    }
    else if ((bY <= pY + paddleH/2) && (bY >= pY)) { // center -> 50% : last 10% of edge
        ballSpeedY = y50;
        ballDirY = 1;
    }
};


Ball.prototype.motion = function() {
    
    // prawa rakietka
    if (
        (this.posX + ballSpeedX >= width - paddleW - ballSize/2) && 
        (this.posY > rightPaddle.posY - paddleH/2) && 
        (this.posY < rightPaddle.posY + paddleH/2)) {
        
        this.reflect(this.posY, rightPaddle.posY);
        ballDirX = -1;
    }
    
    // lewa rakietka
    else if ((this.posX - ballSpeedX <= 0 + paddleW + ballSize/2) && 
        (this.posY > leftPaddle.posY - paddleH/2) &&
        (this.posY < leftPaddle.posY + paddleH/2)) {
        
        this.reflect(this.posY, leftPaddle.posY);
        ballDirX = 1;
    }
    
    //przegrana (lewa strona)
    else if (this.posX < 0 + paddleW + ballSize/2) { // przegrana
        playGame = false; // rakietka przepuściła piłkę
        progStart = true;
        scoreR += 1;
        
       //przyrost prędkości X piłki po każdej piątej rundzie
        if ((scoreL + scoreR) % 5 === 0 ) {
            roundFlag = true;
        }
    }
   // przegrana (prawa strona)
    else if (this.posX > width - paddleW - ballSize/2) { // przegrana
        playGame = false; // rakietka przepuściła piłkę
        progStart = true;
        scoreL += 1;
        
       // przyrost prędkości X piłki po każdej piątej rundzie
        if ((scoreL + scoreR) % 5 === 0 ) {
            roundFlag = true;
        }
    }
    
    
    
    // utrzymywanie w dolnych granicach
    if (this.posY + ballSpeedX >= height - paddleW - ballSize/2) {
       ballDirY = -1;
    }
    //utrzymywanie w górnych granicach
    else if (this.posY - ballSpeedX <= 0 + paddleW + ballSize/2) {
        ballDirY = 1;
    }
    
    
    this.posX += ballSpeedX * ballDirX;
    this.posY += ballSpeedY * ballDirY;
};


var ball = new Ball(); //zmienna piłki

// funkcje

	// rysowanie linii
var drawField = function() {
    stroke(halfColor);
    strokeWeight(1);
    line(windowWidth/2, 0, windowWidth/2, windowHeight); //linia środkowa
    noStroke();
    fill(borderColor);
    rect(windowWidth/2, 0, windowWidth, 5); //krawędź górna
    rect(windowWidth/2, windowHeight + 75 , windowWidth, 5); //krawędź dolna
};

var drawScore = function() { //zliczanie punktów
    fill(scoreColor);
    textSize(75);
    text(scoreL, windowWidth/2 - windowWidth/4, windowHeight*0.875);
    text(scoreR, windowWidth/2 + windowWidth/4, windowHeight*0.875);
    textSize(25);
    
    push();
    translate(20, 60);
    rotate(PI/2);
    pop();
    push();
    translate(windowWidth - 20, windowHeight - 60);
    rotate(-PI/2);
    pop();
};
var roundSpeed = function() {
    if (roundFlag) {
        ballSpeedX += ballInc;
        roundFlag = false;
    }
};

var instructions = function() { //instrukcja (to okienko przy pierwszym uruchomieniu)
    stroke(0, 255, 160); //kolor instrukcji (krawędzie)
    strokeWeight(5); //grubość krawędzi (instrukcja)
    fill(56, 56, 56); //wypełnienie prostokątów (instrukcja)
    rect(windowWidth/2, windowHeight*0.1875, windowWidth*0.875, 125); // lewy prostokąt
    rect(windowWidth/2, windowHeight*0.8125, windowWidth*0.875, 100); // prawy prostokąt
    
    strokeWeight(2);
    line(windowWidth/2, windowHeight*0.7125, windowWidth/2, windowHeight*0.9125); // linia oddzielająca left controls od right controls
    
    fill(255, 0, 0); // kolor czcionki
    
    // instrukcja (ten napis na górze)
    textSize(45);
    text("Press [SPACE]\nto Start", windowWidth/2, 165);
    
    //  instrukcja (napisy dotyczące strowania)
    textSize(20); //wielkość czcionki (left, right controls)
    text("LEFT CONTROLS", windowWidth/2 - windowWidth/4.5, windowHeight*0.75 + 20); //wysokość i szerokość napisu "Left controls"
    text("RIGHT CONTROLS", windowWidth/2 + windowWidth/4.5, windowHeight*0.75 + 20); //wysokość i szerokość napisu "Right controls"
    textSize(20); //wielkość czcionki (up, down)
    text("up = A\ndown = S", windowWidth/2 - windowWidth/5, windowHeight*0.85);  //wysokość i szerokość napisu "up=A"
    text("up = H\ndown = J", windowWidth/2 + windowWidth/5, windowHeight*0.85); //wysokość i szerokość napisu "up=H"
};
function draw()
{
    background(bg);
    drawField();
    drawScore();
    
    if (progStart) { // włączas się tylko podczas pierwszego uruchomienia
        progStart = false;
        ball.posX = windowWidth/2;
        ball.posY = windowHeight/2; // start piłki na środku
        //start rakietek na środku
        ballDirX = round(random(-1, 1));
        while (ballDirX === 0) {
            ballDirX = round(random(-1, 1));
        }
        
        ballDirY = round(random(-1, 1));
        while (ballDirY === 0) {
            ballDirY = round(random(-1, 1));
        }
        ballSpeedY = round(random(1, 2));
    }
    
    
    if (introMsg) { // uruchamia się tylko podczas pierwszej gry (instrukcja)
        instructions();
    }
    
    
    roundSpeed();
    
    
    if (playGame) { //jeesli prawdziwe to po wcisnieciu spacji rozpoczyna się gra
        ball.motion();
    }
    
    
    leftPaddle.draw();
    rightPaddle.draw();
    
    leftPaddle.move();
    rightPaddle.move();
    
    ball.draw();
    
    if (keyIsPressed && keyCode == 32) {
        playGame = true;
        introMsg = false; //wyświetlane tylko przed pierwszą grą
    }
};


