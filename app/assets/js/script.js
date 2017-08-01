$(document).ready(function() {
	loadBingoCells();

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
});