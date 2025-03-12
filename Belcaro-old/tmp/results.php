<?php

/* obtain AJAX variables */
$search_key = (isset($_POST["s"])) ? strtolower($_POST["s"]) : "";
if ($search_key=="") exit;
$search_limit = (isset($_POST["l"])) ? $_POST["l"] : 10;

/* local sample data - should probably be a better idea to fetch these from a DB */
$demo_data = array(
	array( "type" => "page", "title" => "Welcome", "link" => "welcome.html", "date" => "2013/11/13" ),
	array( "type" => "page", "title" => "Welcome video", "link" => "welcome-video.html", "date" => "2013/11/13" ),
	array( "type" => "page", "title" => "Home", "link" => "index.html", "date" => "2013/11/12" ),
	array( "type" => "page", "title" => "Our services", "link" => "index.html#services", "date" => "2013/11/12" ),
	array( "type" => "page", "title" => "Our team", "link" => "index.html#team", "date" => "2013/11/12" ),
	array( "id" => 2, "type" => "page", "title" => "Portfolio", "link" => "portfolio.html", "date" => "2013/11/09" ),
	array( "type" => "page", "title" => "Journal", "link" => "journal.html", "date" => "2013/11/09" ),
	array( "type" => "page", "title" => "Shop", "link" => "shop.html", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Shopping Bag", "link" => "shopping-bag.html", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Product", "link" => "shopping-product.html", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Features", "link" => "features.html", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Alert boxes", "link" => "features.html", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Collapse boxes", "link" => "features.html", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Tab container", "link" => "features.html#tabs", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "HTML5 audio player", "link" => "features.html#audio-players", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Call to action", "link" => "features.html#call-to-action", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Form elements", "link" => "features.html#form-elements", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Grid layout", "link" => "features.html#grid-layout", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Typography", "link" => "features.html#typography", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Contact", "link" => "contact.html", "date" => "2013/11/08" ),
	array( "type" => "page", "title" => "Email", "link" => "contact.html#extra", "date" => "2013/11/08" ),
	array( "type" => "portfolio-item", "title" => "Portfolio item", "link" => "portfolio-item.html", "date" => "2013/11/07" ),
	array( "type" => "post", "title" => "Single post", "link" => "single.html", "date" => "2013/11/07" ),
);
function highlightkeyword($str, $search) {
	$occurrences = substr_count(strtolower($str), strtolower($search));
	$newstring = $str;
	$match = array();
	for ($i=0;$i<$occurrences;$i++) {
		$match[$i] = stripos($str, $search, $i);
		$match[$i] = substr($str, $match[$i], strlen($search));
		$newstring = str_replace($match[$i], '[[#]]'.$match[$i].'[[@]]', strip_tags($newstring));
	}
	$newstring = str_replace('[[#]]', '<strong>', $newstring);
	$newstring = str_replace('[[@]]', '</strong>', $newstring);
	return $newstring;
}

$results_count = 0;
foreach ($demo_data as $demo_item) {
	// fuzzy search
	//if (strlen($search_key) - similar_text(strtolower($demo_item["title"]), $search_key) == 0) {
	// regular strpos search to speed things up a little
	if (stripos($demo_item["title"],$search_key) !== false) {
		echo '<li class="result"><a href="' . $demo_item["link"] .'">' . highlightkeyword($demo_item["title"],$search_key) . '</a></li>';
		$results_count++;
		if ($results_count >= $search_limit) {
			echo '<li class="result view-all"><a href="index.html">All results</a></li>';
			exit;
		}
	}
}
if ($results_count == 0) echo "<li><a>No results where found</a></li>";