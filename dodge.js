var dodge = {};

dodge.boot = function() {
  dodge.context  = $('#playground')[0].getContext('2d');
  dodge.width    = $('#playground').width();
  dodge.height   = $('#playground').height();
  dodge.gameOver = true;
  dodge.notify('Press S to start', 85, 135);
  $(document).keydown(dodge.keyDown).keyup(dodge.keyUp);
}

dodge.init = function() {
  dodge.setLevel(0).setScore(0);
  dodge.goLeft = dodge.goRight = dodge.speedUp = false;
  dodge.move = dodge.score = dodge.intervalID = 0;
  dodge.gap = 5; // Space between adjacent enemy blocks
  dodge.level = 1; // Starting level
  dodge.speed = 2; // Initial speed of the enemies
  dodge.block = 2; // Values between 0 and 3
  dodge.enemyCount = 5; // max number of enemies possible (width of the playground in blocks)
  dodge.position = (dodge.width)*dodge.block/dodge.enemyCount + dodge.gap;
  dodge.speedUpBy = 0.2;
  dodge.setArrangements();
  dodge.play = true;
  dodge.drawHero().drawEnemies();
  $('#playground').css('opacity', 1).unbind('click');
  dodge.intervalID = setInterval(dodge.paint, 8);
}

dodge.keyUp = function(e) {
  switch(e.keyCode) {
	case 37:
	  dodge.goLeft = false; 
	  break;
	case 38:
	  dodge.speedUp = false; 
	  break;
	case 39:
	  dodge.goRight = false; 
	  break;
  }
}

dodge.keyDown = function(e) {
  switch(e.keyCode) {
    case 37:
	  dodge.goLeft = true; 
	  break;
	case 38:
	  dodge.speedUp = true; 
	  break;
	case 39:
	  dodge.goRight = true; 
	  break;
	case 80:
	  if (dodge.play) 
		clearInterval(dodge.intervalID);
	  else if (!dodge.gameOver)
		dodge.intervalID = setInterval(dodge.paint, 8);
		dodge.play = !dodge.play;
		break;
	case 83:
	   if (dodge.gameOver)
		 dodge.init();
	   break;
  }
}

dodge.drawFigure = function(x, y, width, height, color) {
  dodge.context.beginPath();
  dodge.context.rect(x, y, width, height);
  dodge.context.fillStyle = color;
  dodge.context.fill();	 
  dodge.context.closePath();
}

dodge.drawHero = function() {
  dodge.drawFigure(dodge.position, dodge.height - 50, 50, 50, '#CCC'); 
  return this;
}

dodge.drawEnemies = function() {
  for (var i = 0; i < dodge.enemyCount; i++) 
	 if (!(i in dodge.arrangement)) 
	   dodge.drawFigure(Number(1/dodge.enemyCount)*i*dodge.width + dodge.gap, dodge.move, 50, 50, '#777');
  return this;      	
}

dodge.paint = function() {  
  dodge.gameOver = false;
  
  if (dodge.goRight == true && (dodge.width - dodge.position > (Number(1/dodge.enemyCount)*dodge.width) - dodge.gap)) {
	dodge.position += (Number(1/dodge.enemyCount)*dodge.width);	
	dodge.block++;
	dodge.goRight = false;			
  }
  
  if (dodge.goLeft == true && dodge.position != dodge.gap) {
	dodge.position -= (Number(1/dodge.enemyCount)*dodge.width);
	dodge.block--;
	dodge.goLeft = false;
  }
  
  dodge.move += (dodge.speedUp == true) ? 4 * dodge.speed : dodge.speed;
  dodge.context.clearRect(0, 0, dodge.width, dodge.height); 
  dodge.drawHero().drawEnemies();
  
  if (dodge.move > (dodge.height - 96) ) {
	if (!(dodge.block in dodge.arrangement)) {
	  dodge.notify('Press S to restart', 150, 135);
	  clearInterval(dodge.intervalID);
	  dodge.gameOver = true;
	  return;
	}
  } 
  
  if (dodge.move > dodge.height) {
	dodge.move = 0;
	dodge.score++;
	if (dodge.score%5 == 0) {
	  dodge.level++;
	  dodge.speed += dodge.speedUpBy;
	  dodge.setLevel(dodge.level);
	}
	dodge.setScore(dodge.score);
	dodge.setArrangements()
  }
}

dodge.setScore = function(score) {
  $('.scoreBoard').html('<div class="subtext">Dodges</div>' + score).hide().fadeIn(); 
  if ('chrome' in window && chrome !== undefined && chrome.browserAction !== undefined) {
	  chrome.browserAction.setBadgeBackgroundColor({color:[200, 0, 0, 0]});
	  chrome.browserAction.setBadgeText({text: String(score) });
  }
  return this;
}

dodge.setLevel = function(level) {
  $('.speedMeter').html('<div class="subtext">Level</div>' + level).hide().fadeIn();
  return this;
}

dodge.setArrangements = function() {
  dodge.arrangement = new Array();
  var found = Math.floor(Math.random()*4);
  var temp;
  do {
  	temp = Math.floor(Math.random()*4);
  } while(temp == found);
  dodge.arrangement[found] = dodge.arrangement[temp] = 0;
}

dodge.notify = function(text, x, y) {
  dodge.context.font = "normal normal 19px Georgia";
  dodge.context.fillStyle = "white";
  dodge.context.fillText(text, x, y);
  dodge.context.textAlign = "center";
  $('#playground').css('opacity', '0.7'); // dim the canvas
}

dodge.boot();