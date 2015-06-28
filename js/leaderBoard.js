function findLatestYear(){
	return newData[newData.length-1].year;
}

function teamStandings(){
	var teamList = [];
	var lYear = findLatestYear();
	var dataSet = find(function (e) {return e.year == lYear}, newData).data;
	for (var i = 0; i < teams.length; i++){
		teamList.push({ "name" : teams[i].region + " " + teams[i].name, "points" : 0});
	}
	console.log(dataSet.length);
	for (var i = 0; i < dataSet.length; i++){
		if (dataSet[i].homeTeamScore > dataSet[i].awayTeamScore) 
			find(function(e){return e.name === dataSet[i].homeTeam}, teamList).points += 2;
		else if (dataSet[i].awayTeamScore > dataSet[i].homeTeamScore) 
			find(function(e){return e.name === dataSet[i].awayTeam}, teamList).points += 2;
		else {
			find(function(e){return e.name === dataSet[i].homeTeam}, teamList).points += 1;
			find(function(e){return e.name === dataSet[i].awayTeam}, teamList).points += 1;
		}
	}

	return sort(function(e, f){return e.points > f.points}, teamList);
}

function populateTable(tableId){
	$.each(teamStandings(), function(idx, e){
		var tr = $('<tr>')
			.append($('<td>').text(e.name));
		$(tr).append($('<td>').text(e.points));
		$(tableId).append($(tr));
	});
}