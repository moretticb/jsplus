<?php

require_once("pageMaker.php");

class parser {
	
	const INIT = '/*';
	const END = '*/';
	const INDENT = '    ';
	const ROOT_DEPTH = 3;
	private $xml;
	private $arq;
	private $types;
	private $docs;
	private $shortTypes;
	
	private $lastTag;
	
	private $indentLevel = 0;
	
	function __construct($codeFile){
		//header("Content-Type: text/xml");
		header("Content-Type: text/plain");
		$this->arq = file_get_contents($codeFile);
		$this->xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<jsplusDocumentation>";
		$this->types = array(
			"class" => 0,
			"method" => 1,
			"event" => 2,
			"variable" => 3,
			"function" => 4
		);
		$this->docs = array();
		foreach ($this->types as $valor){
			$this->docs[$valor] = array();
		}
		$this->shortTypes = array('class'=>'cls', 'variable'=>'var', 'function'=>'fun', 'compat'=>'compatibility', 'methods'=>'methods', 'attribs'=>'attributes', 'exFiles'=>'exampleFiles', 'events'=>'events');
		
		$this->parseFile();
		$this->makeXML($this->docs, $xml);
		$this->xml .= "</jsplusDocumentation>";
		echo $this->xml;
	}
	
	private function parseFile(){
		$offset = 0;
		while($offset !== false){
			$tempOffset = strpos($this->arq, strval(self::INIT), $offset);
			$offset = strpos($this->arq, strval(self::END), $offset);
			if($offset !== false){
				$offset += strlen(self::END);
				$this->parseBlock(substr($this->arq, $tempOffset, $offset-$tempOffset));
			}
		}
	}
	
	private function parseBlock($str){
		$params = array();
		$offset = 0;
		$attribs = array();
		while($offset !== false){
			$offset = strpos($str, "@", $offset);
			if($offset !== false){
				$offset++;
				$contentPos = strpos($str, ' ', $offset);
				$param = substr($str, $offset, $contentPos-$offset);
				$nextAt = strpos($str, "@", $offset);
				if($nextAt === false){
					$nextAt = strpos($str, self::END, $offset);
				}
				$content = substr($str, $contentPos+1, $nextAt-$contentPos-1);
				$content = trim(str_replace("*", "", $content));
				$offset = $contentPos;
				if($param == "param"){
					array_push($attribs, $this->parseAttribute($content));
				} else {
					$params[$param] = $content;
				}
			}
		}
		if(sizeof($attribs) > 0) $params["attribs"] = $attribs;
		$dType = $this->getDocType($params);
		$this->adjustParams($params);
		if($dType == $this->types["class"]){
			$params["constructor"] = $this->makeConstructor($params);
			$params["methods"] = array();
			$params["events"] = array();
			$params["attribs"] = NULL;
			array_push($this->docs[$this->getDocIndexByType("class")], $params);
		} else if($dType == $this->types["method"]){
			array_push($this->docs[$this->getDocIndexByType("class")][$this->getClassIndexByName($params["parent"])]["methods"], $params);
		} else if($dType == $this->types["event"]){
			array_push($this->docs[$this->getDocIndexByType("class")][$this->getClassIndexByName($params["parent"])]["events"], $params);
		} else if($dType == $this->types["variable"]){
			array_push($this->docs[$this->getDocIndexByType("variable")], $params);
		} else if($dType == $this->types["function"]){
			array_push($this->docs[$this->getDocIndexByType("function")], $params);
		}
	}
	
	private function linkPages($text){
		$find = array(
			"((\{)(http://)([a-zA-Z0-9_\-\/\.]+) ([a-zA-Z0-9_\-. ]+)(\}))",
			"((\{lib://)([a-z]+)(/)([a-zA-Z0-9]+)([/]*)([a-zA-Z0-9]*)([/]*) ([a-zA-Z0-9_ ]+)(\}))",
			"(_\.html)"
		);
		$replace = array(
			"<a href=\"$2$3\">$4</a>",
			"<a href=\"$2_$4_$6.html\">$8</a>",
			".html"
		);
		return preg_replace($find, $replace, $text);
	}
	
	private function parseAttribute($attr){
		$parts = array();
		$colonPos = strpos($attr, ":");
		$spacePos = strpos($attr, " ");
		array_push($parts, substr($attr, 0, $colonPos));
		array_push($parts, substr($attr, $colonPos+1, $spacePos-$colonPos-1));
		array_push($parts, $this->linkPages(substr($attr, $spacePos+1)));
		return $parts;
	}
	
	private function adjustParams(&$params){
		foreach($params as $label=>$valor){
			if($label == "see" || $label == "description" || $label == "returnDesc"){
				$params[$label] = $this->linkPages($valor);
			} else if($label == "compat" || $label == 'exFiles'){
				$params[$label] = explode(",", $params[$label]);
			}
		}
	}
	
