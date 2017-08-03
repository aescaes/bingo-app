$(document).ready(function() {
	/****Storage check (start)****/
	if(typeof(Storage) === "undefine")
		alert("Sorry, your browser does not support local storage");
	else {
		var password = "1234";
		loadBingoCells();
		loadPatterns();

		localStorage.setItem("previous-draw", "null");
		localStorage.setItem("previous-before-previous-draw", "null*");
		
		/****Page Transition (start)****/
		/*
		 * Page Transition
		 */
		function transitionPage(currentPage, redirectPage) {
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
		}

		//transition from main page to patterns page
		$("#main #btn-pattern").click(function() {
			transitionPage("main", "patterns");
		});

		//transition from patterns to edit-pattern page
		$("#patterns #btn-edit").click(function() {
			var patternNum = $(this).data("pattern-num");

			editPattern(patternNum);

			transitionPage("patterns", "pattern-edit");
		});

		//transition to previous page
		$(".btn-back").click(function() {
			var btnBackId = $(this).attr("id");

			if(btnBackId === "patterns-page")
				transitionPage("patterns", "main");
			else if(btnBackId === "pattern-edit-page") {
				transitionPage("pattern-edit", "patterns");
			}
		});
		/****Page Transition (end)****/




		/****Bingo Cells (start)****/
		/*
		 * Updates cell state (Marked/Unmarked)
		 */
		function updateCell(cellId, option) {
		 	// get the current state of the cell
		 	var cellState = localStorage.getItem(cellId);

		 	if(cellState === "marked") {
		 		localStorage.setItem(cellId, "unmarked");
		 		$("#" + cellId).removeClass("marked");

		 		if(option === "edit") {
		 			$("#edit-pattern #" + cellId).removeClass("marked");
		 			$("#patterns #" + cellId).removeClass("marked");
		 		}
		 	} else {
		 		localStorage.setItem(cellId, "marked");
		 		$("#" + cellId).addClass("marked");

		 		if(option === "edit") {
		 			$("#edit-pattern #" + cellId).addClass("marked");
		 			$("#patterns #" + cellId).addClass("marked");
		 		}
		 	}
		 }

		 /*
		  * Reset Bingo cell states to unmarked
		  */
		function clearBingo() {
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
		  		localStorage.setItem(cellId, "unmarked");
		  	}
		  }

		  function updateDraw(cellId) {
		  	if($("#" + cellId).attr("class") !== "bingo-cell marked") {
		 		$("#main #current-draw-number").html(localStorage.getItem("previous-draw"));
		  	} else {
		  		if(localStorage.getItem("null-previous-before-previous-draw") === "yes")
		  			localStorage.setItem("previous-before-previous-draw", "null*");

		 		var cellLetter = $("#" + cellId).parent().closest("div").attr("id");
		 		cellLetter = cellLetter[cellLetter.length - 1];

		 		var currentDraw = cellLetter + "-" + $("#" + cellId).html();

		 		$("#current-draw #number").html(currentDraw);
		 		transitionPage("main", "current-draw");

		 		setTimeout(function() {
			 		transitionPage("current-draw", "main");
			 		$("#main #current-draw-number").html(currentDraw);
			 	}, 1000);
		 	}
		  }

		  function draw(cellId) {
		  	if($("#" + cellId).attr("style") !== "pointer-events: none") {
		  		if($("#" + cellId).attr("class") !== "bingo-cell marked") {
			 		var previousDrawId = localStorage.getItem("previous-draw-id");

			 		if($("#" + previousDrawId).attr("class") === "bingo-cell marked")
			  			$("#" + previousDrawId).attr("style", "pointer-events: none");

			 		localStorage.setItem("previous-draw-id", cellId);

			 		var previousDraw = localStorage.getItem("previous-draw");
	 				var previousBeforePreviousDraw = localStorage.getItem("previous-before-previous-draw");

	 				if(previousBeforePreviousDraw === previousDraw) {
	 					localStorage.setItem("previous-draw", previousDraw);
	 					localStorage.setItem("null-previous-before-previous-draw", "yes");
	 				} else {
		 				localStorage.setItem("previous-draw", $("#current-draw #number").html());
		 				localStorage.setItem("null-previous-before-previous-draw", "no");
	 				}
			 	} else {
			 		var previousDraw = localStorage.getItem("previous-draw");
			 		var previousBeforePreviousDraw = localStorage.getItem("previous-before-previous-draw");
					
					localStorage.setItem("previous-before-previous-draw", previousDraw);
			 	}

			 	updateCell(cellId);
			 	updateDraw(cellId, previousBeforePreviousDraw, previousDraw);
			 }
		  } 

		 //mark a cell by click
		 $(".bingo-cell").click(function(e) {
		 	// get the bingo cell id
		 	var cellId = $(this).attr("id");
		 	draw(cellId);
		 });

		 //mark a cell by input
		 $("#inp-num-search").keypress(function(e) {
		 	var key = e.which;

		 	if(key == 13) {
		 		var searchInput = $("#inp-num-search").val();

		 		if(searchInput.length > 0) {
				 	var cellLetter = searchInput[0];

				 	var cellNumber;
				 	if(searchInput.length == 2)
					 	cellNumber = searchInput[1];
					else
						cellNumber = searchInput[1] + searchInput[2];

				 	var cellId = "bingo-cell-" + cellLetter + "-" + cellNumber;

				 	draw(cellId);

				 	$(this).val("");
		 		}
			}
		 });

		 //reset bingo
		 $("#btn-reset").click(function() {
		 	var pass = prompt("Enter the password to reset.\nPassword:");

		 	if(pass === password)
		 		clearBingo();
		 	else
		 		alert("Did not match.");
		 });
		/****Bingo Cells (end)****/




		/****Edit Pattern (start)****/
		function savePattern(name, patternNum) {
			var pass = prompt("Enter the password to save.\nPassword:");

			if(pass !== password)
				alert("Did not match.");
			else {

			}
		}

		function editPattern(patternNum) {
			$("#pattern-edit").append(
				"<table class='pattern' id='edit-pattern' data-pattern-num='" + patternNum + "' align='center' cellspacing='10px'>" +
				"</table>"
			);

			$("#inp-pattern-name").val(localStorage.getItem(patternNum));
			$("#inp-pattern-price").val(localStorage.getItem(patternNum + "-price"));

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
						var cellStatus = localStorage.getItem(cellId);

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

				updateCell(cellId, "edit");
			});

			$("#pattern-edit div input").keyup(function() {
				var patternNum = $("#pattern-edit #edit-pattern").data("pattern-num");

				localStorage.setItem(patternNum, $("#inp-pattern-name").val());
				localStorage.setItem(patternNum + "-price", $("#inp-pattern-price").val());

				$("#patterns div #" + patternNum + "-name").html(localStorage.getItem(patternNum));
				$("#patterns div #" + patternNum + "-price").html("Price: P" + localStorage.getItem(patternNum + "-price") + ".00");
			});
		}
		/****Edit Pattern (end)****/




		/****Select Pattern (start)****/
		function selectPattern(patternNum) {
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
					var cellStatus = localStorage.getItem(cellId);

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
				"  <h1 class='pattern-name' id='pattern-" + num + "-name'>" + localStorage.getItem("pattern-" + num) + "</h1>" +
				"  <h2>Price: P" + localStorage.getItem("pattern-" + num + "-price") + ".00</h2>" +
				"</div>"
			);

			transitionPage("patterns", "current-pattern-show");

			setTimeout(function() {
				transitionPage("current-pattern-show", "main");
			}, 5000);
		}

		$("#patterns #btn-select").click(function() {
			var patternNum = $(this).data("pattern-num");
			selectPattern(patternNum);
		});
		/****Select Pattern (end)****/




		/****Logo Transition (start)****/

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
		
		/****Logo Transition (end)****/
	}	/****Storage check (end)****/
});