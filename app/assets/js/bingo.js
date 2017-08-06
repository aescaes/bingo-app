var bingo = {
	password: "1234",
	clearEnterPassword: "0000",
	storage: localStorage,
	loadCells: function() {
		var letter = '', // current letter
			section = "#row-bingo",
			row = "", // current row
			startNum = 0, // start number (b = 1, i = 16, ...)
			cellId = "", // current cell id
			cellState = ""; // current cell state

		for(var c = 1; c <= 5; c++) {
			// set the right letter for each bingo row
			if(c == 1) letter = 'b';
			else if(c == 2) letter = 'i';
			else if(c == 3) letter = 'n';
			else if(c == 4) letter = 'g';
			else if(c == 5) letter = 'o';

			// append a new bingo row
			$(section).append(
				"<div class='bingo-row' id='bingo-" + letter + "'></div>"
			);

			// check the bingo row start number
			if(letter === 'b') startNum = 1;
			else if(letter === 'i') startNum = 16;
			else if(letter === 'n') startNum = 31;
			else if(letter === 'g') startNum = 46;
			else if(letter === 'o') startNum = 61;

			// get the current row
			row = "#bingo-" + letter;

			// append primary cell (letters) to current row
			$(row).append(
				"<div class='bingo-cell primary-cell' id='bingo-cell-" + letter + "'>" + letter + "</div>"
			);

			// append number cells to current row
			for(var num = startNum; num <= startNum + 14; num++) {
				$(row).append(
					"<div class='bingo-cell' id='bingo-cell-" + letter + "-" + num + "'>" + num + "</div>"
				);

				// get the id of current cell
				cellId = "bingo-cell-" + letter + "-" + num;

				// get the cell state of current cell (Marked/Unmarked)
				cellState = this.storage.getItem(cellId);

				// add a 'marked' class to cell if it is in marked state
				if(cellState === "marked")
					$("#" + cellId).addClass("marked");
				else
					// initialize the cell state to unmarked;
					this.storage.setItem(cellId, "unmarked");
			}
		}
	},
	startLogoTransition: function() {
		var nextLogo = "codec";

		$("#logo-col").fadeOut(3000, function() {
			$("#logo-codec").fadeIn(3000);
			nextLogo = "col";
		});

		setInterval(function() {
			if(nextLogo === "codec") {
				$("#logo-col").fadeOut(3000, function() {
					$("#logo-codec").fadeIn(3000);
					nextLogo = "col";
				});
			} else if(nextLogo === "col") {
				$("#logo-codec").fadeOut(3000, function() {
					$("#logo-col").fadeIn(3000);
					nextLogo = "codec";
				});
			}
		}, 5000);
	},
	clear: function() {
	  	var cellCount = $(".bingo-cell").length,
	  			letter = '',
	  			cellId = "";

	  	// unmark each state
	  	for(var num = 1; num <= (cellCount - 5); num++) { // where 5 is for b, i, n, g and o
	  		// determine the letter
	  		if(num >= 1 && num <= 15)
	  			letter = 'b';
	  		else if(num >= 16 && num <= 30)
	  			letter = 'i';
	  		else if(num >= 31 && num <= 45)
	  			letter = 'n';
	  		else if(num >= 46 && num <= 60)
	  			letter = 'g';
	  		else if(num >= 61 && num <= 75)
	  			letter = 'o';

	  		// get the cell id
	  		cellId = "bingo-cell-" + letter + "-" + num;

	  		// unmark cell by removing the 'marked' class
	  		$("#" + cellId).removeClass("marked");
	  		this.storage.setItem(cellId, "unmarked");
	  	}

	  	// reload page after clearing
	  	location.reload();
	},
	transitionPage: function(current, redirect) {
		$("#" + current).fadeOut("slow", function() {
			// revert to original display
			$("#" + redirect).css("display", "flex");

			// hide back button when in the main page
			if(redirect === "main") 
				$(".btn-float").hide();
			else
				$(".btn-float").show();

			// remove the current pattern being edited
			// if from the pattern edit page
			if(current === "pattern-edit")
				$("#pattern-edit table#edit-pattern").remove();

			$("#" + redirect).fadeIn("slow");
		});	
	},
	updateCell: function(cellId, option) {
	 	var cellState = this.storage.getItem(cellId); // state of the selected cell

	 	if(cellState === "marked") {
	 		this.storage.setItem(cellId, "unmarked");
	 		$("#" + cellId).removeClass("marked");

	 		// when updating cells from pattern edit page
	 		if(option === "edit") {
	 			$("#edit-pattern #" + cellId).removeClass("marked");
	 			$("#patterns #" + cellId).removeClass("marked");
	 		}
	 	} else {
	 		this.storage.setItem(cellId, "marked");
	 		$("#" + cellId).addClass("marked");

	 		// when updating cells from pattern edit page
	 		if(option === "edit") {
	 			$("#edit-pattern #" + cellId).addClass("marked");
	 			$("#patterns #" + cellId).addClass("marked");
	 		}
	 	}
	},
	updateDraw: function(cellId) {
		var row = "";
			currentDraw = "";

	  	if($("#" + cellId).attr("class") !== "bingo-cell marked") {
 			$("#main #current-draw-number").html(this.storage.getItem("recent-draw"));
	  	} else {
	  		// drop the draw before most recent
	  		if(this.storage.getItem("null-draw-before-recent") === "yes")
	  			this.storage.setItem("draw-before-recent", "null*");

  			// get the row of the selected cell
	 		row = $("#" + cellId).parent().closest("div").attr("id");
	 		row = row.charAt(row.length - 1);

	 		// get the current draw to display
	 		currentDraw = row + "-" + $("#" + cellId).html();

	 		// display draw
	 		$("#current-draw #number").html(currentDraw);
 			this.transitionPage("main", "current-draw");
 			$("#main #current-draw-number").html(currentDraw);
 		}
	},
	draw: function(cellId) {
		var recentDrawId = "",
			recentDraw = "",
			drawBeforeRecent = "";
			
		// if the selected cell is not disabled
		if($("#" + cellId).attr("style") !== "pointer-events: none") {
			// if the selected cell is not marked
			if($("#" + cellId).attr("class") !== "bingo-cell marked") {
				recentDrawId = this.storage.getItem("recent-draw-id");

				// disable cell if marked
				if($("#" + recentDrawId).attr("class") === "bingo-cell marked")
					$("#" + recentDrawId).attr("style", "pointer-events: none");

				this.storage.setItem("recent-draw-id", cellId);

				recentDraw = localStorage.getItem("recent-draw");
				drawBeforeRecent = localStorage.getItem("draw-before-recent");

				if(drawBeforeRecent === recentDraw) {
					this.storage.setItem("recent-draw", recentDraw);
					this.storage.setItem("null-draw-before-recent", "yes");
				} else {
					this.storage.setItem("recent-draw", $("#current-draw #number").html());
					this.storage.setItem("null-draw-before-recent", "no");
				}
			} else {
				var recentDraw = this.storage.getItem("recent-draw");
				var drawBeforeRecent = this.storage.getItem("draw-before-recent");

				localStorage.setItem("draw-before-recent", recentDraw);
			}

			this.updateCell(cellId);
			this.updateDraw(cellId, drawBeforeRecent, recentDraw);
		}
	},
	pattern: {
		numOfPattern: 8,
		loadPatterns: function() {
			var cellId = "",
				cellStatus = "",
				patternName = "",
				patternPrice = "";

			// append a pattern block
			for(var patternNum = 1; patternNum <= this.numOfPattern; patternNum++) {
				$("#patterns").append(
					"<div id='pattern-block-" + patternNum + "'>" +
					"  <table class='pattern' id='pattern-" + patternNum + "' align='center' cellspacing='10px'>" +
					"  </table>" +
					"</div>"
				);

				// append pattern row
				for(var row = 1; row <= 5; row++) {
					$("#patterns #pattern-block-" + patternNum + " table").append(
						"<tr id='r" + row + "'></tr>"
					);

					// append pattern cells to currentr ow
					for(var col = 1; col <= 5; col++) {
						// append the bonus cell
						if(row == 3 && col == 3)
							$("#patterns #pattern-block-" + patternNum + " table tr#r" + row).append(
								"<td class='bonus' id='pattern-" + patternNum + "-r" + row + "c" + col + "'></td>"
							);
						else {
							cellId = "pattern-" + patternNum + "-r" + row + "c" + col;
							cellStatus = bingo.storage.getItem(cellId);

							$("#patterns #pattern-block-" + patternNum + " table tr#r" + row).append(
								"<td id='" + cellId + "'></td>"
							);

							if(cellStatus === "marked")
								$("#patterns #" + cellId).addClass("marked");
						}
					}
				}

				patternName = bingo.storage.getItem("pattern-" + patternNum);
				patternPrice = bingo.storage.getItem("pattern-" + patternNum + "-price");

				if(typeof(patternName) === "object")
					patternName = "Slot " + patternNum;
				if(typeof(patternPrice) === "object")
					patternPrice = "0";

				$("#patterns #pattern-block-" + patternNum).append(
					"<h3>Game " + patternNum +"</h3>" +
					"<h1 class='pattern-name' id='pattern-" + patternNum + "-name'>" + patternName + "</h1>" +
					"<h2 id='pattern-" + patternNum + "-price'>Price: P" + patternPrice + ".00</h2>" +
					"<div id='btns'><button class='btn' id='btn-edit' data-pattern-num='pattern-" + patternNum + "'>Edit</button>" +
					"<button class='btn' id='btn-select' data-pattern-num='pattern-" + patternNum + "'>Select</button></div>"
				);
			}
		},
		edit: function(patternNum) {
			$("#pattern-edit").append(
				"<table class='pattern' id='edit-pattern' data-pattern-num='" + patternNum + "' align='center' cellspacing='10px'>" +
				"</table>"
			);

			$("#inp-pattern-name").val(bingo.storage.getItem(patternNum));
			$("#inp-pattern-price").val(bingo.storage.getItem(patternNum + "-price"));

			for(var row = 1; row <= 5; row++) {
				$("#pattern-edit table#edit-pattern").append(
					"<tr id='r" + row + "'></tr>"
				);

				for(var col = 1; col <= 5; col++) {
					if(row == 3 && col == 3)
						$("#pattern-edit table#edit-pattern tr#r" + row).append(
							"<td class='bonus' id='pattern-" + patternNum + "-r" + row + "c" + col + "'></td>"
						);
					else {
						var cellId = "pattern-" + patternNum[patternNum.length - 1] + "-r" + row + "c" + col;
						var cellStatus = bingo.storage.getItem(cellId);

						$("#pattern-edit table#edit-pattern tr#r" + row).append(
							"<td id='" + cellId + "'></td>"
						);

						if(cellStatus === "marked")
							$("#edit-pattern #" + cellId).addClass("marked");
					}
				}
			}

			bingo.transitionPage("patterns", "pattern-edit");

			$("#edit-pattern td").click(function() {
				var cellId = $(this).attr("id");

				bingo.updateCell(cellId, "edit");
			});

			$("#pattern-edit div input").keyup(function() {
				var patternNum = $("#pattern-edit #edit-pattern").data("pattern-num");

				bingo.storage.setItem(patternNum, $("#inp-pattern-name").val());
				bingo.storage.setItem(patternNum + "-price", $("#inp-pattern-price").val());

				$("#patterns div #" + patternNum + "-name").html(bingo.storage.getItem(patternNum));
				$("#patterns div #" + patternNum + "-price").html("Price: P" + bingo.storage.getItem(patternNum + "-price") + ".00");
			});
		},
		select: function(patternNum) {
			$("#col-current-pattern #current-pattern, #current-pattern-show #current-pattern, #current-pattern-show div").remove();
			$("#col-current-pattern, #current-pattern-show").append(
				"<table class='pattern' id='current-pattern' data-pattern-num='" + patternNum + "' align='center' cellspacing='10px'>" +
				"</table>"
			);

			for(var row = 1; row <= 5; row++) {
				$("#col-current-pattern #current-pattern, #current-pattern-show #current-pattern").append(
					"<tr id='r" + row + "'></tr>"
				);

				for(var col = 1; col <= 5; col++) {
					var cellId = patternNum + "-r" + row + "c" + col;
					var cellStatus = bingo.storage.getItem(cellId);

					if(row == 3 && col == 3)
						$("#col-current-pattern #current-pattern #r" + row + ", #current-pattern-show #current-pattern #r" + row).append(
							"<td class='bonus' id='" + cellId + "'></td>"
						);
					else {
						$("#col-current-pattern #current-pattern #r" + row + ", #current-pattern-show #current-pattern #r" + row).append(
							"<td id='" + cellId + "'></td>"
						);

						if(cellStatus === "marked")
							$("#col-current-pattern #" + cellId + ", #current-pattern-show #" + cellId).addClass("marked");
					}
				}
			}

			var num = patternNum[patternNum.length - 1];
			$("#current-pattern-show").append(
				"<div>" +
				"  <h3>Game " + num + "</h3>" +
				"  <h1 class='pattern-name' id='pattern-" + num + "-name'>" + bingo.storage.getItem("pattern-" + num) + "</h1>" +
				"  <h2>Price: P" + bingo.storage.getItem("pattern-" + num + "-price") + ".00</h2>" +
				"</div>"
			);

			bingo.transitionPage("patterns", "current-pattern-show");
		}
	}
};