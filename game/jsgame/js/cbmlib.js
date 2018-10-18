/**********************************************************/
/*                                                        */
/*            cbmLib - caiodba@hotmail.com                */
/*                                                        */
/**********************************************************/


//VERIFICACOES

//FLASH PLAYER INSTALL VERIFICATION
var rodaSWF;

var MM_contentVersion = 8;
var plugin = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ? navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
if ( plugin ) {
		var words = navigator.plugins["Shockwave Flash"].description.split(" ");
		for (var i = 0; i < words.length; ++i)
		{
		if (isNaN(parseInt(words[i])))
		continue;
		var MM_PluginVersion = words[i]; 
		}
	var MM_FlashCanPlay = MM_PluginVersion >= MM_contentVersion;
}
else if (navigator.userAgent && navigator.userAgent.indexOf("MSIE")>=0 && (navigator.appVersion.indexOf("Win") != -1)) {
	document.write('<SCR' + 'IPT LANGUAGE=VBScript\> \n'); //FS hide this from IE4.5 Mac by splitting the tag
	document.write('on error resume next \n');
	document.write('MM_FlashCanPlay = ( IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash." & MM_contentVersion)))\n');
	document.write('</SCR' + 'IPT\> \n');
}
if ( MM_FlashCanPlay ) {
	rodaSWF = 1;
} else{
	rodaSWF = 0;
}
//FIM VERIFICAÇÃO SE FLASH PLAYER INSTALL VERIFICATION

//FIM DE VERIFICACOES


var DEFAULT_FPS = 30;
var fps=DEFAULT_FPS;

function None(){}
None.prototype.easeNone = function (t, b, c, d) {
	return c*t/d + b;
}

function Back(){}
Back.prototype.easeIn = function (t, b, c, d, s){
	if (s == undefined) s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
}

Back.prototype.easeOut = function (t, b, c, d, s){
	if (s == undefined) s = 1.70158;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
}

Back.prototype.easeInOut = function (t, b, c, d, s){
	if (s == undefined) s = 1.70158; 
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
}

function Elastic(){}
Elastic.prototype.easeIn = function (t, b, c, d, a, p){
	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
}

Elastic.prototype.easeOut = function (t, b, c, d, a, p){
	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
}

Elastic.prototype.easeInOut = function (t, b, c, d, a, p){
	if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
	if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
}

function Quad(){}
Quad.prototype.easeIn = function (t, b, c, d) {
	t /= d;
	return c*t*t + b;
}
Quad.prototype.easeOut = function (t, b, c, d) {
	t /= d;
	return -c * t*(t-2) + b;
}
Quad.prototype.easeInOut = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
}

function Cubic(){}
Cubic.prototype.easeIn = function (t, b, c, d) {
	t /= d;
	return c*t*t*t + b;
}

Cubic.prototype.easeOut = function (t, b, c, d) {
	t /= d;
	t--;
	return c*(t*t*t + 1) + b;
}
Cubic.prototype.easeInOut = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
}

function Quartic(){}
Quartic.prototype.easeIn = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
}
Quartic.prototype.easeOut = function (t, b, c, d) {
	t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
}
Quartic.prototype.easeInOut = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
}

function Quintic(){}
Quintic.prototype.easeIn = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t*t + b;
}
Quintic.prototype.easeOut = function (t, b, c, d) {
	t /= d;
	t--;
	return c*(t*t*t*t*t + 1) + b;
}
Quintic.prototype.easeInOut = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t*t*t + 2) + b;
}

function Sine(){}
Sine.prototype.easeIn = function InSine (t, b, c, d) {
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
}
Sine.prototype.easeOut = function OutSine (t, b, c, d) {
	return c * Math.sin(t/d * (Math.PI/2)) + b;
}
Sine.prototype.easeInOut = function InOutSine (t, b, c, d) {
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}

function Expo(){}
Expo.prototype.easeIn = function (t, b, c, d) {
	return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
}
Expo.prototype.easeOut = function (t, b, c, d) {
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
}
Expo.prototype.easeInOut = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
}

