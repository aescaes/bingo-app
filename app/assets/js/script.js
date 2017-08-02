$(document).ready(function() {
	/****Storage check (start)****/
	if(typeof(Storage) === "undefine")
		alert("Sorry, your browser does not support local storage");
	else {
		var password = "1234";
		loadBingoCells();
		loadPatterns();
		
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

			$("#edit-pattern").data("pattern-num", patternNum);

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

		 		if(option === "edit")
		 			$("#edit-pattern #" + cellId).removeClass("marked");
		 	} else {
		 		localStorage.setItem(cellId, "marked");
		 		$("#" + cellId).addClass("marked");

		 		if(option === "edit")
		 			$("#edit-pattern #" + cellId).addClass("marked");
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

		 //mark a cell by click
		 $(".bingo-cell").click(function() {
		 	// get the bingo cell id
		 	var cellId = $(this).attr("id");

		 	//update cell
		 	updateCell(cellId);
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

				 	updateCell(cellId);

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
				"<table class='pattern' id='edit-pattern' align='center' cellspacing='10px'>" +
				"</table>"
			);

			$("#inp-pattern-name").val(localStorage.getItem(patternNum));

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

			$("#btn-save").click(function() {
				localStorage.setItem(patternNum, $("#inp-pattern-name").val());
				$("#patterns #pattern-block-" + patternNum[patternNum.length - 1] + " h1").html(localStorage.getItem(patternNum));
				transitionPage("pattern-edit", "patterns");
			});
		}
		/****Edit Pattern (end)****/
	}	/****Storage check (end)****/
});