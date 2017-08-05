$(document).ready(function() {
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