function meow(list, list2){
	// var nzList = isNZ(list);
	// for (var i = 0; i < nzList.length; i++){
	// 	console.log(nzList[i].name);
	// }
	// var datList = filter(function(e) {return e.round === "1"}, list2);
	// for (var i = 0; i < datList.length; i++){
	// 	console.log(datList[i].homeTeam);
	// }
	var mew = containsPrime(list, list2, function(e, f) {return e.homeTeam === f.name || e.awayTeam === f.name});
	for (var i = 0; i < mew.length; i++){
		console.log(mew[i].homeTeam + " Home | Away " + mew[i].awayTeam);
	}
	var teamScoreList = teamScores(list, list2);
	console.log(teamScoreList.length);
	for(var i = 0; i < teamScoreList.length; i++){
		for (var key in teamScoreList[i]){
			console.log(key + " = " + teamScoreList[key]);
		}
		console.log("\n");
	}
}

function teamScores(season, teams){
	var teamStats = [];
	for (var i = 0; i < teams.length; i++){
		var teamGames = filter(season, function(e) {return e.awayTeam === teams[i].name || e.homeTeam === teams[i].name});
		teamStats.push(teamAddUp(teamGames, teams[i].name));
	}
	return teamStats;
}

function teamAddUp(gameList, teamName){
	var wins = 0;
	var draw = 0;
	var loss = 0;
	var totalGoals = 0;
	for (var i = 0; i < gameList.length; i++){
		if (gameList[i].round === "Bye") continue;
		if (gameList[i].homeTeam === teamName){
			totalGoals += gameList[i].homeTeamScore;
			if (gameList[i].homeTeamScore > gameList[i].awayTeamScore) wins++;
			else if (gameList[i].homeTeamScore == gameList[i].awayTeamScore) draw++;
			else {loss++;}
		} else {
			totalGoals += gameList[i].awayTeamScore;
			if (gameList[i].homeTeamScore > gameList[i].awayTeamScore) loss++;
			else if (gameList[i].homeTeamScore == gameList[i].awayTeamScore) draw++;
			else {win++;}
		}
	}
	console.log("TeamName: " + teamName + " TotalGoals: " + totalGoals + " Wins: " + wins + " Loss: " + loss + " Points: " + calcPoints(wins,loss,draw));
	return { "name": teamName, "totalGoals": totalGoals, "wins": wins, "loss": loss, "draw": draw, "points": calcPoints(wins, draw, loss) };
}

function calcPoints (wins, draw, loss){
	return (wins*2 + draw);
}

function isNZ(teams){
	return filter(teams, function (e) {return e.location == "New Zealand"});
}

function filter (list, func) {
	var ret = [];
	for (var i = 0; i < list.length; i++){
		if (func(list[i]))
			ret.push(list[i]);
	}
	return ret;
}

function containsPrime (list, list2, func) {
	var ret = [];
	for (var i = 0; i < list.length; i++){
		for (var j = 0; j < list2.length; j++){
			if (func(list[i], list2[j])){
				ret.push(list[i]);
			}
		}
	}
	return ret;
}