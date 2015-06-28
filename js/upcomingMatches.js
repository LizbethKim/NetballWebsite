function populateMatches(tableId){
	var len = newData.length - 1;
	var dat = newData[len].data;
	dat = dat.splice(newData[len].data.length - 8, newData[len].data.length);
	$.each(dat, function(idx, e){
		var tr = $('<tr>');
			$(tr).append($('<td>').text(e.dayNumber + " " + e.month));
			$(tr).append($('<td>').text(e.homeTeam + " vs. " + e.awayTeam));
			$(tr).append($('<td>').text(e.venue));
			$(tableId).append($(tr));
	});
}

function populateScores(tableId){
	var len = newData.length - 1;
	var dat = newData[len].data;
	dat = dat.splice(newData[len].data.length - 8, newData[len].data.length);
	$.each(dat, function(idx, e){
		var tr = $('<tr>')
			.append($('<td>').text(e.dayNumber + " " + e.month));
			$(tr).append($('<td>').text(e.homeTeam));
			$(tr).append($('<td>').text(e.homeTeamScore));
			$(tr).append($('<td>').text(e.awayTeamScore));
			$(tr).append($('<td>').text(e.awayTeam));
			$(tableId).append($(tr));
	});
}