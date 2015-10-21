PaperFormat = (function(){
	var that = {},
	paperType = null,
	dpi = null,
	heightPage = null,
	heightFpContent = null,
	heightHeadline = null,
	heightAuthors = null,
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
				heightPage = Math.floor(9.25 * dpi);
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
		$("#column-left-" + curPage).height("" + heightPage + "px");
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

			if (itemHeight < curSpaceLeft && leftColNotFull) {
				$("#column-left-" + curPage).append(item);
				curSpaceLeft -= itemHeight;
			}			
			else if (itemHeight < curSpaceRight && rightColNotFull) {
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
	};

	that.init = init;
	return that;
}());