function Circ(){}
Circ.prototype.easeIn = function (t, b, c, d) {
	t /= d;
	return -c * (Math.sqrt(1 - t*t) - 1) + b;
}
Circ.prototype.easeOut = function (t, b, c, d) {
	t /= d;
	t--;
	return c * Math.sqrt(1 - t*t) + b;
}
Circ.prototype.easeInOut = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	t -= 2;
	return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
}

function $(objId){
	return document.getElementById(objId);
}

function getFPS(){
	return fps;
}

function setFPS(theFps){
	fps=theFps;
}

function resetFPS(){
	fps = DEFAULT_FPS;
}

function f2m(fps, frames){
	if(frames) return frames*(1000/fps);
	else return 1000/fps;
}

function m2f(fps, milli){
	return milli/f2m(fps);
}

function dec2hex(num){
	var termos = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
	var out = "";
	do{
		var q = parseInt(num/16, 10);
		var r = num%16;
		num=q;
		out=termos[r]+out;
	} while(q);
	return out;
}

function fixHex(hex){
	var rd = 6-(hex.length-1);
	for(var i=0;i<rd;i++){
		hex = hex.charAt(0)+"0"+hex.substr(1);
	}
	return hex;
}

function getOpacity(objId){
	if(navigator.appName.toLowerCase().indexOf("Microsoft") >= 0){
		var currOp = $(objId).style.filter.substr($(objId).style.filter.indexOf("=")+1);
		currOp = parseInt(currOp.substr(0, currOp.length-1), 10)/100;
	} else {
		var currOp = parseInt($(objId).style.opacity, 10);
	}
	if(currOp) return currOp;
	else return 1;
}

function Tween(DOMObjId, style, easeType, initValue, finalValue, duration, useSeconds, xtraProp){
	var obj = $(DOMObjId);
	if(xtraProp){
		for(var i in xtraProp){
			obj.style[i] = xtraProp[i];
		}
	}
	
	if(style.toLowerCase().indexOf("color")>=0 && initValue.charAt(0)=="#" && finalValue.charAt(0)=="#"){
		initValue = parseInt(initValue.substr(1), 16);
		finalValue = parseInt(finalValue.substr(1), 16);
	}
	
	if(useSeconds) var dur = m2f(getFPS(), duration*1000);
	else var dur = duration;
	if(initValue>finalValue){
		var negnum=true;
		var temp = initValue;
		initValue=finalValue;
		finalValue=temp;
	} else var negnum=false;
	var theSc = this;
	
	if(obj["s_"+style]){
		obj["s_"+style].brk();
	}
	obj["s_"+style]=this;
	this.tO=window.setTimeout(function(){
		theSc.animate(obj, style, easeType, 0, initValue, finalValue-initValue, dur, f2m(getFPS(), 1), theSc, negnum);
	}, 1);
}

Tween.prototype.isStopped=0;

Tween.prototype.animate = function(o, p, e, ct, vi, vf, d, de, sc, iN){
	var pref, suf;
	
	var valor = e(ct, vi, vf, d);
	if(iN){
		valor = vf+vi+vi-valor;
	}
	
	if(p.toLowerCase().indexOf("opacity")>=0 || p=="filter" || p=="alpha"){
		if(navigator.appName.toLowerCase().indexOf("microsoft")>=0){
			p="filter";
			pref="alpha(opacity=";
			suf=")";
			valor *=100;
		} else {
			pref="";
			suf="";
		}
	} else if(p.toLowerCase().indexOf("color")>=0){
		pref="";
		suf="";
		valor = fixHex("#"+dec2hex(parseInt(valor, 10)));
	} else {
		suf="px";
		pref="";
	}
	
	o.style[p] = pref+valor+suf;
	if(ct<d && !sc.isStopped){
		sc.tO=window.setTimeout(function(){
			sc.animate(o, p, e, ct+1, vi, vf, d, de, sc, iN);
		}, de);
	} else if ((!sc.isStopped || sc.isStopped==2) && sc.onMotionFinished){
		sc.onMotionFinished();
		o["s_"+p]=null;
	} else {
		o["s_"+p]=null;
	}
}

