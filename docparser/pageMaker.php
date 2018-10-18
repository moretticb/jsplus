<?php

class pageMaker{
	
	const MODEL_DIR = './pageModels/';
	const CLASS_PAGE = 'Class.html';
	const METHOD_PAGE = 'Method.html';
	const FUNCTION_PAGE = 'Function.html';
	const VARIABLE_PAGE = 'Variable.html';
	const OUTPUT = './output/';
	
	private $outputFilename;
	private $outputContent;
	private $compatibility = array('ie'=>'Internet Explorer', 'ff'=>'Firefox', 'chr'=>'Chrome', 'saf'=>'Safari', 'op'=>'Opera');
	
	function __construct($dataStruct){
		if($dataStruct["class"] !== NULL){
			$this->outputFilename = 'cls_'.$dataStruct['class'].'.html';
			$this->outputContent = file_get_contents(self::MODEL_DIR.self::CLASS_PAGE);
			$this->makeClassPage($dataStruct);

			new pageMaker($dataStruct['constructor']);
			foreach($dataStruct['methods'] as $metodo)
				new pageMaker($metodo);
			foreach($dataStruct['events'] as $event)
				new pageMaker($event);
		} else if($dataStruct["method"] !== NULL || $dataStruct["constructor"] !== NULL || $dataStruct["function"] !== NULL || $dataStruct["event"] !== NULL){
			if($dataStruct['method'] !== NULL){
				$this->outputFilename = 'mtd_'.$dataStruct['parent'].'_'.$dataStruct['method'].'.html';
			} else if($dataStruct['event'] !== NULL){
				$this->outputFilename = 'evt_'.$dataStruct['parent'].'_'.$dataStruct['event'].'.html';
			} else if($dataStruct['function'] !== NULL){
				$this->outputFilename = 'fun_'.$dataStruct['function'].'.html';
			} else {
				$this->outputFilename = 'mtd_'.$dataStruct['constructor'].'_'.$dataStruct['constructor'].'.html';
			}
			$this->outputContent = file_get_contents(self::MODEL_DIR.self::METHOD_PAGE);
			$this->makeMethodPage($dataStruct);
		} else if($dataStruct["variable"] !== NULL){
			$this->outputFilename = 'var_'.$dataStruct['variable'].'.html';
			$this->outputContent = file_get_contents(self::MODEL_DIR.self::VARIABLE_PAGE);
			$this->makeVariablePage($dataStruct);
		}
		if(strlen($this->outputFilename) > 0){
			file_put_contents(self::OUTPUT.$this->outputFilename, $this->outputContent);
		}
	}
	
	private function makeClassPage(&$struct){
		$lists = array(array('method', 'methods', 'mtd'), array('property', 'properties', 'prop'), array('event', 'events', 'evt'));
		$find = array('<%constructPage%>', "<%className%>", "<%classDesc%>", "<%classCompat%>");
		$replace = array("mtd_$struct[class]_$struct[class].html", $struct['class'], $struct['description'], $this->getCompat($struct['compat']));
		$this->outputContent = str_replace($find, $replace, $this->outputContent);
		
		for($i=0;$i<sizeof($lists);$i++){
			if(sizeof($struct[$lists[$i][1]]) > 0){
				$this->outputContent = str_replace('<%'.$lists[$i][1].'Begin%>', '', $this->outputContent);
				$this->outputContent = str_replace('<%'.$lists[$i][1].'End%>', '', $this->outputContent);
				$itemList = '';
				foreach($struct[$lists[$i][1]] as $item){
					$itemList .= '<tr>';
					$itemList .= '<td><a href="'.$this->getLink($item).'.html">'.$item[$lists[$i][0]].'()</a></td>';
					$itemList .= '<td>'.$item['description'].'</td>';
					$itemList .= '<td>'.$this->getCompat($item['compat']).'</td>';
					$itemList .= '</tr>';
				}
				$this->outputContent = str_replace('<%'.$lists[$i][0].'List%>', $itemList, $this->outputContent);
			} else {
				$this->outputContent = $this->removeString($this->outputContent, array("<%".$lists[$i][1]."Begin%>", "<%".$lists[$i][1]."End%>"));
			}
		}
	}
	
