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
function trim(str){return str.replace(/^\s+|\s+$/g,"");}

function ajusta(){
	$("indexList").style.height = (document.body.offsetHeight-$("indexList").offsetTop)+"px";
}

window.onload = function(){
	setTimeout(ajusta, 100);
	createMenu();
}
window.onresize = ajusta;

var DOCS_DIR = './pages/';

function expandCollapse(listItem){
	var realItem = listItem.parentNode;
	var expanderCollapser = realItem.getElementsByTagName("div")[0];
	var situation = expanderCollapser.className;
	var subList = realItem.getElementsByTagName("div")[2];
	if(subList){
		if(situation == "itemExpander"){
			expanderCollapser.className = "itemCollapser";
			subList.style.display = "block";
		} else if(situation == "itemCollapser"){
			expanderCollapser.className = "itemExpander";
			subList.style.display = "none";
		}
	}
}

var currentTab;
function changeTab(tab){
	if(currentTab){
		$(currentTab.attributes["tab"].value).style.display = "none";
		currentTab.className = "tabDark";
	}
	currentTab = tab;
	$(currentTab.attributes["tab"].value).style.display = "block";
	currentTab.className = "tabNormal";
}

function closeTab(tab){
	var tabContainer = tab.parentNode.parentNode.parentNode;
	var theTab = tab.parentNode.parentNode;
	theTab.style.display = "none";
	var changed = false;
	theTab.onclick = null;
	
	var adjTab = null;
	var currTabIndex = getTabIndex(theTab)
	var tabIndex = currTabIndex;
	while(tabIndex > 0 && adjTab == null){
		var tab = tabContainer.childNodes[--tabIndex];
		if(tab.style.display != 'none'){
			tabFound = true;
			adjTab = tab;
		}
	}
	if(adjTab == null){
		tabIndex = currTabIndex;
		while(tabIndex < tabContainer.childNodes.length && !tabFound){
			var tab = tabContainer.childNodes[++tabIndex];
			if(tab.style.display != 'none'){
				tabFound = true;
				adjTab = tab;
			}
		}
	}
	if(adjTab != null){
		changeTab(adjTab);
	}
	ajusta();
}

function getTabIndex(tab){
	var tabContainer = $("indexTabs");
	for(var i=0;i<tabContainer.childNodes.length;i++){
		if(tabContainer.childNodes[i] == tab){
			return i;
		}
	}
	return -1;
}

var tabNames = {cls: "Classes", fun: "Functions", vars: "Variables"};
var index;
function createMenu(){
	var divs = {cls: '<div id="cls" class="indexItemList" onmousedown="return false">', fun: '<div id="fun" class="indexItemList" onmousedown="return false">', vars: '<div id="vars" class="indexItemList" onmousedown="return false">'};
	index = newXML("docsIndex.xml");
	var entries = index.getElementsByTagName("entry");
	for(var i=0;i<entries.length;i++){
		var node = entries[i];
		try {
			var entryType = node.attributes['type'].value;
		} catch (e){
			var entryType = node.attributes[0].value;
		}
		var dataObj = new Object();
		if(entryType == "cls"){
			
			dataObj.name = node.getElementsByTagName("name")[0].childNodes[0].nodeValue;
			dataObj.methods = [];
			dataObj.methods.push(node.getElementsByTagName("constructor")[0].childNodes[1].childNodes[0].nodeValue);
			var mtds = node.getElementsByTagName("method");
			for(var j=0;j<mtds.length;j++){
				dataObj.methods.push(mtds[j].childNodes[1].childNodes[0].nodeValue);
			}
			
			divs.cls += ''; //item de lista
			divs.cls += '<div class="listItem">';
			divs.cls += '<div class="itemExpander" onclick="expandCollapse(this)"></div>';
			divs.cls += '<div class="itemIcon" onclick="expandCollapse(this)"></div>';
			divs.cls += '<a href="'+DOCS_DIR+'cls_'+dataObj.name+'.html" target="dir" onclick="expandCollapse(this)">'+dataObj.name+'</a>';
			divs.cls += '<div class="subList">'; //container da sublista
			
			for(var j=0;j<dataObj.methods.length;j++){
				divs.cls += getListDocument(dataObj.methods[j], "mtd_"+dataObj.name+"_"+dataObj.methods[j]+".html");
			}
			
			divs.cls += '</div>'; //fim de container da sublista
			divs.cls += '</div>'; //fim de item de lista
			
		} else if(entryType == "fun"){
			dataObj.name = node.getElementsByTagName("name")[0].childNodes[0].nodeValue;
			divs.fun += getListDocument(dataObj.name, 'fun_'+dataObj.name+'.html');
		} else if(entryType == "var"){
			dataObj.name = node.getElementsByTagName("name")[0].childNodes[0].nodeValue;
			divs.vars += getListDocument(dataObj.name, 'var_'+dataObj.name+'.html');
		}
	}
	divs.cls += "</div>";
	divs.fun += "</div>";
	divs.vars += "</div>";
	for(var j in divs){
		$("indexList").innerHTML += divs[j];
		insertTab(createTab(tabNames[j], j));
	}
	$("indexTabs").getElementsByTagName("div")[0].onclick();
}

