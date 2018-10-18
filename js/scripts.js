var containerHeight;
var firstLoad = 1;
var loaded = false;

function getCurrentAlpha(objId){
	var currentAlpha = getStyleFromObject(objId, "opacity");
	return parseFloat(currentAlpha.substring(0, currentAlpha.indexOf(".")+2));
}

if(!Array.prototype.indexOf){
	Array.prototype.indexOf = function(obj, start){
		for(var i=(start?start:0);i<this.length;i++){
			if(this[i]==obj){
				return i;
			}
		}
		return -1;
	}
}

function calcPorcContent(){
	var tol = 10;
	var topHeight = 86+tol;
	var bottomHeight = 61+tol;
	if(window.innerHeight != undefined){
		var total = window.innerHeight;
	} else {
		var total = document.documentElement.clientHeight;
	}
	var porcTop = Math.round((topHeight*100)/total);
	var porcBottom = Math.round((bottomHeight*100)/total);
	var porcContent = 100-(porcTop+porcBottom);
	return porcContent;
}

var resizing = 0;
function fixContentArea(useTween){
	$("parentDivContainer").style.height = calcPorcContent()+"%";
	containerHeight = $("parentDivContainer").offsetHeight-50;
	if(useTween && (!resizing || window.navigator.appName.toLowerCase().indexOf("microsoft")<0)){
		resizing=1;
		var sizeFix = new Tween("theContentDiv", "height", Quad.prototype.easeOut, $("theContentDiv").offsetHeight, containerHeight, 15, false);
		sizeFix.onMotionFinished = function(){
			resizing = 0;
		}
	} else {
		$("theContentDiv").style.height = containerHeight+"px";
	}
}

var pageToLoad = 0;
function pageLoadHandler(){
	var ancPos = window.location.toString().indexOf("#/");
	if(ancPos > -1 && !loaded){
		var theAnchor = window.location.toString().substr(ancPos+2);
		pageToLoad = paginas.indexOf(theAnchor);
	}
	carregaPagina(pageToLoad);
}

window.onhashchange = pageLoadHandler;

window.onload = function(){
	
	fixContentArea();
	$("theContentDiv").style.height = "0px";
	$("divContainerConteudo").style.top = (containerHeight/2)+"px";
	
	$("theLogo").onmouseover = function(){
		new Tween(this.id, "opacity", Quad.prototype.easeInOut, getCurrentAlpha(this.id), 1, 7, false);
	}
	
	$("theLogo").onmouseout = function(){
		new Tween(this.id, "opacity", Quad.prototype.easeInOut, getCurrentAlpha(this.id), 0, 7, false);
	}
	
	pageLoadHandler();
	criaLightBox();
}

window.onresize = function(){
	fixContentArea(true);
}

var paginas = ["home", "download", "documentation", "tutorials", "bugreport", "about"];
var currPage=-1;

function putContent(){
	if(this.readyState==4){
		if(this.status == 200){
			var response = this.responseText;
			$("theContentDiv").innerHTML = response;
			runScriptsFromString(response);
		} else {
			$("theContentDiv").innerHTML = "";
		}
		abre();
	}
}

var isInActivity = 0;

function carregaPagina(pageNum){
	if(!isInActivity && pageNum != currPage){
		loaded = false;
		isInActivity = 1;
		var container = $("theContentDiv");
		container.style.overflow = "hidden";
		var close = new Tween(container.id, "height", Quad.prototype.easeInOut, container.offsetHeight, 1, 15, false);
		if(firstLoad == 0){
			new Tween("divContainerConteudo", "top", Quad.prototype.easeInOut, 0, containerHeight/2, 15, false, {position: "relative"});
		} else {
			firstLoad = 0;
		}
		close.onMotionFinished = function(){
			isInActivity = 0;
			loaded = true;
			if(pageToLoad != pageNum) pageNum = pageToLoad;
			//var ajax = new AJAX("POST", paginas[pageNum]+".php", true, {spg: 1}, putContent);
			var ajax = new AJAX("GET", paginas[pageNum]+".html", true, null, putContent);
			ajax.makeRequest();
		}
	}
}

function abre(){
	if(!isInActivity){
		isInActivity = 1;
		var container = $("theContentDiv");
		var open = new Tween("theContentDiv", "height", Quad.prototype.easeInOut, container.offsetHeight, containerHeight, 15, false);
		new Tween("divContainerConteudo", "top", Quad.prototype.easeInOut, containerHeight/2, 0, 15, false, {position: "relative"});
		open.onMotionFinished = function(){
			container.style.overflow = "auto";
			isInActivity = 0;
			loaded = false;
			if(window.location.hash.indexOf(paginas[currPage]) == -1){
				window.location.hash = "#/"+paginas[currPage];
			}
		}
	}
}

