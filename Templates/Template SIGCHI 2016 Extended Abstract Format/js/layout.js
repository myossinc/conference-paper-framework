paperLayout = (function() {
	$container = [],
	$doms = [],

	init = function (medium) {
		this.medium = medium;
		this.getDPI();
		this.determinePaperType();
		this.setupPage();
		this.getFirstColumnElement();
		//this.setupColumns();
		this.fillColumns();
	},

	// Calculate the dpi of the screen
	getDPI = function() {
		var testDiv = document.createElement("div");
		document.body.appendChild(testDiv);
		testDiv.style.height = "1in";
		testDiv.style.width = "1in";
		var dpiString = document.defaultView.getComputedStyle(testDiv,null).height; 
		dpiString = dpiString.substring(0, (dpiString.length - 2));
		this.dpi = parseInt(dpiString, 10);
		document.body.removeChild(testDiv);
	},

	// Find out the paper type by looking at the used stylesheet
	determinePaperType = function() {
		var url = document.styleSheets[0].href;
		var start = url.search("css");
		var stop = url.search("_stylesheet");
		var type = url.substring(start + 4, stop);
		this.type = type;
	},

	setupPage = function() {
		switch (this.type) {
			case ("chi_extended"):
				this.pageWidth = 11 * this.dpi;
				this.pageHeight = 8.5 * this.dpi;
				this.columnCount = 2;
				this.columnWidth = 3.34 * this.dpi;
				this.columnGap = 0.5 * this.dpi;
				break;
		}
	},

	setupColumns = function() {
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

	fillColumns = function(){
		this.createBodyClone();		
		this.createFirstPage();
		this.storeDOMElements();
		this.fillContentFromPageTwoOn();

	},

	createBodyClone = function() {
		var clone = document.createElement("div");
		clone.setAttribute("id", "body-clone");
		document.body.appendChild(clone);
	},

	createFirstPage = function() {
		var container = document.createElement("div");
		container.setAttribute("id", "page-one");
		container.setAttribute("class", "fp");
		document.getElementById("body-clone").appendChild(container);

		this.fillHeadline();
		this.fpSidebar();
		this.fpContent();

		// Insert page break after page one when displayed on a screen
		if (this.medium === "screen") {
			document.getElementById("body-clone").appendChild(document.createElement("hr"));
		}
	},

	fillHeadline = function() {
		var headline = document.getElementsByTagName("h1")[0];
		document.getElementById("page-one").appendChild(headline);
	},

	fpSidebar = function() {
		var sidebarFirstPage = document.createElement("div");
		sidebarFirstPage.setAttribute("id", "fp-sidebar");
		document.getElementById("page-one").appendChild(sidebarFirstPage);
	},

	fpContent = function() {
		var fpLeft = document.createElement("div");
		fpLeft.setAttribute("id", "fp-left");
		document.getElementById("page-one").appendChild(fpLeft);

		var fpRight = document.createElement("div");
		fpRight.setAttribute("id", "fp-right");
		document.getElementById("page-one").appendChild(fpRight);

		// Left Column of page one
		this.fillAuthors();
		this.fillCopyright();

		// Right Column of page one
		this.fillAbstract();
		this.fillAuthorKeywords();
		this.fillACMKeywords();
	},

	fillSidebar = function() {
		var sidebar = document.getElementsByClassName("sidebar");

		for(var i = 0; i < sidebar.length; i++) {
			document.getElementById("sidebar").appendChild(sidebar[i]);
		}
	},

	// Distribute the authors to the two author columns
	fillAuthors = function() {

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
		var copy = document.createElement("div");
		copy.setAttribute("id", "position-copyright");
		document.getElementById("authors-all").appendChild(copy);

		document.getElementById("position-copyright").appendChild(document.getElementById("copyright"));
	},

	fillAbstract = function() {
		var abstract = document.getElementById("abstract");
		document.getElementById("fp-right").appendChild(abstract);
	},

	fillAuthorKeywords = function() {
		var keywords = document.getElementById("keywords-author");
		document.getElementById("fp-right").appendChild(keywords);
	},

	fillACMKeywords = function() {
		var acmKeywords = document.getElementById("keywords-acm");
		document.getElementById("fp-right").appendChild(acmKeywords);
	},

	storeDOMElements = function() {
		var counter = 0;
		var childNodes = document.body.children;
		for(var i = 0; i < childNodes.length; i++) {
			if(!hasClass(childNodes[i], "fp")) {
				if (childNodes[i].hasChildNodes()) {
					for (var j = 0; j < childNodes[i].children.length; j++) {
						this.doms[counter] = childNodes[i].children[j];
						counter++;
					}
				} else {
					this.doms[counter] = childNodes[i];
					counter++;
				}
			}
			else {
				p("had class");
			}
		}
	},

	fillContentFromPageTwoOn = function() {
		var bodyClone = document.getElementById("body-clone");
		var remainingSpaceLeft = this.pageHeight, remainingSpaceRight = this.pageHeight;
		var sidebar, curColumnLeft, curColumnRight;
		var steps = 1, i = 0, numberOfElements = document.body.children.length;

		// Add new sidebar
		sidebar = document.createElement("div");
		sidebar.setAttribute("class", "sidebar-column");
		sidebar.setAttribute("id", "sidebar-" + steps);
		bodyClone.appendChild(sidebar);

		// Add new column for left content
		curColumnLeft = document.createElement("div");
		curColumnLeft.setAttribute("class", "pageColumn");
		curColumnLeft.setAttribute("id", "column-left-" + steps);
		bodyClone.appendChild(curColumnLeft);

		// Add new column for right content
		curColumnRight = document.createElement("div");
		curColumnRight.setAttribute("class", "pageColumn");
		curColumnRight.setAttribute("id", "column-right-" + steps);
		bodyClone.appendChild(curColumnRight);
		
		steps++;

		for (var i = 0; i < this.doms.length; i++) {
			if (remainingSpaceLeft > this.doms[i].offsetHeight) {
				curColumnLeft.appendChild(this.doms[i]);
				remainingSpaceLeft -= this.doms[i].offsetHeight;
				continue;
			}

			if (remainingSpaceRight > this.doms[i].offsetHeight) {
				curColumnRight.appendChild(this.doms[i]);
				remainingSpaceRight -= this.doms[i].offsetHeight;
				continue;
			}

			// Add new sidebar
			sidebar = document.createElement("div");
			sidebar.setAttribute("class", "sidebar-column");
			sidebar.setAttribute("id", "sidebar-" + steps);
			bodyClone.appendChild(sidebar);

			// Add new column for left content
			curColumnLeft = document.createElement("div");
			curColumnLeft.setAttribute("class", "pageColumn");
			curColumnLeft.setAttribute("id", "column-left-" + steps);
			bodyClone.appendChild(curColumnLeft);

			// Add new column for right content
			curColumnRight = document.createElement("div");
			curColumnRight.setAttribute("class", "pageColumn");
			curColumnRight.setAttribute("id", "column-right-" + steps);
			bodyClone.appendChild(curColumnRight);

			steps++;

			remainingSpaceLeft = this.pageHeight;
			remainingSpaceRight = this.pageHeight;
		}

		/**
		for(var i = 0; i < numberOfElements; i++) {
			var curElement = document.body.children[i];
			var curElementHeight = curElement.offsetHeight;

			p("height:\t" + curElementHeight);
			if(remainingSpaceLeft < 100 && remainingSpaceRight < 100) {
				// Add new sidebar
				sidebar = document.createElement("div");
				sidebar.setAttribute("class", "sidebar-column");
				sidebar.setAttribute("id", "sidebar-" + steps);
				bodyClone.appendChild(sidebar);

				// Add new column for left content
				curColumnLeft = document.createElement("div");
				curColumnLeft.setAttribute("class", "pageColumn");
				curColumnLeft.setAttribute("id", "column-left-" + steps);
				bodyClone.appendChild(curColumnLeft);

				// Add new column for right content
				curColumnRight = document.createElement("div");
				curColumnRight.setAttribute("class", "pageColumn");
				curColumnRight.setAttribute("id", "column-right-" + steps);
				bodyClone.appendChild(curColumnRight);
				
				remainingSpaceLeft = this.pageHeight;
				remainingSpaceRight = this.pageHeight;
				steps++;
			}

			if (remainingSpaceLeft > curElementHeight) {
				p(curElement.firstElementChild.innerHTML);
				curColumnLeft.appendChild(curElement);
				continue;
			}

			if (remainingSpaceRight > curElementHeight){
				curColumnRight.appendChild(curElement);
				continue;
			}
		}
		*/

		/**
		while(document.body.children.length > 0) {

			// Add new sidebar
			sidebar = document.createElement("div");
			sidebar.setAttribute("class", "sidebar-column");
			sidebar.setAttribute("id", "sidebar-" + steps);
			bodyClone.appendChild(sidebar);

			// Add new column for left content
			curColumnLeft = document.createElement("div");
			curColumnLeft.setAttribute("class", "pageColumn");
			curColumnLeft.setAttribute("id", "column-left-" + steps);
			bodyClone.appendChild(curColumnLeft);

			// Add new column for right content
			curColumnRight = document.createElement("div");
			curColumnRight.setAttribute("class", "pageColumn");
			curColumnRight.setAttribute("id", "column-right-" + steps);
			bodyClone.appendChild(curColumnRight);

			if(curElementHeight > this.pageHeight) {
				this.seperateDiv(curElement);
				curElement = document.body.firstElementChild;
				curElementHeight = curElement.offsetHeight;
			}				

			while (remainingSpaceLeft >= curElementHeight) {				
				document.getElementById("column-left-" + steps).appendChild(curElement);
				remainingSpaceLeft -= curElementHeight;
				curElement = document.body.firstElementChild;
				curElementHeight = curElement.offsetHeight;
				i++;
			}

			if(curElementHeight > this.pageHeight) {
				this.seperateDiv(curElement);
				curElement = document.body.firstElementChild;
			}

			while (remainingSpaceRight >= curElementHeight) {
				document.getElementById("column-right-" + steps).appendChild(curElement);
				remainingSpaceRight -= curElementHeight;
				curElement = document.body.firstElementChild;
				curElementHeight = curElement.offsetHeight;
			}

			if (steps > 20) {
				return;
			}
			steps++;
			remainingSpaceLeft = this.pageHeight;
			remainingSpaceRight = this.pageHeight;
			*/		
		
	},

	createNewColumns = function(steps) {

		// Add new sidebar
		sidebar = document.createElement("div");
		sidebar.setAttribute("class", "sidebar-column");
		sidebar.setAttribute("id", "sidebar-" + steps);
		bodyClone.appendChild(sidebar);

		// Add new column for left content
		curColumnLeft = document.createElement("div");
		curColumnLeft.setAttribute("class", "pageColumn");
		curColumnLeft.setAttribute("id", "column-left-" + steps);
		bodyClone.appendChild(curColumnLeft);

		// Add new column for right content
		curColumnRight = document.createElement("div");
		curColumnRight.setAttribute("class", "pageColumn");
		curColumnRight.setAttribute("id", "column-right-" + steps);
		bodyClone.appendChild(curColumnRight);
	},

/**
	seperateDiv : function(div) {
		var size = 0;
		var timesNeeded = Math.ceil(div.offsetHeight / this.pageHeight);
		var newDiv = document.createElement("div");
		var current = div.firstElementChild;
		newDiv.setAttribute("class", "created");
		document.body.insertBefore(newDiv, document.body.firstElementChild);

		for(var i = 0; i < timesNeeded; i++){
			while (size < this.pageHeight && current !== null){
				console.log("kaaaaa");
				size += current.offsetHeight;
				newDiv.appendChild(current);
				current = div.firstElementChild;
			}
			size = 0;						
		}
		
	}
	**/

	seperateDiv = function(div) {
		while (div.children.length > 0){
			document.body.insertBefore(div.children[0], document.body.firstElementChild);

		}
	}

	p = function(s) {
		console.log(s);
	}
}

}());