Tween.prototype.stop = function (callOMFF){
	if(callOMFF){
		this.isStopped = 2;
	} else {
		this.isStopped = 1;
	}
}

Tween.prototype.brk = function(callOMFF){
	clearTimeout(this.tO);
	if(callOMFF && this.onMotionFinished){
		this.onMotionFinished();
	}
}

function AdvTween(easeType, initValue, finalValue, duration, useSeconds, theFunction){
	if(useSeconds) var dur = m2f(getFPS(), duration*1000);
	else var dur = duration;
	if(initValue>finalValue){
		var negnum=true;
		var temp = initValue;
		initValue=finalValue;
		finalValue=temp;
	} else var negnum=false;
	var theSc = this;
	this.tO = window.setTimeout(function(){
		theSc.animate(easeType, 0, initValue, finalValue-initValue, dur, f2m(getFPS(), 1), theSc, negnum, theFunction);
	}, 1);
}

AdvTween.prototype.isStopped=0;

AdvTween.prototype.animate = function(e, ct, vi, vf, d, de, sc, iN, tF){	
	var valor = e(ct, vi, vf, d);
	if(iN){
		valor = vf+vi+vi-valor;
	}
	
	tF(valor);
	
	if(ct<d && !sc.isStopped){
		sc.tO = window.setTimeout(function(){
			sc.animate(e, ct+1, vi, vf, d, de, sc, iN, tF);
		}, de);
	} else if ((!sc.isStopped || sc.isStopped==2) && sc.onMotionFinished){
		sc.onMotionFinished();
	}
}

AdvTween.prototype.stop = function (callOMFF){
	if(callOMFF){
		this.isStopped = 2;
	} else {
		this.isStopped = 1;
	}
}

function getStyleFromObject(objId, style){
	var objeto = typeof objId == "string" ? $(objId) : objId;
	if (objeto.currentStyle)
		return objeto.currentStyle[style];
	else if(window.getComputedStyle)
		return document.defaultView.getComputedStyle(objeto,null).getPropertyValue(style);
	else
		return null;
}

function getNextHighestZindex(obj){
	var highestIndex = 0;
	var currentIndex = 0;
	var elArray = Array();
	if(obj){ elArray = obj.getElementsByTagName('*'); }else{ elArray = document.getElementsByTagName('*'); }
	for(var i=0; i < elArray.length; i++){
		var cIndexTmp = getStyleFromObject(elArray[i], "z-index");
		currentIndex = cIndexTmp != null ? cIndexTmp : getStyleFromObject(elArray[i].id, "z-index");
		if(!isNaN(currentIndex) && currentIndex > highestIndex){ highestIndex = currentIndex; }
	}
   return(highestIndex+1);
}

// drag and drop

function getXY(evt){
	if(window.event)
		return [window.event.clientX, window.event.clientY];
	else
		return [evt.pageX, evt.pageY];
}

if(!Drag){
	var Drag = {
		X_AXIS: 0,
		Y_AXIS: 1,
		BOTH_AXIS: 2,
		ABSOLUTE: 0,
		RELATIVE: 1
	};
}
function startDrag(mouseDownEventObject, objId, keepZindex, axisConstraint, relativity){
	var objeto = objId ? $(objId) : this;
	var relativities = ["absolute", "relative"];
	if(objeto != null){
		if(!keepZindex)
			objeto.style.zIndex = getNextHighestZindex();

		var ptos = getXY(mouseDownEventObject);
		var xDif = ptos[0] - objeto.offsetLeft;
		var yDif = ptos[1] - objeto.offsetTop;
		
		if(relativity == 1) {
			objeto.style.position = relativities[relativity];
			var container = objeto.parentNode;
		} else {
			objeto.style.position = relativities[0];
		}
		
		document.onmousemove = function(evt){
			var willDrag;
			ptos = getXY(evt);
			if(relativity == 1){
				ptos[0] -= container.offsetLeft;
				ptos[1] -= container.offsetTop;
			}
			var xPos = (ptos[0] - xDif);
			var yPos = (ptos[1] - yDif);
			evt.nextX = xPos;
			evt.nextY = yPos;
			if(objeto.onDrag) willDrag = objeto.onDrag(evt);
			if(willDrag != false){
				if(axisConstraint == null || axisConstraint == 2 || axisConstraint == 0)
					objeto.style.left = xPos + "px";
				if(axisConstraint == null || axisConstraint == 2 || axisConstraint == 1)
					objeto.style.top = yPos + "px";
				if(objeto.onDragAfter) objeto.onDragAfter(evt);
			}
			return false; //retorna falso para não selecionar nada na tela
		}
		
		document.onmouseup = objeto.onmouseup;
	}
	return false; //retorna falso para não selecionar nada na tela
}

