var charSprite;
var chao = 180;
var Key = {
	LEFT: 37,
	RIGHT: 39,
	UP: 38
}

var nuvens = [[242, 25], [135, 12], [310, 43], [-25, 36]];
var queda = 100;

var lastKeyCode = 0;
var dir = 0;
var lastDir = 0;

var moverY = 0;
var gravidade = 2;
var pulo = 7;
var groundTouch = true;

var speed = 5;
var currSpeed = 0;

var ease = 0.3;

var isJumping = false;


window.onload = function(){
	chao += $("gameArea").offsetTop;
	
	charSprite = new Spriter("char", 45, 41, 'images/charSprite1.png', 15, 15);
	$("char").style.position = 'absolute';
	$("char").style.top = (chao-$("char").offsetHeight-queda)+"px";
	$("char").style.left = ($("gameArea").offsetLeft+10)+"px";
	
	
	for(var i=1;i<=nuvens.length;i++){
		$("cloud"+i).style.position = "absolute";
		$("cloud"+i).style.left = ($("gameArea").offsetLeft+nuvens[i-1][0])+"px";
		$("cloud"+i).style.top = ($("gameArea").offsetLeft+nuvens[i-1][1])+"px";
		animaNuvem($("cloud"+i));
	}
}

function animaNuvem(nuvem){
	var moveDistance = nuvem.offsetWidth*0.3;
	var easeType = Quad.prototype.easeInOut;
	var easeTime = 500;
	new Tween(nuvem.id, 'left', easeType, nuvem.offsetLeft, nuvem.offsetLeft+moveDistance, easeTime, false);
	if(Math.round(Math.random()) == 1) moveDistance = moveDistance * -1;
	var a = new Tween(nuvem.id, 'top', easeType, nuvem.offsetTop, nuvem.offsetTop-moveDistance, easeTime, false);
	a.onMotionFinished = function(){
		moveDistance = moveDistance * -1;
		new Tween(nuvem.id, 'left', easeType, nuvem.offsetLeft, nuvem.offsetLeft+moveDistance, easeTime, false);
		if(Math.round(Math.random()) == 1) moveDistance = moveDistance * -1;
		var b = new Tween(nuvem.id, 'top', easeType, nuvem.offsetTop, nuvem.offsetTop-moveDistance, easeTime, false);
		b.onMotionFinished = function(){
			animaNuvem(nuvem);
		}
	}
}

var gameLoopTimeout;
function gameLoop(functionToCall){
	gameLoopTimeout = setTimeout(functionToCall, f2m(getFPS()));
}


var keyListener = new Object();
document.onkeydown = function(evt){
	if(!evt){
		evt = window.event;
	}
	var keyCode = evt.keyCode;
	if((keyCode == Key.LEFT || keyCode == Key.RIGHT) && keyCode != lastKeyCode && currSpeed == 0){
		if(keyCode == Key.LEFT){
			swapCharSide(-1);
			dir = -1;
		} else if(keyCode == Key.RIGHT){
			swapCharSide(1);
			dir = 1;
		}
		lastKeyCode = keyCode;
	}
	if(keyCode == Key.UP){
		isJumping = true;
	}
}
document.onkeyup = function(evt){
	if(!evt){
		evt = window.event;
	}
	var keyCode = evt.keyCode;
	if(keyCode == lastKeyCode && (keyCode == Key.LEFT || keyCode == Key.RIGHT)){
		lastDir = dir;
		dir = 0;
		lastKeyCode = 0;
	}
	if(keyCode == Key.UP){
		isJumping = false;
	}
}


function onEnterFrame(){
	var dist;
	if(dir != 0){
		if(currSpeed < speed){
			currSpeed += ease;
		}
		dist = dir*currSpeed;
	} else {
		if(currSpeed > 0){
			currSpeed -= ease;
		} else {
			currSpeed = 0;
		}
		dist = lastDir*currSpeed;
	}
	$("char").style.left = ($("char").offsetLeft+dist)+"px";
	
	var charPos = $("char").offsetTop+$("char").offsetHeight;
	moverY += gravidade; //ganhar força gradativamente
	charPos += moverY; //bola move com a força acima

	if(charPos > chao){
		charPos = chao;
		if(!groundTouch){
			groundTouch = true;
			//splashSfx.start(0.15);
		}
		moverY *= -0.0; //usar 1 para pingar sem perder força, ou usar um valor menor (0 para não pingar)
		pulo = 7;
	} else {
		if(groundTouch){
			groundTouch = false;
		}
	}

	if(isJumping){
		if(pulo > 0){
			pulo -= 1;
		}
		moverY -= pulo;
	}

	$("char").style.top = (charPos-$("char").offsetHeight)+'px';
	
	gameLoop(onEnterFrame);
}
gameLoop(onEnterFrame);

function swapCharSide(direction){
	if(dir != direction){
		charSprite.stop();
		if(direction == lastDir){
			charSprite.play();
		} else {
			if(direction == -1){
				charSprite = new Spriter("char", 45, 41, 'images/charSprite2.png', 15, 15);
			} else if(direction == 1){
				charSprite = new Spriter("char", 45, 41, 'images/charSprite1.png', 15, 15);
			}
		}
		charSprite.onFrameChange = function(newFrame){
			if(newFrame == 0 && dir == 0){
				this.stop();
			}
		}
	}
}