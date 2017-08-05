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
				if(row == 3 && col == 3)
					$("#patterns #pattern-block-" + patternNum + " table tr#r" + row).append(
						"<td class='bonus' id='pattern-" + patternNum + "-r" + row + "c" + col + "'></td>"
					);
				else {
					var cellId = "pattern-" + patternNum + "-r" + row + "c" + col;
					var cellStatus = localStorage.getItem(cellId);

					$("#patterns #pattern-block-" + patternNum + " table tr#r" + row).append(
						"<td id='" + cellId + "'></td>"
					);

					if(cellStatus === "marked")
						$("#patterns #" + cellId).addClass("marked");
				}
			}
		}

		var patternName = localStorage.getItem("pattern-" + patternNum);
		var patternPrice = localStorage.getItem("pattern-" + patternNum + "-price");

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
}