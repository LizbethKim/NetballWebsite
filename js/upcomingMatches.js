function populateMatches(tableId){
	var len = newData.length - 1;
	var data = newData[len].data;
	data = data.splice(newData[len].data.length - 8, newData[len].data.length);
	$.each(data, function(idx, e){
		var tr = $('<tr>');
			$(tr).append($('<td>').text(e.dayNumber + " " + e.month));
			$(tr).append($('<td>').text(e.homeTeam + " vs. " + e.awayTeam));
			$(tr).append($('<td>').text(e.venue));
			$(tableId).append($(tr));
	})
}