function runScriptsFromString(str){
	var fromIndex = 0;
	var theScript = "";
	do {
		var openTagIndex = str.indexOf("<script>", fromIndex);
		if(openTagIndex > -1){
			var closeTagIndex = str.indexOf("</script>", openTagIndex);
			theScript = str.substring(str.indexOf("<script>", fromIndex)+8, closeTagIndex);
			fromIndex = closeTagIndex;
			try{
				eval(theScript);
			} catch (e){ }
		} else {
			fromIndex = openTagIndex;
		}
	} while (fromIndex > -1);
}

function putJSGame(containerElement){
	containerElement.onclick = null;
	containerElement.className = "realGameAreaNoHover";
	containerElement.innerHTML = '<iframe width="350px" height="200px" frameborder="0" scrolling="no" src="game/jsgame/game.html"></iframe>';
}

function putFlashGame(containerElement){
	containerElement.onclick = null;
	containerElement.className = "realGameAreaNoHover";
	containerElement.innerHTML = SWFObject("game/game.swf", 350, 200);
}


// pagina tutorials
function showHideDescription(elem){
	if(!elem.shown){
		elem.shown = true;
		new Tween(elem.id, 'opacity', Quad.prototype.easeInOut, 0, 1, 8, false);
	} else {
		elem.shown = false;
		new Tween(elem.id, 'opacity', Quad.prototype.easeInOut, getStyleFromObject(elem.id, 'opacity'), 0, 7, false);
	}
}

function limpaThumbsArea(){
	$("thumbsArea").innerHTML = "";
}

var PREV_PAGE = 0;
var NEXT_PAGE = 1;
var DEST_OUT = 0;
var DEST_IN = 1;
function pageAnimation(animType, destination){
	var divs = $("thumbsArea").getElementsByTagName("DIV");
	var finalPos = animType == NEXT_PAGE ? -50 : 50;
	var initialPos = 0;
	if(destination == DEST_IN){
		var temp = finalPos;
		finalPos = initialPos;
		initialPos = finalPos+(temp*-1);
	}
	var anima = null;
	for(var i=0;i<divs.length;i++){
		if(divs[i].id.indexOf("thumb") == 0){
			new Tween(divs[i].id, "left", Quad.prototype.easeInOut, initialPos, finalPos, 10, false, {position: "relative"});
			anima = new Tween(divs[i].id, "opacity", Quad.prototype.easeInOut, (destination+1)%2, destination%2, 10, false);
		}
	}
	if(anima != null){
		anima.onMotionFinished = function(){
			if(destination != DEST_IN) putLoaderIntoThumbArea();
			//colocaItens();
		}
	}
}

var tipos = ["Video", "Document"];
function colocaItens(){
	var thumbs = "";
	for(var i=0;i<10;i++){
		thumbs += makeItem(i, 'images/imgTeste.jpg', 'Tutorial # '+i, '01/01/2001', 'Description of the '+i+'<sup>th</sup> tutorial.', 0, 'http://www.site'+i+'.com');
	}
	$("thumbsArea").innerHTML = thumbs;
}

function makeItem(id, img, titulo, data, descricao, tipo, link){
	var theItem = '<div id="thumb'+id+'" class="tThumb"><img src="'+img+'" /><div class="tFx"></div><div id="t'+id+'" class="tHover" onmouseover="showHideDescription(this)" onmouseout="showHideDescription(this)" onclick="carregaConteudo(\''+id+'\', \''+img+'\', \''+titulo+'\', \''+data+'\',  \''+descricao+'\', '+tipo+', \''+link+'\')">';
	theItem += '<div class="tHoverMsg">'+titulo+'</div>';
	theItem += '</div></div>';
	return theItem;
}

var spriteSize = 44;
function putLoaderIntoThumbArea(){
	$("lA").className = 'leftArrowDisabled';
	$("rA").className = 'rightArrowDisabled';
	var dims = [$("thumbsArea").offsetWidth, $("thumbsArea").offsetHeight];
	$("thumbsArea").innerHTML = '<div id="loader" style="display: inline-block; margin-top: '+(dims[1]/2-spriteSize/2)+'px; margin-left: '+(dims[1]/2+spriteSize/2)+'px"></div>';
	new Spriter("loader", spriteSize, spriteSize, "images/loader_black.png", 5, 60, -1, 0); //quadros a mais apenas para demorar a repetir
}