function stopDrag(){
	document.onmousemove = null;
}

// fom de drag and drop

// funções de calendario

MD = [31,28,31,30,31,30,31,31,30,31,30,31];
MK = "144025036146";
WK = "1234560";
function getYK(y){
	var ano = parseInt(y.toString().substr(2), 10),
	k = (parseInt(ano/4)+ano%7)%7;
	if(y>=2000) k--;
	return k;
}
function isBisixth(y){
	return y%4==0 && (y%100!=0 || y%400==0);
}
function getWKFromDate(d,m,y){
	wk = (d+parseInt(MK.charAt(m-1),10)+getYK(y))%7;
	if(isBisixth(y) && (m==0||m==1))
		wk--;
	return wk;
}
function WK2W(wk){
	return WK.indexOf(wk);
}
function getWeekDayFromDate(d,m,y){
	return WK2W(getWKFromDate(d,m,y));
}
function getPrevMonth(m){ //internal
	return m-1<0?11:m-1;
}
function getNextMonth(m){ //internal
	return m+1>11?0:m+1;
}

function findEventByDay(eventList, day){
	for(var i=0;i<eventList.length;i++){
		if(eventList[i].day == day){
			return i;
		}
	}
	return -1;
}

function drawCalendar(dia, mes, ano, estilos, eventos){
	MD[1] = isBisixth(ano)?29:28;
	var firstWeekDay = getWeekDayFromDate(1, mes, ano);
	var lastWeekDay = getWeekDayFromDate(MD[mes-1], mes, ano);
	for(var i=(MD[getPrevMonth(mes-1)]-(firstWeekDay-1)); i<=MD[getPrevMonth(mes-1)]; i++){
		document.write('<div class="'+estilos.dayOut+'">');
		document.write('<div class="'+estilos.number+'">'+i+'</div>');
		document.write('<div class="'+estilos.text+'">&nbsp;</div>');
		document.write('</div>');
	}
	for(var i=1;i<=MD[mes-1];i++){
		evtIndex = findEventByDay(eventos, i);
		var sts = [estilos.day, estilos.number, estilos.text];
		var evtData = ['', '&nbsp;', ''];
		if(evtIndex > -1){
			sts[0] = estilos.featured;
			evtData = ['<a href="'+eventos[evtIndex].link+'">', eventos[evtIndex].title, '</a>'];
		}
		document.write('<div class="'+sts[0]+'">');
		document.write(evtData[0]);
		document.write('<div class="'+sts[1]+'">'+i+'</div>');
		document.write('<div class="'+sts[2]+'">'+evtData[1]+'</div>');
		document.write(evtData[2]);
		document.write('</div>');
	}
	for(var i=1;i<=6-lastWeekDay;i++){
		document.write('<div class="'+estilos.dayOut+'">');
		document.write('<div class="'+estilos.number+'">'+i+'</div>');
		document.write('<div class="'+estilos.text+'">&nbsp;</div>');
		document.write('</div>');
	}
}


// fim de funções de calendário

//Spriter

