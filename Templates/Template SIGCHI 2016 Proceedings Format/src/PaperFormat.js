PaperFormat = (function(){
	var that = {},
	paperType = null,
	dpi = null,
	heightPage = null,
	heightFpContent = null,
	heightHeadline = null,
	heightAuthors = null,
	widthPage = null,
	widthColumn = null,
	curPage = 1,
	curSpaceLeft = null,
	curSpaceRight = null,
	leftColNotFull = true,
	rightColNotFull = true,

	init = function() {
		getPaperType();
		getDpi();
		setupMeasurements();
		fillFirstPage();
		fillContent();
		numberFigures();
		numberTables();
		refactorLinks();
		//colorPages();
	},

	getPaperType = function() {
		var start	= document.getElementsByTagName("head")[0].getElementsByTagName("link")[0].href.indexOf("css/");
		var end		= document.getElementsByTagName("head")[0].getElementsByTagName("link")[0].href.indexOf("_stylesheet");
		paperType	= document.getElementsByTagName("head")[0].getElementsByTagName("link")[0].href.substring(start + 4, end);
	},

	getDpi = function() {
		var testDiv = document.createElement("div");
		document.body.appendChild(testDiv);
		$(testDiv).css("height", "1in");
		dpi = testDiv.offsetHeight;
		testDiv.parentNode.removeChild(testDiv);
	},

	setupMeasurements = function() {
		switch(paperType) {
			case "chi_proceedings":
				heightPage	= Math.floor(9.25 * dpi);
				widthPage	= Math.floor(7 * dpi);
				widthColumn	= Math.floor(3.35 * dpi); 
			break;
		}
	},


	fillFirstPage = function(){
		createFirstPage();
		fillAuthors();
		firstPageMeasurements();
		fillAbstract();
		fillAuthorKeywords();
		fillAcmKeywords();
		fillCopyright();
	},

	createFirstPage = function() {
		var tpl = _.template($("#fp-tpl").html());
		var data = ({
			number: curPage,
			headline: document.getElementsByTagName("h1")[0].innerHTML
		});
		var result = tpl(data);
		$("#whole-page").append($.parseHTML(result));

		// Delete original headline
		$(document.getElementsByTagName("h1")[0]).remove();
	},

	fillAuthors = function() {
		var orgAuthors = $("#authors-org").children();		
		var tpl = _.template($("#authors-tpl").html());;
		
		for(var i = 0; i < orgAuthors.length; i++){
			var line = orgAuthors[i].getElementsByTagName("span");
			var data = ({
				name:	line[0].innerHTML,
				info:	line[1].innerHTML,
				city:	line[2].innerHTML,
				email:	line[3].innerHTML
			});
			$("#authors").append(tpl(data));
		}

		// Delete original author dom
		$("#authors-org").remove();
	},

	firstPageMeasurements = function() {
		heightAuthors	= $("#authors").outerHeight(true);
		heightHeadline	= $(document.getElementsByTagName("h1")[0]).outerHeight(true);
		heightFpContent	= Math.floor(heightPage - heightAuthors - heightHeadline);
		curSpaceLeft	= heightFpContent;
		curSpaceRight	= heightFpContent;
		$("#column-left-" + curPage).height("" + heightFpContent + "px");
	},

	fillAbstract = function() {
		var left = $("#column-left-" + curPage);
		$(left).append($("#abstract"));
		curSpaceLeft -= $("#abstract").outerHeight(true);
	},

	fillAuthorKeywords = function() {
		var left = $("#column-left-" + curPage);
		$(left).append($("#keywords-author"));
		curSpaceLeft -= $("#keywords-author").outerHeight(true);
	},

	fillAcmKeywords = function() {
		var left = $("#column-left-" + curPage);
		$(left).append($("#keywords-acm"));
		curSpaceLeft -= $("#keywords-acm").outerHeight(true);
	},

	fillCopyright = function() {
		var left	= $("#column-left-" + curPage);
		var height	= $("#copyright").outerHeight(true);
		$(left).append($("#copyright"));
		curSpaceLeft -= height;
	},

	fillContent = function() {
		var content = document.getElementsByClassName("content");		
		var number = content.length;
		number += 2;

		for(var i = 0; i < number; i++) {
			var item = content[0];			
			var itemHeight = $(item).height();
			
			// Append to both columns
			if(item.children[0].classList.contains("fullsize")) {
				createNewPage();
				$("#column-left-" + curPage).append(item);
				itemHeight		= (item.children[0]).offsetHeight;
				$("#column-right-" + curPage).css("height", "" + (heightPage - itemHeight) + "px");
				$("#column-right-" + curPage).css("top", "" + itemHeight + "px");
				curSpaceLeft	-= itemHeight;
				curSpaceRight	-= itemHeight;
			}

			// Append to left column
			else if ((itemHeight + 10) < curSpaceLeft && leftColNotFull) {
				$("#column-left-" + curPage).append(item);
				curSpaceLeft -= itemHeight;
			}

			// Append to right column
			else if ((itemHeight + 10) < curSpaceRight && rightColNotFull) {
				leftColNotFull = false;
				$("#column-right-" + curPage).append(item);
				curSpaceRight -= itemHeight;
			}

			else{
				createNewPage();
			}

		}
	},

	createNewPage = function() {
		curPage++;
		curSpaceLeft	= heightPage;
		curSpaceRight	= heightPage;
		leftColNotFull	= true;
		rightColNotFull	= true;

		var tpl = _.template($("#other-pages-tpl").html());
		var data = ({
			number: curPage,
		});
		var result = tpl(data);
		$("#whole-page").append($.parseHTML(result));
		console.log("created");
	},

	numberFigures = function() {
		var figures = document.getElementsByTagName("figure");

		for(var i = 0; i < figures.length; i++) {
			var caption = figures[i].getElementsByTagName("figcaption")[0];
			var text = caption.innerHTML;
			var number = i+1;
			caption.innerHTML = "Figure " + number + ". " + text;
		}
	}

	numberTables = function() {
		var tables = document.getElementsByClassName("table");

		for(var i = 0; i < tables.length; i++) {
			var caption = tables[i].getElementsByTagName("caption")[0];
			var text = caption.innerHTML;
			var number = i+1;
			caption.innerHTML = "Table " + number + ". " + text;
		}
	},

	refactorLinks = function() {
		var links = document.getElementsByTagName("a");

		for(var i = 0; i < links.length; i++) {
			$(links[i]).attr('target', '_blank');
		}
	},

	colorPages = function() {
		for(var i = 1; i < curPage + 1; i++) {
			$("#page-" + i).css("background-color", "" + getRandomColor());
		}
	},

	getRandomColor = function() {
		var letters = '0123456789ABCDEF'.split('');
    	var color = '#';
    	for (var i = 0; i < 6; i++ ) {
       		color += letters[Math.floor(Math.random() * 16)];
    	}
    	return color;
	};

	that.init = init;
	return that;
}());