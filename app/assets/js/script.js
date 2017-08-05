$(document).ready(function() {
	var bingo = {
		password: "1234",
		storage: localStorage,
		loadCells: function() {
			for(var c = 1; c <= 5; c++) {
				var bingoLetter = '';

				//set the right letter for each bingo row
				if(c == 1) bingoLetter = 'b';
				else if(c == 2) bingoLetter = 'i';
				else if(c == 3) bingoLetter = 'n';
				else if(c == 4) bingoLetter = 'g';
				else if(c == 5) bingoLetter = 'o';

				//append current row
				$("#row-bingo").append(
					"<div class='bingo-row' id='bingo-" + bingoLetter + "'></div>"
				);

				//check the bingo row start number
				var rowCellStartNum = 0;
				if(bingoLetter === 'b') rowCellStartNum = 1;
				else if(bingoLetter === 'i') rowCellStartNum = 16;
				else if(bingoLetter === 'n') rowCellStartNum = 31;
				else if(bingoLetter === 'g') rowCellStartNum = 46;
				else if(bingoLetter === 'o') rowCellStartNum = 61;

				//append primary cell to current row
				$("#bingo-" + bingoLetter).append(
						"<div class='bingo-cell primary-cell' id='bingo-cell-b'>" + bingoLetter + "</div>"
				);

				//append number cells to current row
				for(var cellNum = rowCellStartNum; cellNum <= rowCellStartNum + 14; cellNum++) {
					$("#bingo-" + bingoLetter).append(
						"<div class='bingo-cell' id='bingo-cell-" + bingoLetter + "-" + cellNum + "'>" + cellNum + "</div>"
					);

					//get the id of the current cell
					var cellId = "bingo-cell-" + bingoLetter + "-" + cellNum;

					//determine the cell state (Marked/Unmarked)
					var cellState = this.storage.getItem(cellId);

					//add a 'marked' class to cell if it is in marked state
					if(cellState === "marked")
						$("#" + cellId).addClass("marked");
					else
						//initialize the cell state to unmarked;
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
	  	var bingoCellCount = $(".bingo-cell").length;
	  	var letter; //for getting the current letter
	  	var cellId;

	  	//remove each item
	  	for(var num = 1; num <= (bingoCellCount - 5); num++) { // where 5 is for b, i, n, g, o
	  		//determine the letter
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

	  		//get the cell id
	  		cellId = "bingo-cell-" + letter + "-" + num;

	  		//unmark cell by removing the 'marked' class
	  		$("#" + cellId).removeClass("marked");
	  		this.storage.setItem(cellId, "unmarked");
	  	}

	  	location.reload();
  	},
		transitionPage: function(currentPage, redirectPage) {
			$("#" + currentPage).fadeOut("slow", function() {
				$("#" + redirectPage).css("display", "flex");

				if(redirectPage === "main") 
					$(".btn-float").hide();
				else
					$(".btn-float").show();

				if(currentPage === "pattern-edit")
					$("#pattern-edit table#edit-pattern").remove();

				$("#" + redirectPage).fadeIn("slow");
			});	
		},
		updateCell: function(cellId, option) {
		 	// get the current state of the cell
		 	var cellState = this.storage.getItem(cellId);

		 	if(cellState === "marked") {
		 		this.storage.setItem(cellId, "unmarked");
		 		$("#" + cellId).removeClass("marked");

		 		if(option === "edit") {
		 			$("#edit-pattern #" + cellId).removeClass("marked");
		 			$("#patterns #" + cellId).removeClass("marked");
		 		}
		 	} else {
		 		this.storage.setItem(cellId, "marked");
		 		$("#" + cellId).addClass("marked");

		 		if(option === "edit") {
		 			$("#edit-pattern #" + cellId).addClass("marked");
		 			$("#patterns #" + cellId).addClass("marked");
		 		}
		 	}
		},
		updateDraw: function(cellId) {
	  	if($("#" + cellId).attr("class") !== "bingo-cell marked") {
	 		$("#main #current-draw-number").html(this.storage.getItem("previous-draw"));
	  	} else {
	  		if(this.storage.getItem("null-previous-before-previous-draw") === "yes")
	  			this.storage.setItem("previous-before-previous-draw", "null*");

		 		var cellLetter = $("#" + cellId).parent().closest("div").attr("id");
		 		cellLetter = cellLetter[cellLetter.length - 1];

		 		var currentDraw = cellLetter + "-" + $("#" + cellId).html();

		 		$("#current-draw #number").html(currentDraw);
	 			this.transitionPage("main", "current-draw");

		 		setTimeout(function() {
			 		bingo.transitionPage("current-draw", "main");
			 		$("#main #current-draw-number").html(currentDraw);
			 	}, 10000);
	 		}
  	},
  	draw: function(cellId) {
			if($("#" + cellId).attr("style") !== "pointer-events: none") {
				if($("#" + cellId).attr("class") !== "bingo-cell marked") {
					var previousDrawId = this.storage.getItem("previous-draw-id");

					if($("#" + previousDrawId).attr("class") === "bingo-cell marked")
						$("#" + previousDrawId).attr("style", "pointer-events: none");

					this.storage.setItem("previous-draw-id", cellId);

					var previousDraw = localStorage.getItem("previous-draw");
					var previousBeforePreviousDraw = localStorage.getItem("previous-before-previous-draw");

					if(previousBeforePreviousDraw === previousDraw) {
						this.storage.setItem("previous-draw", previousDraw);
						this.storage.setItem("null-previous-before-previous-draw", "yes");
					} else {
						this.storage.setItem("previous-draw", $("#current-draw #number").html());
						this.storage.setItem("null-previous-before-previous-draw", "no");
					}
				} else {
					var previousDraw = this.storage.getItem("previous-draw");
					var previousBeforePreviousDraw = this.storage.getItem("previous-before-previous-draw");

					localStorage.setItem("previous-before-previous-draw", previousDraw);
				}

				this.updateCell(cellId);
				this.updateDraw(cellId, previousBeforePreviousDraw, previousDraw);
			}
		},
		pattern: {
			loadPatterns: function() {
				var numOfPattern = 8;

				for(var patternNum = 1; patternNum <= numOfPattern; patternNum++) {
					$("#patterns").append(
						"<div id='pattern-block-" + patternNum + "'>" +
						"  <table class='pattern' id='pattern-" + patternNum + "' align='center' cellspacing='10px'>" +
						"  </table>" +
						"</div>"
					);

					for(var row = 1; row <= 5; row++) {
						$("#patterns #pattern-block-" + patternNum + " table").append(
							"<tr id='r" + row + "'></tr>"
						);

						for(var col = 1; col <= 5; col++) {
							if(row == 3 && col == 3)
								$("#patterns #pattern-block-" + patternNum + " table tr#r" + row).append(
									"<td class='bonus' id='pattern-" + patternNum + "-r" + row + "c" + col + "'></td>"
								);
							else {
								var cellId = "pattern-" + patternNum + "-r" + row + "c" + col;
								var cellStatus = bingo.storage.getItem(cellId);

								$("#patterns #pattern-block-" + patternNum + " table tr#r" + row).append(
									"<td id='" + cellId + "'></td>"
								);

								if(cellStatus === "marked")
									$("#patterns #" + cellId).addClass("marked");
							}
						}
					}

					var patternName = bingo.storage.getItem("pattern-" + patternNum);
					var patternPrice = bingo.storage.getItem("pattern-" + patternNum + "-price");

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

				setTimeout(function() {
					bingo.transitionPage("current-pattern-show", "main");
				}, 20000);
			}
		}
	};

	if(typeof(Storage) === "undefine")
		alert("Sorry, your browser does not support local storage");
	else {
		bingo.loadCells();
		bingo.startLogoTransition();
		bingo.pattern.loadPatterns();
		bingo.storage.setItem("previous-draw", "null");
		bingo.storage.setItem("previous-before-previous-draw", "null*");

		//transition from main page to patterns page
		$("#main #btn-pattern").click(function() {
			bingo.transitionPage("main", "patterns");
		});

		//transition from patterns to edit-pattern page
		$("#patterns #btn-edit").click(function() {
			var patternNum = $(this).data("pattern-num");

			bingo.pattern.edit(patternNum);

			bingo.transitionPage("patterns", "pattern-edit");
		});

		//transition to previous page
		$(".btn-back").click(function() {
			var btnBackId = $(this).attr("id");

			if(btnBackId === "patterns-page")
				bingo.transitionPage("patterns", "main");
			else if(btnBackId === "pattern-edit-page") {
				bingo.transitionPage("pattern-edit", "patterns");
			}
		});

		//mark a cell by click
		$(".bingo-cell").click(function(e) {
		 	// get the bingo cell id
		 	var cellId = $(this).attr("id");
		 	bingo.draw(cellId);
	 	});

	 	//mark a cell by input
	 	$("#inp-num-search").keypress(function(e) {
	 		var key = e.which;

		 	if(key == 13) {
		 		var searchInput = $("#inp-num-search").val();

		 		if(searchInput === "0000") {
		 			var password = prompt("Enter the password to reset.\nPassword:");

				 	if(password === bingo.password)
				 		bingo.clear();
				 	else
				 		alert("Did not match.");
		 		} else {
			 		if(searchInput.length > 0) {
					 	var cellLetter = searchInput[0];

					 	var cellNumber;
					 	if(searchInput.length == 2)
						 	cellNumber = searchInput[1];
						else
							cellNumber = searchInput[1] + searchInput[2];

					 	var cellId = "bingo-cell-" + cellLetter + "-" + cellNumber;

					 	bingo.draw(cellId);

					 	$(this).val("");
			 		}
		 		}
			}
	 	});

		$("#patterns #btn-select").click(function() {
			var patternNum = $(this).data("pattern-num");
			bingo.pattern.select(patternNum);
		});
		
		$("#current-draw").click(function() {
			bingo.transitionPage("current-draw", "main");
		});

		$("#current-pattern-show").click(function() {
			bingo.transitionPage("current-pattern-show", "main");
		});
	}
});