function Spriter(DOMObjId, tileWidth, tileHeight, spriteImageFile, tilesPerLine, totalTiles, loops, fromFrame){
	this.spriteData = {_DOMObjId: DOMObjId, _tileWidth: tileWidth, _tileHeight: tileHeight, _spriteImageFile: spriteImageFile, _tilesPerLine: tilesPerLine, _totalTiles: totalTiles, _loops: (typeof loops=="number" ? (loops<=0?loops:loops-1) : -1), _currentframe: (typeof fromFrame=="number"?fromFrame : 0)};
	var objeto = typeof DOMObjId == "string" ? $(DOMObjId) : DOMObjId;
	var aqui = this;
	this.obj = objeto;
	objeto.style.backgroundRepeat = "no-repeat";
	objeto.style.backgroundImage = "url(\""+spriteImageFile+"\")";
	objeto.style.width = tileWidth+"px";
	objeto.style.height = tileHeight+"px";
	var currentParams = {ease: None.prototype.easeNone, initValue: 0, finalValue: totalTiles-1, duration: totalTiles, useSeconds: false, theFunction: function(valor){
		var frameNum = Math.floor(valor);
		aqui.gotoFrame(frameNum);
	}};
	this.aTObj = new AdvTween(currentParams.ease, currentParams.initValue, currentParams.finalValue, currentParams.duration, currentParams.useSeconds, currentParams.theFunction);
	this.aTObj.currentParams = currentParams;
	this.aTObj.onMotionFinished = function(){
		if(aqui.spriteData._loops > 0 || aqui.spriteData._loops < 0){
			this.animate(currentParams.ease, 0, currentParams.initValue, currentParams.finalValue, currentParams.duration, f2m(getFPS(), 1), this, false, currentParams.theFunction);
			aqui.spriteData._loops--;
		}
	}
}

Spriter.prototype.spriteData = {_DOMObjId: '', _tileWidth: 0, _tileHeight: 0, _spriteImageFile: '', _tilesPerLine: 0, _totalTiles: 0, _loops: 0, _currentframe: 0};
Spriter.prototype.getAdvTweenObject = function(){
	return this.aTObj;
}
Spriter.prototype.gotoFrame = function(frame){
	frame = Math.floor(frame);
	frame = frame < 0 ? 0 : (frame >= this.spriteData._totalTiles ? this.spriteData._totalTiles-1 : frame);
	this.spriteData._currentframe = frame;
	var currRow = parseInt(frame/this.spriteData._tilesPerLine);
	var currCol = frame%this.spriteData._tilesPerLine;
	var tilePos = [(this.spriteData._tileWidth*currCol)*(-1), (this.spriteData._tileHeight*currRow)*(-1)];
	this.obj.style.backgroundPosition = tilePos[0]+"px "+tilePos[1]+"px";
	if(this.onFrameChange)
			this.onFrameChange(frame);
}
Spriter.prototype.stop = function(){
	this.getAdvTweenObject().isStopped = 1;
	this.getAdvTweenObject().stop(false);
	clearTimeout(this.getAdvTweenObject().tO);
}
Spriter.prototype.play = function(){
	var advTweenObj = this.getAdvTweenObject();
	if(advTweenObj.isStopped){
		var params = advTweenObj.currentParams;
		advTweenObj.isStopped = 0;
		advTweenObj.animate(params.ease, this.spriteData._currentframe+2, params.initValue, params.finalValue, params.duration, f2m(getFPS(), 1), advTweenObj, false, params.theFunction);
	}
}
Spriter.prototype.isStopped = function(){
	return this.aTObj.isStopped;
}
Spriter.prototype.gotoAndStop = function(frame){
	this.stop();
	this.gotoFrame(frame);
}

Spriter.prototype.gotoAndPlay = function(frame){
	this.stop();
	this.gotoFrame(frame);
	this.play();
}

//fim de Spriter

//AJAX

function AJAX(requestType, requestPage, isAsync, inputParameters, responseManagerFunction, additionalHeaders){
	this.isSupported = true;
	try{
		this.rObj = new XMLHttpRequest();
		if(this.rObj.overrideMimeType){
			this.rObj.overrideMimeType("text/xml");
		}
	} catch (e){
		try {
			this.rObj = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				this.rObj = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){
				isSupported = false;
			}
		}
	}
	
	if(requestType) this.rType = requestType;
	if(requestPage) this.rPage = requestPage;
	if(isAsync) this.async=isAsync; else this.async = false;
	if(inputParameters != null) this.setInputParameters(inputParameters); else this.qStr = null;
	if(responseManagerFunction) this.RMF = responseManagerFunction;
	for(var header in additionalHeaders){
		this.rObj.setRequestHeader(header, additionalHeaders[header]);
	}
}

