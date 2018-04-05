
    const canvas = document.querySelector('canvas');
    /*nowe właściwości i metody do których odwałamy sie za pomocą obiektu ctx*/
    const ctx = canvas.getContext('2d');

    canvas.width = 1000;
    canvas.height = 500;

    const cw = canvas.width;
    const ch = canvas.height;

    const ballSize = 20; //wielkosć piłki
    let ballX = cw / 2 - ballSize / 2
    let ballY = ch / 2 - ballSize / 2

    const paddelHeight = 100; //wysokość rakietki gracza
    const paddelWidth = 20; //szerokość rakietki gracza

    const playerX = 70;
    const aiX = 910;

    let playerY = 200;
    let aiY = 200;

    const lineWidth = 6; //szerokosć rakietek
    const lineHeight = 16; //wysokosć rakietek

    let ballSpeedX = 9; //szybkość piłki
    let ballSpeedY = 9;


    function player() {
      ctx.fillStyle = 'red'; //kolor paletki 1
      ctx.fillRect(playerX, playerY, paddelWidth, paddelHeight);
    }


    function ai() {
      ctx.fillStyle = 'red'; // kolor paletki 2
      ctx.fillRect(aiX, aiY, paddelWidth, paddelHeight);
    }

    function ball() {

      ctx.fillStyle = 'white'; // kolor piłki
      ctx.fillRect(ballX, ballY, ballSize, ballSize);


      ballX += ballSpeedX;
      ballY += ballSpeedY;

      if (ballY <= 0 || ballY + ballSize >= ch ) {
        ballSpeedY = -ballSpeedY;
        speedUp();
      }

      if (ballX <=0 || ballX + ballSize >= cw) {
          ballSpeedX = -ballSpeedX;
          speedUp();
        }
        if (playerY <= ballY && playerY + paddelHeight >= ballY - ballSize && ballX <= playerX + paddelWidth && ballX >= playerX) {
        ballSpeedX = -ballSpeedX;
      }

      if (aiY <= ballY && playerY + paddelHeight >= ballY - ballSize && ballX <= aiX + paddelWidth && ballX >= aiX) {
        ballSpeedX = -ballSpeedX;
      }
    }



    function table() {

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, cw, ch);

      for (let linePosition = 20; linePosition < ch; linePosition += 30) {
        ctx.fillStyle = "white"
        ctx.fillRect(cw / 2 - lineWidth / 2, linePosition, lineWidth, lineHeight)
      }

    }

    topCanvas = canvas.offsetTop;

     function playerPosition(event) {
       playerY = event.clientY - topCanvas - paddelHeight / 2;
       if (playerY >= ch - paddelHeight) {
         playerY = ch - paddelHeight
       }
       if (playerY <= 0) {
         playerY = 0;
       }
       //aiY = playerY;
     }

     function speedUp() {            /// przypieszenie piłki
       //console.log(ballSpeedX + "," + ballSpeedY);
       if (ballSpeedX > 0 && ballSpeedX < 16){
            ballSpeedX += .4;
       }
        else  if (ballSpeedX> 0 && ballSpeedX > -16) {
             ballSpeedX -= 4;
        }
        if (ballSpeedY > 0 && ballSpeedY < 16){
             ballSpeedX += .3;
        }
         else  if (ballSpeedY > 0 && ballSpeedY > -16) {
              ballSpeedY -= .3;
         }
     }

     function aiPosition() { //Sztuczna inteligencja paletki
      const middlePaddel= aiY + paddelHeight / 2 ;
      const middleBall = ballY + ballSize / 2;
      
      if (ballX > 500) {
        
        if (middlePaddel - middleBall > 200) {
 
          aiY -= 24;
          
        } else if (middlePaddel - middleBall > 50) {
          aiY -= 10;
        }
        else if (middlePaddel - middleBall < -200) {
          aiY += 24;
        } else if (middlePaddel - middleBall < -50) {
          aiY += 10;
        }
       }
       
      if (ballX <= 500 && ballX > 100) {
        if (middlePaddel - middleBall > 100) {
          aiY -= 3;
        } 
 if (middlePaddel - middleBall < -100) {
          aiY += 3;
        }
      }
      if (aiY >= ch - paddelHeight) {
        aiY = ch - paddelHeight
      }
	
      if (aiY <= 0) {
        aiY = 0;
      }
    }

    canvas.addEventListener("mousemove", playerPosition)

    function game() {
      table()
      ball()
      player()
      ai()
      aiPosition()
    }

    setInterval(game, 1000 / 60)