function updatePages(total, current){
	var dots = "";
	for(var i=1;i<=total;i++){
		dots += '<div class="'+(i==current ? "pageDotChecked" : "pageDot")+'" title="'+i+'"></div> ';
	}
	$("bottomArea").innerHTML = dots;
}

function isArrowDisabled(elem){
	return elem.getElementsByTagName("div")[0].className.toLowerCase().indexOf("disabled") > -1;
}

var LEFT_ARROW = 0;
var RIGHT_ARROW = 1;
var EVT_ROLLOVER = 0;
var EVT_ROLLOUT = 1;
function arrowEvent(arrow, eventType){
	var arrowsIds = ['lA', 'rA'];
	var behaviorObj = $(arrowsIds[arrow]).parentNode;
	var distancia = behaviorObj.offsetWidth - $(arrowsIds[arrow]).offsetWidth;
	if(!isArrowDisabled(behaviorObj)){
		var obj = new Object();
		if(arrow == LEFT_ARROW){
			obj.currPos = $(arrowsIds[arrow]).offsetLeft-behaviorObj.offsetLeft-distancia;
		} else {
			obj.currPos = $(arrowsIds[arrow]).offsetLeft-behaviorObj.offsetLeft;
		}
		if(eventType == EVT_ROLLOVER){
			obj.destPos = arrow == LEFT_ARROW ? -distancia : distancia;
		} else {
			obj.destPos = 0;
		}
		new Tween(arrowsIds[arrow], "left", Quad.prototype.easeInOut, obj.currPos, obj.destPos, 5, false, {position: "relative"});
	}
}

function showHideLoaderBox(show){
	var mostra = new Tween("loaderBox", "opacity", Quad.prototype.easeInOut, getStyleFromObject($("loaderBox"), "opacity"), show, 10, false, {display: "inline-block"});
	mostra.onMotionFinished = function(){
		if(!show){
			$("loaderBox").style.display = "none";
			if(functionTodo) functionTodo();
		}
	}
}

function showHideNothingSelectedBox(show, functionTodo){
	var pos;
	if(show) pos = [-50, 0]; else pos = [0, -50];
	new Tween("nothingSelected", "opacity", Quad.prototype.easeInOut, !show, show, 10, false, {display: "inline-block"});
	var mostra = new Tween("nothingSelected", "left", Quad.prototype.easeInOut, pos[0], pos[1], 10, false, {position: "relative"});
	mostra.onMotionFinished = function(){
		if(!show) $("nothingSelected").style.display = "none";
		if(functionTodo) functionTodo();
	}
}

function showHidePreviewBox(show, functionTodo){
	var pos;
	if(show) pos = [50, 0]; else pos = [0, 50];
	new Tween("previewBox", "opacity", Quad.prototype.easeInOut, !show, show, 10, false, {opacity: show?0:1, display: "inline-block"});
	var mostra = new Tween("previewBox", "left", Quad.prototype.easeInOut, pos[0], pos[1], 10, false, {position: "relative"});
	mostra.onMotionFinished = function(){
		if(!show) $("previewBox").style.display = "none";
		if(functionTodo) functionTodo();
	}
}

function carregaConteudo(id, img, titulo, data, descricao, tipo, link){
	if($("nothingSelected").style.display == '' || $("nothingSelected").style.display != 'none'){
		showHideNothingSelectedBox(0, function(){
			if($("previewBox").style.display != 'inline-block') showHidePreviewBox(1);
		});
	}
	$("lblTitulo").innerHTML = titulo;
	$("lblData").innerHTML = data;
	$("lblTipo").innerHTML = tipos[tipo];
	$("lblDescricao").innerHTML = descricao;
	$("showTutorialButton").onclick = $("showTutorialButton").getElementsByTagName("div")[0].onclick = function(){
		openLightBox(TIPO_HTML, "<div style=\"width: 700px; min-height: 100px;  text-align: center;\"><h1>"+titulo+"</h1><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/JK83bIGZ_-4\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe></div>");
	}
}

function fechaPreviewBox(){
	showHidePreviewBox(0, function(){
		showHideNothingSelectedBox(1);
	});
}