AJAX.prototype.LOADED = 4;

AJAX.prototype.setRequestType = function(requestType){
	this.rType = requestType;
}
AJAX.prototype.getRequestType = function(){
	return this.rType;
}

AJAX.prototype.setRequestPage = function(requestPage){
	this.rPage = requestPage;
}
AJAX.prototype.getRequestPage = function(){
	return this.rPage;
}

AJAX.prototype.setAsynchronus = function(isAsync){
	this.async = isAsync;
}
AJAX.prototype.isAsynchronus = function(){
	return this.async;
}

AJAX.prototype.setInputParameters = function(parametersObject){
	if(parametersObject == null){
		this.qStr = null;
	} else {
		this.qStr = "";
		this.addParameters(parametersObject);
	}
}
AJAX.prototype.addParameters = function(parametersObject){
	if(this.qStr == null){
		this.setInputParameters(parametersObject);
	} else {
		for(var p in parametersObject){
			if(this.qStr.indexOf(p) == -1){
				if(this.qStr.length > 0) this.qStr += "&";
				this.qStr+=p+"="+parametersObject[p];
			}
		}
	}
}
AJAX.prototype.getQueryString = function(){
	return this.qStr;
}

AJAX.prototype.setResponseManagerFunction = function(functionName){
	this.RMF = functionName;
}
AJAX.prototype.getResponseManagerFunction = function(){
	return this.RMF;
}

AJAX.prototype.validate = function(){
	return (this.rType != undefined && this.rPage != undefined && ((this.async && this.RMF != undefined) || (!this.async)) && ((this.rType=="POST" && this.qStr != undefined) || this.rType=="GET"));
}

AJAX.prototype.makeRequest = function(){
	if(this.validate()){
		if(this.RMF != undefined){
			this.rObj.onreadystatechange = this.RMF;
		}
		this.rObj.open(this.rType, this.rPage, this.async);
		if(this.rType == "POST"){
			this.rObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.rObj.setRequestHeader("Cache-Control", "no-store, no-cache, mustrevalidate");
			this.rObj.setRequestHeader("Pragma", "no-cache");
			this.rObj.setRequestHeader("Connection", "close");
		}
		this.rObj.send(this.qStr);
		return true;
	} else {
		return false;
	}
}

AJAX.prototype.getResponseText = function (){
	return this.rObj.responseText;
}

AJAX.prototype.getResponseXML = function (){
	return this.rObj.responseXML;
}

//fim de AJAX


//newXML
function newXML(xmlDir){
	/*var xmldom;
	try{
		xmldom = new ActiveXObject("Microsoft.XMLDOM");
		return xmldom;
	} catch(e){
		try{
			xmldom = document.implementation.createDocument("", "", null);
			xmldom.async = false;
			xmldom.load(xmlDir);
			return xmldom;
		} catch(e){
			try{
				var req = new XMLHttpRequest();
				req.open("GET", xmlDir, false);
				req.send(null);
				xmldom = req.responseXML.documentElement;
				return xmldom;
			} catch(e){
				return false;
			}
		}
	}*/
	var a = new AJAX("GET", xmlDir, false, null, null, null);
	a.makeRequest();
	return a.getResponseXML().documentElement;
}
//fim de newXML

//putSWF
function putSWF(swfDir, width, height){
	if(!rodaSWF){
		document.write("Flash player not installed. <a href=\"http://www.macromedia.com/go/getflashplayer\">Click here</a> to install.");
	} else {
		document.write('<object width="' + width + '" height="' + height + '">');
		document.write('<param name="movie" value="' + swfDir + '">');
		document.write('<param name="wmode" value="transparent">');
		document.write('<param name="quality" value="high">');
		document.write('<embed src="' + swfDir + '" wmode="transparent" width="' + width + '" height="' + height + '" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">');
		document.write('</embed>');
		document.write('</object>');
	}
}
//fim de putSWF