function getListDocument(nome, link){
	return '<div class="listDocument"><div class="itemIcon"></div><a href="'+DOCS_DIR+link+'" target="dir">'+nome+'</a></div>';
}

function createTab(name, contentId, hasCloseBtn){
	var closeBtn = '<div class="closeTabBtn" onclick="closeTab(this)" onmousedown="this.className=\'closeTabBtnPress\'" onmousemove="this.className=\'closeTabBtn\'">x</div>';
	if(!hasCloseBtn){
		closeBtn = '';
	}
	return '<div class="tabDark" id="t'+contentId+'" onmousedown="return false" onclick="changeTab(this)" tab="'+contentId+'"><div class="left">&nbsp;</div><div class="cont">'+name+closeBtn+'</div><div class="right">&nbsp;</div></div>';
}

function insertTab(tab){
	$("indexTabs").innerHTML += tab;
	ajusta();
}

function insertContent(id, content){
	$("indexList").innerHTML += '<div id="'+id+'" class="indexItemList" onmousedown="return false">'+content+'</div>';
}

function getAttributeIndex(obj, attrib){
	var index = -1;
	for(var i=0;i<obj.attributes.length;i++){
		if(obj.attributes[i].name == attrib){
			index = i;
		}
	}
	return index;
}

var doneSearches = 0;
function doSearch(){
	var searchText = $("searchField").value;
	if(searchText.length > 2){
		doneSearches++;
		var id = 's'+doneSearches;
		var cont = 'Search results for \''+searchText+'\':<br><br>';
		
		var results = 0;
		var keywords = searchText.split(' ');
		for(var i=keywords.length-1;i>=0;i--){
			if(keywords[i].length < 3){
				keywords.splice(i,1);
			}
		}
		var foundEntries = new Array();
		for(var i=0;i<keywords.length;i++){
			var placesToFind = ["name", "description", "returnDesc"];
			for(var j=0;j<placesToFind.length;j++){
				var place = index.getElementsByTagName(placesToFind[j]);
				for(var k=0;k<place.length;k++){
					var foundValue = place[k].childNodes[0].nodeValue;
					if(foundValue.toUpperCase() == keywords[i].toUpperCase() || foundValue.toUpperCase().indexOf(keywords[i].toUpperCase()) > -1){
						var foundNode = place[k];
						var hierarchy = [foundNode];
						while(foundNode.tagName != 'entry'){
							foundNode = foundNode.parentNode;
							hierarchy.splice(0,0,foundNode);
						}

						try {
							var entryType = hierarchy[0].attributes['type'].value;
						} catch (e){
							var entryType = hierarchy[0].attributes[0].value;
						}
						
						if(entryType == 'cls'){
							
							var structToShow = null;
							var hLen = hierarchy.length;
							if(hLen == 2){ //classe
								structToShow = hierarchy[0];
							} else if(hLen == 3 || hLen == 5){ //constructor
								structToShow = hierarchy[1];
							} else if(hLen == 4 || hLen == 6){ //metodo
								structToShow = hierarchy[2];
							}
							if(structToShow != null && foundEntries.indexOf(structToShow) == -1){
								foundEntries.push(structToShow);
								var nome = structToShow.getElementsByTagName("name")[0].childNodes[0].nodeValue;
								if(hLen == 2){
									
									var listItem = '<div class="listItem">';
									listItem += '<div class="itemIcon"></div>';
									listItem += '<a href="'+DOCS_DIR+'cls_'+nome+'.html" target="dir" onclick="expandCollapse(this)">'+nome+'</a>';
									listItem += '</div>';
									
									cont += listItem;
									
								} else {
									var parent = hierarchy[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
									cont += getListDocument(parent+'.'+nome+'()', 'mtd_'+parent+'_'+nome+'.html');
								}
								results++;
							}
							
						} else if(entryType == 'fun' || entryType == 'var'){
							if(foundEntries.indexOf(hierarchy[0]) == -1){
								var nome = hierarchy[0].getElementsByTagName("name")[0].childNodes[0].nodeValue;
								cont += getListDocument(nome, entryType+'_'+nome+'.html');
								foundEntries.push(hierarchy[0]);
								results++;
							}
						}
						
					}
				}
			}
		}
		
		if(results == 0){
			cont = 'Your search for \''+searchText+'\' has no results.';
		} else {
			cont += '<div style="text-align: center; margin-top: 10px; text-indent: -20px; font-size: 12px;">'+results+' results</div>';
		}
		insertTab(createTab("Search #"+doneSearches, id, true));
		insertContent(id, cont);
		changeTab($('t'+id));
		fixTabs();
	} else {
		alert("Invalid search text. Try again.");
	}
}

function fixTabs(){
	var tabContainer = $("indexTabs");
	for(var i=0;i<tabContainer.childNodes.length;i++){
		if(tabContainer.childNodes[i].tagName == 'DIV'){
			if(tabContainer.childNodes[i] != currentTab){
				tabContainer.childNodes[i].className = 'tabDark';
			}
		}
	}
}