function showHideLightBoxBG(show, funcTodo){
	if($("lightBoxDiv") != null){
		var lbAnima = new Tween("lightBoxDiv", "opacity", Quad.prototype.easeInOut, !show, show, 5, false, {opacity: show?0:1, display: "inline-block"});
		lbAnima.onMotionFinished = function(){
			if(!show) $("lightBoxDiv").style.display = 'none';
			if(funcTodo) funcTodo();
		}
	}
}

function criaLightBox(){
	var elem = document.createElement("div");
	elem.setAttribute("id", "lightBoxDiv");
	elem.setAttribute("style", "display: none; background-image: url('images/alphaBlack.png'); overflow: hidden; position: absolute; top: 0px; left: 0px; z-index: "+getNextHighestZindex()+"; width: 100%; height: 100%; min-width: "+$("divMae").offsetWidth+"px");
	elem.setAttribute("onclick", "closeLightBox(); canClose = true;");
	document.body.appendChild(elem);
	var box = '<div id="wholeBox" onclick="canClose = false;" style="visibility: hidden; z-index: '+getNextHighestZindex()+'; position: absolute; top: 50%; left: 50%; text-align: right;">';
	box += '<div class="lightBoxCloseBtn" onclick="canClose = true; closeLightBox();"></div>';
	box += '<table class="slicedBox" cellspacing="0">';
	box += '<tr><td class="slice1">&nbsp;</td><td class="slice2">&nbsp;</td><td class="slice3"></td></tr>';
	box += '<tr><td class="slice4">&nbsp;</td><td class="slice5">';
	box += '<div id="lightBoxContent" style="text-align: left !important;">content</div>';
	box += '</td><td class="slice6">&nbsp;</td></tr>';
	box += '<tr><td class="slice7">&nbsp;</td><td class="slice8">&nbsp;</td><td class="slice9">&nbsp;</td></tr>';
	box += '</table></div>';
	elem.innerHTML = box;
}

var TIPO_VIDEO = 0;
var TIPO_LINK = 1;
var TIPO_HTML = 2;
function openLightBox(tipo, cont){
	showHideLightBoxBG(1, function(){
		if(tipo == TIPO_VIDEO){
			$("lightBoxContent").innerHTML = '<iframe frameborder="0" src="http://www.youtube.com/embed/'+cont+'" style="width: 700px; height: 400px;"></iframe>';
		} else if(tipo == TIPO_LINK){
			$("lightBoxContent").innerHTML = '<iframe frameborder="0" src="'+cont+'" style="width: 640px; height: 480px;"></iframe>';
		} else if(tipo == TIPO_HTML){
			$("lightBoxContent").innerHTML = cont;
		}
		var tam = [$("lightBoxContent").offsetWidth, $("lightBoxContent").offsetHeight];
		openBox(tam);
	});
}

var canClose = true;
function closeLightBox(){
	if(canClose){
		var fecha = new Tween("wholeBox", "opacity", Quad.prototype.easeOut, 1, 0, 5, false);
		fecha.onMotionFinished = function(){
			$("lightBoxContent").innerHTML = '';
			$("lightBoxContent").style.overflow = 'visible';
			$("lightBoxContent").style.width = 'auto';
			$("lightBoxContent").style.height = 'auto';
			$("wholeBox").style.marginTop = '0px';
			$("wholeBox").style.marginLeft = '0px';
			$("wholeBox").style.visibility = 'hidden';
			showHideLightBoxBG(0);
		}
	}
}

function openBox(dims){
	new Tween("wholeBox", "marginTop", Quad.prototype.easeOut, 0, dims[1]/2*-1, 15, false, {opacity: 0, visibility: 'visible'});
	new Tween("wholeBox", "marginLeft", Quad.prototype.easeOut, 0, dims[0]/2*-1, 15, false);
	new Tween("lightBoxContent", "width", Quad.prototype.easeOut, 0, dims[0], 15, false, {overflow: "hidden"});
	new Tween("lightBoxContent", "height", Quad.prototype.easeOut, 0, dims[1], 15, false);
	new Tween("wholeBox", "opacity", Quad.prototype.easeOut, 0, 1, 5, false);
}


function validaEmail(email){
	var posArroba = email.indexOf("@");
	var posPto = email.indexOf(".", posArroba);
	var lugarEnd = posPto - posArroba;
	var dpsPto = email.substr(posPto+1).length;
	return !(posArroba < 3 || posPto <= posArroba || lugarEnd < 4 || dpsPto < 2)
}