	private function makeConstructor($params){
		$construct = array(
			"constructor" => $params["class"],
			"since" => $params["since"],
			"compat" => $params["compat"],
			"description" => $params["description"],
			"attribs" => $params["attribs"],
			"exampleCode" => $params["exampleCode"],
			"see" => $params["see"],
			"exFiles" => $params["exFiles"]
		);
		return $construct;
	}
	
	private function getDocIndexByType($type){
		return $this->types[$type];
	}
	
	private function getDocType($params){
		foreach($this->types as $label=>$valor){
			if($params[$label] !== NULL){
				return $valor;
			}
		}
		return -1;
	}
	
	private function getClassIndexByName($className){
		for($i=0;$i<sizeof($this->docs[$this->getDocIndexByType("class")]);$i++){
			$classe = $this->docs[$this->getDocIndexByType("class")][$i];
			if($classe["class"] !== NULL && $classe["class"] == $className){
				return $i;
			}
		}
	}
	
	private function getMethodsByClassName($className){
		return $this->docs[$this->getDocIndexByType("class")][$this->getClassIndexByName($className)]["methods"];
	}
	
	private function makeXML($structure, &$output){
		$closeTags = array();
		$subCloseTags = array();
		$this->indentLevel += 1;
		foreach($structure as $label=>$valor){
			if($valor !== NULL){
				if(gettype($label) === "string"){
					$this->lastTag = $label;
				}
				if(gettype($valor) == "array"){
					if($label === "compat" || $label === "methods" || $label === "events" || $label === "attribs" || $label === "exFiles"){
						$this->xml .=  str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH);
						$this->xml .=  '<'.$this->shortTypes[$label].">\r\n";
						$subCloseTags[$label] = str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH).'</'.$this->shortTypes[$label].">\r\n";
					}
					$this->makeXML($valor, $output);
					if($subCloseTags[$label] !== NULL){
						$this->xml .=  $subCloseTags[$label];
					}
				} else {
					$this->xml .=  str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH);
					if($label === "class" || $label === "variable" || $label === "function"){
						new pageMaker($structure);
						$this->indentLevel=self::ROOT_DEPTH;
						$this->xml .=  "\r\n<entry type=\"".$this->shortTypes[$label]."\">\r\n";
						array_push($closeTags, str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH)."</entry>\r\n");
						$this->indentLevel += 1;
						$this->xml .=  str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH)."<name>$valor</name>\r\n";
					} else if($label === "since"){
						$this->xml .=  "<since>$valor</since>\r\n";
					} else if($label === "parent"){
						$this->xml .=  "<parent>$valor</parent>\r\n";
					} else if($label === "return"){
						$this->xml .=  "<return>$valor</return>\r\n";
					} else if($label === "returnDesc"){
						$this->xml .=  "<returnDesc>$valor</returnDesc>\r\n";
					} else if($label === "description"){
						$this->xml .=  "<description>$valor</description>\r\n";
					} else if($label === "see"){
						$this->xml .=  "<see>$valor</see>\r\n";
					} else if($label === "constructor"){
						$this->xml .=  "<constructor>\r\n";
						array_push($closeTags, str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH)."</constructor>\r\n");
						$this->indentLevel += 1;
						$this->xml .=  str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH)."<name>$valor</name>\r\n";
					} else if($label === "method" || $label === "event"){
						$this->xml .=  "<$label>\r\n";
						array_push($closeTags, str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH)."</$label>\r\n");
						$this->indentLevel += 1;
						$this->xml .=  str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH)."<name>$valor</name>\r\n";
					} else if($label === "exampleCode"){
						$this->xml .=  "<exampleCode><![CDATA[$valor]]></exampleCode>\r\n";
					} else {
						if($this->lastTag == "compat"){
							$this->xml .=  "<compatItem>$valor</compatItem>\r\n";
						} else if($this->lastTag == "attribs" && gettype($label) == "integer"){
							if(intval($label) == 0){
								$this->xml .=  "<attribute>\r\n";
								$this->indentLevel++;
								$this->xml .=  str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH)."<name>$valor</name>\r\n";
							} else if(intval($label) == 1){
								$this->xml .=  "<type>$valor</type>\r\n";
							} else if(intval($label) == 2){
								$this->xml .=  "<description>$valor</description>\r\n";
								$this->indentLevel--;
								$this->xml .=  str_repeat(self::INDENT, $this->indentLevel-self::ROOT_DEPTH)."</attribute>\r\n";
							}
						} else if($this->lastTag == "exFiles"){
							$this->xml .= "<file>$valor</file>\r\n";
						}
					}
				}
			}
		}
		for($i=0;$i<sizeof($closeTags);$i++){
			$this->xml .=  array_pop($closeTags);
		}
		$this->indentLevel -= 1;
	}

}

?>