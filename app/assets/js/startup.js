/*
 * Appends the 5 bingo rows (b, i, n, g, o) to page
 */
function loadBingoCells() {
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
			var cellState = localStorage.getItem(cellId);

			//add a 'marked' class to cell if it is in marked state
			if(cellState === "marked")
				$("#" + cellId).addClass("marked");
			else
				//initialize the cell state to unmarked;
				localStorage.setItem(cellId, "unmarked");
		}
	}
}

/*
 * Load pattern slots
 */
function loadPatterns() {
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
				$("#patterns #pattern-block-" + patternNum + " table tr#r" + row).append(
					"<td id='pattern-r" + row + "c" + col + "'></td>"
				);
			}
		}

		$("#patterns #pattern-block-" + patternNum).append(
			"<h1 class='pattern-name' id='pattern-" + patternNum + "-name'>Slot " + patternNum + "</h1>" +
			"<button class='btn' id='btn-edit' data-pattern-num='pattern-" + patternNum + "'>Edit</button>"
		);
	}
}