	private function makeMethodPage(&$struct){
		$find = array('<%className%>','<%methodName%>','<%methodDesc%>','<%methodCompat%>','<%methodPrototype%>');
		$replace = array($struct['parent'],$struct['parent'].'.'.$struct['method'],$struct['description'], $this->getCompat($struct['compat']), $this->getPrototype($struct));
		
		if($struct['function'] !== NULL)
			$replace[1] = $struct['function'];
		else if($struct['event'] !== NULL)
			$replace[1] = $replace[0].'.'.$struct['event'];
		
		$returnsDelims = array('<%returnsBegin%>','<%returnsEnd%>');
		if($struct['constructor'] !== NULL){ //caso seja construtor
		$replace[0] = $struct['constructor'];
		$replace[1] = $struct['constructor'].'.'.$struct['constructor'];
			$this->outputContent = $this->removeString($this->outputContent, $returnsDelims, '');
		} else {
			if($struct['returnDesc'] !== NULL && strtolower($struct['return']) !== "void"){
				$methodReturnDesc = $struct['returnDesc'];
			} else {
				$methodReturnDesc = 'None';
			}
			array_push($find, '<%methodReturnDesc%>');
			array_push($replace, $methodReturnDesc);
			$this->outputContent = str_replace($returnsDelims, '', $this->outputContent);
		}
		
		$this->outputContent = str_replace($find, $replace, $this->outputContent);
		
		$attribDelims = array('<%parametersListBegin%>','<%parametersListEnd%>');
		if(sizeof($struct['attribs']) > 0){
			$this->outputContent = str_replace($attribDelims, '', $this->outputContent);
			$attribList = '';
			for($i=0;$i<sizeof($struct['attribs']);$i++){
				$attribList .= '<tr>';
				for($j=0;$j<sizeof($struct['attribs'][$i]);$j++){
					$attribList .= '<td>'.$struct['attribs'][$i][$j].'</td>';
				}
				$attribList .= '</tr>';
			}
			$this->outputContent = str_replace('<%parameterList%>', $attribList, $this->outputContent);
		} else {
			$this->outputContent = $this->removeString($this->outputContent, $attribDelims, '<p class="text">No parameters</p>');
		}
		
		$this->outputContent = $this->handleExamples($this->outputContent, $struct);
	}
	
	private function makeVariablePage(&$struct){
		$find = array('<%variableName%>', '<%variableDesc%>', '<%variableCompat%>');
		$replace = array($struct['variable'], $struct['description'], $this->getCompat($struct['compat']));
		
		$this->outputContent = $this->handleExamples(str_replace($find, $replace, $this->outputContent), $struct);
	}
	
	private function getCompat($compats){
		$renderedCompat = '';
		if(sizeof($compats) > 0){
			foreach($compats as $valor){
				$renderedCompat .= '<div class="'.$valor.'Logo" title="'.$this->compatibility[$valor].'"></div> ';
			}
		}
		return $renderedCompat;
	}
	
	private function getLink($item){
		if($item['method'] !== NULL){
			return 'mtd_'.$item['parent'].'_'.$item['method'];
		} else if($item['event'] !== NULL){
			return 'evt_'.$item['parent'].'_'.$item['event'];
		}
	}
	
	private function getPrototype($struct){
		$thePrototype = ($struct['method'] !== NULL ? $struct['method'] : ($struct['event'] !== NULL ? $struct['event'] : ($struct['function'] !== NULL ? $struct['function'] : $struct['constructor']))).'(';
		for($i=0;$i<sizeof($struct['attribs']);$i++){
			$thePrototype .= $struct['attribs'][$i][0].':'.$struct['attribs'][$i][1];
			if($i < sizeof($struct['attribs'])-1){
				$thePrototype .= ', ';
			}
		}
		$thePrototype .= ')';
		if($struct['return'] !== NULL){
			$thePrototype .= ':'.$struct['return'];
		}
		return $thePrototype;
	}
	
	private function removeString($text, $delims, $replaceText=''){
		return substr($text, 0, strpos($text, $delims[0])) .$replaceText. substr($text, strpos($text, $delims[1])+strlen($delims[1]));
	}
	
	private function handleExamples($text, &$struct){
		$examplesDelims = array('<%examplesBegin%>','<%examplesEnd%>');
		if($struct['exampleCode'] !== NULL || sizeof($struct['exFiles']) > 0){
			$removeDelims = $examplesDelims;
			
			$filesDelims = array('<%exampleFilesBegin%>','<%exampleFilesEnd%>');
			if(sizeof($struct['exFiles']) > 0){
				$links = '';
				for($i=0;$i<sizeof($struct['exFiles']);$i++){
					$links .= '<a href="../examples/'.$struct['exFiles'][$i].'" target="_blank" >Example '.($i+1).'</a>';
					if($i < sizeof($struct['exFiles'])-1){
						$links .= ' | ';
					}
				}
				$text = str_replace('<%exampleLinks%>', $links, $text);
				array_push($removeDelims, $filesDelims[0], $filesDelims[1]);
			} else {
				$text = $this->removeString($text, $filesDelims, '');
			}
			
			$codeDelims = array('<%exampleCodeBegin%>','<%exampleCodeEnd%>');
			if($struct['exampleCode'] !== NULL){
				$text = str_replace('<%exampleCode%>', $struct['exampleCode'], $text);
				array_push($removeDelims, $codeDelims[0], $codeDelims[1]);
			} else {
				$text = $this->removeString($text, $codeDelims, '');
			}
			
			$text = str_replace($removeDelims, '', $text);
		} else {
			$text = $this->removeString($text, $examplesDelims, '');
		}
		return $text;
	}
	
}

?>