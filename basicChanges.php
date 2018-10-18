<script>
	document.title = "JS+ Library - <?php echo $pageName; ?>";
	var links = $("divBtns").getElementsByTagName("a");
	if(currPage > -1){
		links[currPage].className = links[currPage].className.split("Sel").join("");
	}
	links[<?php echo $pageNum; ?>].className = links[<?php echo $pageNum; ?>].className+"Sel";
	currPage = <?php echo $pageNum; ?>;
</script>