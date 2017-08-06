$(document).ready(function() {
	if(typeof(Storage) === "undefine")
		alert("Sorry, your browser does not support local storage");
	else {
		// startup
		bingo.loadCells();
		bingo.startLogoTransition();
		bingo.pattern.loadPatterns();

		// for tracking and recovering recent draw
		bingo.storage.setItem("recent-draw", "null");
		bingo.storage.setItem("draw-before-recent", "null*");

		// go to patterns page
		$("#main #btn-pattern").click(function() {
			bingo.transitionPage("main", "patterns");
		});

		// go to edit page of the chosen pattern
		$("#patterns #btn-edit").click(function() {
			// get the pattern number, ex. "pattern-3"
			var patternNum = $(this).data("pattern-num");

			// enter the edit page
			bingo.pattern.edit(patternNum);
		});

		// go to previous page
		$(".btn-back").click(function() {
			// to determine which page to go back to
			var btnBackId = $(this).attr("id");

			if(btnBackId === "patterns-page")
				bingo.transitionPage("patterns", "main");
			else if(btnBackId === "pattern-edit-page") {
				bingo.transitionPage("pattern-edit", "patterns");
			}
		});

		// mark a cell by click
		$(".bingo-cell").click(function(e) {
		 	//  get the bingo cell id, ex "bingo-cell-g-53"
		 	var cellId = $(this).attr("id");

		 	bingo.draw(cellId);
	 	});

	 	// mark a cell by input
	 	$("#inp-num-search").keypress(function(e) {
	 		// get the keycode
	 		var key = e.which;

		 	if(key == 13) {
		 		var searchInput = $("#inp-num-search").val();

		 		// proceed on clearing if matches clear enter password
		 		if(searchInput === bingo.clearEnterPassword) {
		 			var password = prompt("Enter the password to clear.\nPassword:");

				 	if(password === bingo.password)
				 		bingo.clear();
				 	else
				 		alert("Did not match.");
		 		} else { // update a cell if entered a cell, ex. b13
			 		if(searchInput.length > 0) {
			 			// get the cell id
					 	var cellId = searchInput.substring(0, searchInput.length)

					 	bingo.draw(cellId);

					 	// empty search box after draw
					 	$(this).val("");
			 		}
		 		}
			}
	 	});

	 	// select a pattern for a new game
		$("#patterns #btn-select").click(function() {
			// get the pattern number, ex. "pattern-4"
			var patternNum = $(this).data("pattern-num");
			bingo.pattern.select(patternNum);
		});
		
		// skip current draw view by clicking the page
		$("#current-draw").click(function() {
			bingo.transitionPage("current-draw", "main");
		});

		// skip current pattern view by clicking the page
		$("#current-pattern-show").click(function() {
			bingo.transitionPage("current-pattern-show", "main");
		});
	}
});