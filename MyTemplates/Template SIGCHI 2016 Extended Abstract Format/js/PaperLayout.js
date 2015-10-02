Controller.PaperLayout = (function() {
	var that = {},
	$container = [],
	doms = [],
	$medium = null,
	dpi = null,

	init = function (medium) {
		p("init");
		$medium = medium;
		getDPI();
		determinePaperType();
		setupPage();
		getFirstColumnElement();
		//setupColumns();
		fillColumns();
	},

	// Calculate the dpi of the screen
	getDPI = function() {
		p("getDPI");
		var testDiv = document.createElement("div");
		document.body.appendChild(testDiv);
		testDiv.style.height = "1in";
		testDiv.style.width = "1in";
		var dpiString = document.defaultView.getComputedStyle(testDiv,null).height; 
		dpiString = dpiString.substring(0, (dpiString.length - 2));
		dpi = parseInt(dpiString, 10);
		document.body.removeChild(testDiv);
	},

	// Find out the paper type by looking at the used stylesheet
	determinePaperType = function() {
		p("determinePaperType");
		var url = document.styleSheets[0].href;
		var start = url.search("css");
		var stop = url.search("_stylesheet");
		var type = url.substring(start + 4, stop);
		this.type = type;
	},

	setupPage = function() {
		p("setupPage");
		switch (this.type) {
			case ("chi_extended"):
				this.pageWidth = 11 * dpi;
				this.pageHeight = 8.5 * dpi;
				this.columnCount = 2;
				this.columnWidth = 3.34 * dpi;
				this.columnGap = 0.5 * dpi;
				break;
		}
	},

	setupColumns = function() {
		p("setupColumns");
		var container = document.createElement("div");
		container.setAttribute("id", "container");
		document.body.appendChild(container);

		var sidebar = document.createElement("div");
		sidebar.setAttribute("id", "sidebar");
		document.getElementById("container").appendChild(sidebar);

		var content = document.createElement("div");
		content.setAttribute("id", "content");
		document.getElementById("container").appendChild(content);
	},

	getFirstColumnElement = function() {
		p("getFirstColumnElement");
		var firstElement;
		switch (this.type) {

			// Set the author section as first element and determine how the authors are going to be distributed to the columns
			case ("chi_extended"):
				firstElement = document.getElementById("authors");
				this.firstColumnElement = firstElement;
				this.numberOfAuthors = firstElement.children[0].children.length;
				this.numberOfAuthorsLeft = Math.ceil(this.numberOfAuthors/2);
				this.numberOfAuthorsRight = this.numberOfAuthors - this.numberOfAuthorsLeft;
				break;
		}
	},

	fillColumns = function() {
		p("fillColumns");
		createBodyClone();		
		createFirstPage();
		storeDOMElements();
		fillContentFromPageTwoOn();

	},

	createBodyClone = function() {
		p("createBodyClone");
		var clone = document.createElement("div");
		clone.setAttribute("id", "body-clone");
		document.body.appendChild(clone);
	},

	createFirstPage = function() {
		p("createFirstPage");
		var container = document.createElement("div");
		container.setAttribute("id", "page-one");
		container.setAttribute("class", "fp page");
		document.getElementById("body-clone").appendChild(container);

		fillHeadline();
		fpSidebar();
		fpContent();

		// Insert page break after page one when displayed on a screen
		if ($medium == "screen") {
			//$(document.createElement("hr")).insertAfter(document.getElementById("page-one"));
		}
	},

	fillHeadline = function() {
		p("fillHeadline");
		var headline = document.getElementsByTagName("h1")[0];
		document.getElementById("page-one").appendChild(headline);
	},

	fpSidebar = function() {
		p("fpSidebar");
		var sidebarFirstPage = document.createElement("div");
		sidebarFirstPage.setAttribute("id", "fp-sidebar");
		document.getElementById("page-one").appendChild(sidebarFirstPage);
	},

	fpContent = function() {
		p("fpContent");
		var fpLeft = document.createElement("div");
		fpLeft.setAttribute("id", "fp-left");
		document.getElementById("page-one").appendChild(fpLeft);

		var fpRight = document.createElement("div");
		fpRight.setAttribute("id", "fp-right");
		document.getElementById("page-one").appendChild(fpRight);

		// Left Column of page one
		fillAuthors();
		fillCopyright();

		// Right Column of page one
		fillAbstract();
		fillAuthorKeywords();
		fillACMKeywords();
	},

	fillSidebar = function() {
		p("fillSidebar");
		var sidebar = document.getElementsByClassName("sidebar");

		for(var i = 0; i < sidebar.length; i++) {
			document.getElementById("sidebar").appendChild(sidebar[i]);
		}
	},

	// Distribute the authors to the two author columns
	fillAuthors = function() {
		p("fillAuthors");

		// Semantic wrapper for authors
		var semanticWrapper = document.createElement("section");
		semanticWrapper.setAttribute("id", "authors-wrapper");
		document.getElementById("body-clone").appendChild(semanticWrapper);

		// Div for all authors
		var container = document.createElement("footer");
		container.setAttribute("id", "authors-all");
		document.getElementById("authors-wrapper").appendChild(container);
		document.getElementById("fp-left").appendChild(semanticWrapper);
		
		// Left authors
		var left = document.createElement("div");
		left.setAttribute("id", "authors-left");
		document.getElementById("authors-all").appendChild(left);

		for (var i = 0; i < this.numberOfAuthorsLeft; i++) {
			document.getElementById("authors-left").appendChild(this.firstColumnElement.children[0].children[0]);
		}

		// Right authors
		var right = document.createElement("div");
		right.setAttribute("id", "authors-right");
		document.getElementById("authors-all").appendChild(right);

		while(this.firstColumnElement.children[0].children.length > 0) {
			document.getElementById("authors-right").appendChild(this.firstColumnElement.children[0].children[0]);
		}

		// Match height of left and right author divs
		if (this.numberOfAuthorsLeft > this.numberOfAuthorsRight) {
			document.getElementById("authors-right").setAttribute("style", "height:" + document.getElementById("authors-left").offsetHeight + "px");
		}

		// Delete original authors section from body tag
		document.getElementById("authors").remove();
	},

	fillCopyright = function() {
		p("fillCopyright");
		var copy = document.createElement("div");
		copy.setAttribute("id", "position-copyright");
		document.getElementById("authors-all").appendChild(copy);

		document.getElementById("position-copyright").appendChild(document.getElementById("copyright"));
	},

	fillAbstract = function() {
		p("fillAbstract");
		var abstract = document.getElementById("abstract");
		document.getElementById("fp-right").appendChild(abstract);
	},

	fillAuthorKeywords = function() {
		p("fillAuthorKeywords");
		var keywords = document.getElementById("keywords-author");
		document.getElementById("fp-right").appendChild(keywords);
	},

	fillACMKeywords = function() {
		p("fillACMKeywords");
		var acmKeywords = document.getElementById("keywords-acm");
		document.getElementById("fp-right").appendChild(acmKeywords);
	},

	storeDOMElements = function() {
		p("storeDOMElements");
		var counter = 0,
		childNodes = $(document.body).children();
		p("childnodes: " + childNodes.length);
		for(var i = 0; i < childNodes.length; i++) {

			// Ignore elements on first page
			if($(childNodes[i]).hasClass("fp")) {
				p("had class");				
			}
			else {
				if (childNodes[i].hasChildNodes()) {
					for (var j = 0; j < childNodes[i].children.length; j++) {
						doms[counter] = childNodes[i].children[j];
						counter++;
					}
				} else {
					doms[counter] = childNodes[i];
					counter++;
				}
			}
		}
	},

	fillContentFromPageTwoOn = function() {
		p("fillContentFromPageTwoOn");
		var bodyClone = document.getElementById("body-clone");
		var remainingSpaceLeft = this.pageHeight, remainingSpaceRight = this.pageHeight;
		var page, sidebar, curColumnLeft, curColumnRight;
		var steps = 1, i = 0, numberOfElements = doms.length;

		// Add new page
		page = document.createElement("div");
		page.setAttribute("class", "page");
		page.setAttribute("id", "page-" + steps);
		bodyClone.appendChild(page);

		// Add new sidebar
		sidebar = document.createElement("div");
		sidebar.setAttribute("class", "sidebar-column");
		sidebar.setAttribute("id", "sidebar-" + steps);
		page.appendChild(sidebar);

		// Add new column for left content
		curColumnLeft = document.createElement("div");
		curColumnLeft.setAttribute("class", "pageColumn");
		curColumnLeft.setAttribute("id", "column-left-" + steps);
		page.appendChild(curColumnLeft);

		// Add new column for right content
		curColumnRight = document.createElement("div");
		curColumnRight.setAttribute("class", "pageColumn");
		curColumnRight.setAttribute("id", "column-right-" + steps);
		page.appendChild(curColumnRight);
		
		steps++;

		for (var i = 0; i < doms.length; i++) {
			if (remainingSpaceLeft > doms[i].offsetHeight + 50) {
				p("left");
				curColumnLeft.appendChild(doms[i]);
				remainingSpaceLeft -= doms[i].offsetHeight;
				continue;
			}

			if (remainingSpaceRight > doms[i].offsetHeight + 50) {
				p("right");
				curColumnRight.appendChild(doms[i]);
				remainingSpaceRight -= doms[i].offsetHeight;
				continue;
			}

			p("new");

			// Add new page
			page = document.createElement("div");
			page.setAttribute("class", "page");
			page.setAttribute("id", "page-" + steps);
			bodyClone.appendChild(page);

			// Add new sidebar
			sidebar = document.createElement("div");
			sidebar.setAttribute("class", "sidebar-column");
			sidebar.setAttribute("id", "sidebar-" + steps);
			page.appendChild(sidebar);

			// Add new column for left content
			curColumnLeft = document.createElement("div");
			curColumnLeft.setAttribute("class", "pageColumn");
			curColumnLeft.setAttribute("id", "column-left-" + steps);
			page.appendChild(curColumnLeft);

			// Add new column for right content
			curColumnRight = document.createElement("div");
			curColumnRight.setAttribute("class", "pageColumn");
			curColumnRight.setAttribute("id", "column-right-" + steps);
			page.appendChild(curColumnRight);

			steps++;

			remainingSpaceLeft = this.pageHeight;
			remainingSpaceRight = this.pageHeight;
		}

		updateHeight();
	},

	updateHeight = function() {
		p("updateHeight");
		var elements = document.getElementsByClassName("page");
		for(var i = 0; i < elements.length; i++) {
			$(elements[i]).css("height", this.pageHeight);
		}
	},

	seperateDiv = function(div) {
		p("seperateDiv");
		while (div.children.length > 0){
			document.body.insertBefore(div.children[0], document.body.firstElementChild);

		}
	},

	p = function(s) {
		console.log(s);
	};

	that.init = init;

	return that;

}());