Controller.neu =(function() {
	var that = {},
	$medium = null,
	$pageCounter = 0,

	// Page Measurements
	$dpi = null,
	$paperType = null,
	$pageHeight = null,
	$pageWidth = null,
	$columnCount = null,
	$columnWidth = null,
	$columnGap = null,

	// First Page Layout
	$firstElement = null,
	$numberOfAuthors = null,
	$numberOfAuthorsLeft = null,
	$numberOfAuthorsRight = null,

	// Content related variable
	$allPageElements = null,
	$doms = [],

	init = function(medium) {
		p("init");
		
		$medium = medium;
		calcDPI();
		determinePaperType();
		setupPageMeasurements();
		getFirstPageElement();

		createFirstPage();
		createContentPages();
	},

	calcDPI = function() {
		p("calcDPI");

		var testDiv = document.createElement("div");
		document.body.appendChild(testDiv);
		testDiv.style.height = "1in";
		testDiv.style.width = "1in";
		var dpiString = document.defaultView.getComputedStyle(testDiv, null).height;
		dpiString = dpiString.substring(0, (dpiString.length -2));
		$dpi = parseInt(dpiString, 10);
		document.body.removeChild(testDiv);
	},

	determinePaperType = function() {
		p("determinePaperType");
		
		var url = document.styleSheets[0].href;
		var start = url.search("css");
		var stop = url.search("_stylesheet");
		$paperType = url.substring(start + 4, stop);
	},

	setupPageMeasurements = function() {
		p("setupPageMeasurements");

		switch ($paperType) {
			case ("chi_extended"):
				$pageHeight = 8.5 * $dpi;
				$pageWidth = 11 * $dpi;
				$columnCount = 2;
				$columnWidth = 3.34 * $dpi;
				$columnGap = 0.5 * $dpi;
				break;
		}
	},

	getFirstPageElement = function() {
		p("getFirstPageElement");

		switch ($paperType) {
			case("chi_extended"):
				$firstElement = $("#authors");
				$numberOfAuthors = $("#authors").children().children().length;
				$numberOfAuthorsLeft = Math.ceil($numberOfAuthors / 2);
				$numberOfAuthorsRight = $numberOfAuthors - $numberOfAuthorsLeft;
				break;
		}
	},

	createFirstPage = function() {
		p("createFirstPage");

		switch($paperType) {
			case ("chi_extended"):

				// Create first page wrapper
				var firstPage = document.createElement("div");
				$(firstPage).addClass("page");
				$(firstPage).attr("id", "firstPage");
				$(firstPage).height("1px");
				$(firstPage).attr("style", "max-height: " + $pageHeight + "px");

				// Create new wrappers for first page contents
				var headline = document.createElement("div");
				$(headline).attr("id", "headline");

				var fpSidebar = document.createElement("div");
				$(fpSidebar).attr("id", "fpSidebar");

				var fpLeft = document.createElement("div");
				$(fpLeft).attr("id", "fpColLeft");

				var fpRight = document.createElement("div");
				$(fpRight).attr("id", "fpColRight");

				// Append to the page
				$('body').append(firstPage);
				$(firstPage).append(headline);
				$(firstPage).append(fpSidebar);
				$(firstPage).append(fpLeft);
				$(firstPage).append(fpRight);

				// Fill in first page contents
				fillHeadline();
				fillAuthors();
				fillCopyright();
				fillAbstract();
				fillAuthorKeywords();
				fillACMKeywords();

				// Set height of first page dynamically
				var firstPageHeight = $("#headline").height() + $("#authors-left").height() + $("#copyright").height();
				$(firstPage).height("" + firstPageHeight + "px");

			break;
		}

		var hr = document.createElement("hr");
		$(hr).insertAfter($("#firstPage"));
	},

	createNewPage = function(counter) {
		p("createNewPage");
		var result = null;

		switch($paperType) {
			case ("chi_extended"):
			
				// Whole page
				var newPage = document.createElement("div");
				$(newPage).attr("class", "page");
				$(newPage).attr("id", "page-" + counter)
				$(newPage).height($pageHeight);

				// Sidebar
				var newSidebar = document.createElement("div");
				$(newSidebar).attr("class", "sidebar");
				$(newSidebar).attr("id", "sidebar-" + counter);
				$(newPage).append(newSidebar);

				// Left Column
				var newColumnLeft = document.createElement("div");
				$(newColumnLeft).attr("class", "pageCol");
				$(newColumnLeft).attr("id", "pageColLeft-" + counter);
				$(newPage).append(newColumnLeft);

				// Right Column
				var newColumnRight = document.createElement("div");
				$(newColumnRight).attr("class", "pageCol");
				$(newColumnRight).attr("id", "pageColRight-" + counter);
				$(newPage).append(newColumnRight);

				result = newPage;
			break;
		}

		return result;
	},

	fillHeadline = function() {
		p("fillHeadline");

		var headline = document.getElementsByTagName("h1")[0];
		$("#headline").append(headline);
	},

	fillAuthors = function() {
		p("fill authors");

		// Semantic wrapper for authors
		var semanticWrapper = document.createElement("section");
		$(semanticWrapper).attr("id", "authors-wrapper");
		$("#fpColLeft").append(semanticWrapper);

		// Div for all authors
		var container = document.createElement("footer");
		$(container).attr("id", "authors-all");
		$("#authors-wrapper").append(container);

		// Left authors
		var left = document.createElement("div");
		$(left).attr("id", "authors-left");
		$("#authors-all").append(left);

		p("dd" + $numberOfAuthorsLeft);
		for (var i = 0; i < $numberOfAuthorsLeft; i++) {
			$("#authors-left").append($($firstElement).children().first().children().first());
		}

		// Right authors
		var right = document.createElement("div");
		$(right).attr("id", "authors-right");
		$("#authors-all").append(right);

		while($firstElement.children()[0].children.length > 0) {
			$("#authors-right").append($firstElement.children()[0].children[0]);
		}

		// Match height of left and right author divs
		if ($numberOfAuthorsLeft > $numberOfAuthorsRight) {
			$("#authors-right").attr("style", "height: " + $("#authors-left").height() + "px");
		}

		// Remove original authors div
		$("#authors").remove();

	},

	fillCopyright = function() {
		p("fillCopyright");

		var copy = document.createElement("div");
		$(copy).attr("id", "position-copyright");
		$("#authors-all").append(copy);

		$("#position-copyright").append($("#copyright"));
	},

	fillAbstract = function() {
		p("fillAbstract");

		var abstract = $("#abstract");
		$("#fpColRight").append(abstract);
		p("done");
	},

	fillAuthorKeywords = function() {
		p("fillAuthorKeywords");

		var keywords = $("#keywords-author");
		$("#fpColRight").append(keywords);
	},

	fillACMKeywords = function() {
		p("fillACMKeywords");

		var acmKeywords = $("#keywords-acm");
		$("#fpColRight").append(acmKeywords);
	},

	fpSidebar = function() {
		p("fpSidebar");
	},

	createContentPages = function() {
		p("createContentPages");

		storeAllDOMElements();
		fillContentFromPageTwoOn();
	},

	storeAllDOMElements = function() {
		p("storeAllDOMElements");

		var counter = 0,
		allPageElements = $("body").children();

		for(var i = 0; i < allPageElements.length; i++) {

			// Ignore elements on first page
			if($(allPageElements[i]).attr("id") == "firstPage") {
				p("had class");				
			}
			else {
				if ($(allPageElements[i]).children().length > 0) {
					for (var j = 0; j < $(allPageElements[i]).children().length; j++) {
						$doms[counter] = allPageElements[i].children[j];
						counter++;
					}
				} else {
					$doms[counter] = allPageElements[i];
					counter++;
				}
			}
		}
	},

	fillContentFromPageTwoOn = function() {

		var spaceLeft = $pageHeight;
		var spaceRight = $pageHeight;
		var curElement;
		var curElementHeight;

		// Add new page
		$pageCounter++;
		var page = createNewPage($pageCounter);
		$("body").append(page);

		for(var i = 0; i < $doms.length; i++) {
			curElement = $doms[i];
			curElementHeight = $(curElement).height();
			p(curElement.tagName + ": " +curElementHeight);

			if(spaceLeft >= curElementHeight + 50) {
				$("#pageColLeft-" + $pageCounter).append(curElement);
				spaceLeft -= curElementHeight;
				continue;
			}

			if(spaceRight >= curElementHeight + 50) {
				$("#pageColRight-" + $pageCounter).append(curElement);
				spaceRight -= curElementHeight;
				continue;
			}

			$pageCounter++;
			spaceLeft = $pageHeight;
			spaceRight = $pageHeight;
		}

	},






	p = function(text) {
		console.log(text);
	};

	that.init = init;

	return that;
}());