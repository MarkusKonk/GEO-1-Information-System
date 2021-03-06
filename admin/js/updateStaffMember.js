var selectedItem;

function generateUpdateList() {
	$(".updateautocomplete").on("listviewbeforefilter", function (e, data) {
		var $ul = $(this);                        // $ul refers to the shell unordered list under the input box
		var value = $(data.input).val();        // this is value of what user entered in input box
		var dropdownContent = "";                // we use this value to collect the content of the dropdown
		$ul.html("");                            // clears value of set the html content of unordered list

		// on third character, trigger the drop-down
		if (value && value.length > 2) {
			$('.updateautocomplete').show();
			$ul.html("<li><div><span></span></div></li>");
			$ul.listview("refresh");
			$.each(response, function (index, val) {
				dropdownContent += "<li>" + val + "</li>";
				$ul.html(dropdownContent);
			});
			$ul.listview("refresh");
			$ul.trigger("updatelayout");
		}
	});
	// click to select value of auto-complete
	$(document).on("click", ".updateautocomplete li", function () {
		selectedItem = $(this).html();
		var firstName = selectedItem.split(",")[1];
		var secondName = selectedItem.split(",")[0];
		$('.updateautocomplete').hide();
		fillRoom(selectedItem, firstName, secondName);
	});
}

function fillRoom(name, fs, sn) {
	$('#updateForm').append('<p id = tempPlaceholder>Just a second</p>');
	$.ajax({
		type: "GET",
		url: "../php/getRoom.php?",
		data: "name=" + name
	}).done(function (data) {
		data = JSON.parse(data);
		$('#updateForm').empty();
		$('#updateForm').append('<p id = tempPlaceholder>Use the following fields to update the staff member.</p>');
		$('#updateForm').append('<div>First name: <input type="text" name="" style = "position:absolute; left:12%;" id="updatefirstname" data-clear-btn="true"></div>');
		$('#updateForm').append('<div style = "margin-top:1%">Second name: <input type="text" name="" style = "position:absolute; left:12%;" id="updatesecondname" data-clear-btn="true"></div>');
		$('#updateForm').append('<div style = "margin-top:1%"><p>Please note: Rooms on the basement floor have a special notation, e.g. 0.01 for room number 1 on the basement floor, 0.10 for room number 10 on the basement floor.</p></div>');
		$('#updateForm').append('<div style = "margin-top:1%">Room: <input type="text" name="" style = "position:absolute; left:12%;" id="updateroom" value="" data-clear-btn="true"></div>');
		//$('#updateForm').append('<input type="text" name="" style = "margin-top:1%;" id="updateaff" value="" data-clear-btn="true"></br>');
		$('#updatefirstname').val(fs);
		$('#updatesecondname').val(sn);

		$('#updateroom').val(data.Room);
		$('#updateaff').val(data.Affiliation);
		$('#updateForm').append('<button id = "updateBtn" style = "margin-top:3%;" data-role="button" class="ui-btn ui-btn-inline">Update</button>');
		// bind functionality
		$('#updateBtn').bind('click', function () {
			updateStaffmember(data.Affiliation);
		});
		$('#updateBtn').button();
	});
}

function updateStaffmember(aff) {
	oldName = selectedItem;
	fn = $('#updatefirstname').val();
	sn = $('#updatesecondname').val();
	room = $('#updateroom').val();
	if (checkContentUpdate()) {
		$.post(
				"php/updateStaffMember.php?",
				{
					OldName: oldName.trim(),
					FirstName: fn.trim(),
					LastName: sn.trim(),
					Room: room.trim(),
					Affiliation: aff.trim()
				},
				function (data) {
					console.log(data);
					clearForm();
					getStaff();
					alert("Update successful. Refresh the page in order to adopt the changes in the display section.");
					location.reload();
					$('#updateForm').empty();
				}
		);
	}
}

function checkContentUpdate() {
	updateDataFine = true;
	fn = $('#updatefirstname').val().trim();
	sn = $('#updatesecondname').val().trim();
	if (fn.length == 0) {
		updateDataFine = false;
		alert("First name is missing");
	} else if (sn.length == 0) {
		updateDataFine = false;
		alert("Second name is missing");
	} else if (isNaN(parseFloat($('#updateroom').val()))) {
		updateDataFine = false;
		alert("Room is not a number");
	}
	return updateDataFine;
}
		