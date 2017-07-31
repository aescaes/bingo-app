$(document).ready(function() {
	//append the 5 bingo rows (b, i, n, g, o)
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
				"<div class='bingo-col primary-cell' id='bingo-cell-b'>" + bingoLetter + "</div>"
			);

		//append number cells to current row
		for(var cellNum = rowCellStartNum; cellNum <= rowCellStartNum + 14; cellNum++) {
			$("#bingo-" + bingoLetter).append(
				"<div class='bingo-col' id='bingo-cell-b-" + cellNum + "'>" + cellNum + "</div>"
			);
		}
	}
});