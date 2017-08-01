$(document).ready(function() {
	/****Storage check (start)****/
	if(typeof(Storage) === "undefine")
		alert("Sorry, your browser does not support local storage");
	else {
		loadBingoCells();
		
		{	/****Page Transition (start)****/
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

					$("#" + redirectPage).fadeIn("slow");
				});	
			}

			//transition from main page to patterns page
			$("#main #btn-pattern").click(function() {
				transitionPage("main", "patterns");
			});

			//transition from patterns to add-pattern page
			$("#patterns #btn-add").click(function() {
				transitionPage("patterns", "pattern-add");
			});

			//transition to previous page
			$(".btn-back").click(function() {
				var btnBackId = $(this).attr("id");

				if(btnBackId === "patterns-page")
					transitionPage("patterns", "main");
				else if(btnBackId === "pattern-add-page")
					transitionPage("pattern-add", "patterns");
			});
		}	/****Page Transition (end)****/




		{	/****Bingo Cells (start)****/
			/*
			 * Updates cell state (Marked/Unmarked)
			 */
			 function updateCell(cellId) {
			 	// get the current state of the cell
			 	var cellState = localStorage.getItem(cellId);

			 	if(cellState === "marked") {
			 		localStorage.setItem(cellId, "unmarked");
			 		$("#" + cellId).removeClass("marked");
			 	} else {
			 		localStorage.setItem(cellId, "marked");
			 		$("#" + cellId).addClass("marked");
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
			 	var password = prompt("Enter the password to reset.\nPassword:");

			 	if(password === "1234")
			 		clearBingo();
			 	else
			 		alert("The input was invalid.");
			 });
		}	/****Bingo Cells (end)****/
	}	/****Storage check (end)****/
});