function meow(list, list2){
	// var nzList = isNZ(list);
	// for (var i = 0; i < nzList.length; i++){
	// 	console.log(nzList[i].name);
	// }
	// var datList = filter(function(e) {return e.round === "1"}, list2);
	// for (var i = 0; i < datList.length; i++){
	// 	console.log(datList[i].homeTeam);
	// }
	// var mew = containsPrime(list, list2, function(e, f) {return e.homeTeam === f.name || e.awayTeam === f.name});
	// for (var i = 0; i < mew.length; i++){
	// 	console.log(mew[i].homeTeam + " Home | Away " + mew[i].awayTeam);
	// }
	// var teamScoreList = teamScores(list, list2);
	// console.log(teamScoreList.length);
	// for(var i = 0; i < teamScoreList.length; i++){
	// 	printDic(teamScoreList[i]);
	// 	console.log("\n");
	// }
	// var homeCourt = homeCourtAdvantage(list, list2);
	// for (var i = 0; i < homeCourt.length; i++){
	// 	printDic(homeCourt[i]);
	// }
	// var interC = interCountry(list, list2);
	// for (var i = 0; i < interC.length; i++){
	// 	printDic(interC[i]);
	// }
	// console.log(newData.length);
}

function printDic(dictionary){
	for (var key in dictionary){
		console.log(key + " = " + dictionary[key]);
	}
}

function homeCourtAdvantage(season, teams){
	var ret = [];
	for (var i = 0; i < teams.length; i++){
		var homeWin = 0;
		var awayWin = 0;
		var teamGame = teamGames(season, teams[i]);
		for (var j = 0; j < teamGame.length; j++){
			if (teamGame[j].homeTeam === teams[i].name){
				if (teamGame[j].homeTeamScore > teamGame[j].awayTeamScore) homeWin++;
			} else {
				if (teamGame[j].awayTeamScore > teamGame[j].homeTeamScore) awayWin++;
			}
		}
		ret.push({ "name" : teams[i].name,
				   "homeWins" : homeWin,
				   "awayWins" : awayWin,
				   "totalGames" : teamGame.length});
	}
	return ret;
}

function interCountry(season, teams){
	var ret = [];
	for (var i = 0; i < teams.length; i++){
		var internationalWin = 0;
		var internationalLoss = 0;
		var teamGame = teamGames(season, teams[i]);
		for (var j = 0; j < teamGame.length; j++){
			if (interWin(teamGame[j], teams[i], teams)) internationalWin++;
			if (interLose(teamGame[j], teams[i], teams)) internationalLoss++;
		}
		ret.push({"name" : teams[i].name, "interWin" : internationalWin, "interLoss" : internationalLoss});
	}
	return ret;
}

function interWin(game, team, teams){
	var match = teamMatch(game, team);
	if (team.location != filter(function(e) {e.name === match.opponent}, teams).location) return match.teamScore > match.opponentScore;
	return false;
}

function interLose(game, team, teams){
	var match = teamMatch(game, team);
	if (team.location != filter(function(e) {e.name === match.opponent}, teams).location) return match.teamScore < match.opponentScore;
	return false;
}

function teamMatch(game, team){
	if (game.homeTeam === team.name) return {"team" : game.homeTeam, "teamScore" : game.homeTeamScore, "opponent" : game.awayTeam, "opponentScore" : game.awayTeamScore};
	return {"team" : game.awayTeam, "teamScore" : game.awayTeamScore, "opponent" : game.homeTeam, "opponentScore" : game.homeTeamScore};
}

function teamGames(season, team){
	return filter(function(e) {return e.awayTeam === team.name || e.homeTeam === team.name}, season);
}

function teamScores(season, teams){
	var teamStats = [];
	for (var i = 0; i < teams.length; i++){
		var teamGame = teamGames(season, teams[i]);
		teamStats.push(teamAddUp(teamGame, teams[i]));
	}
	return teamStats;
}

function teamAddUp(gameList, team){
	var wins = 0;
	var draw = 0;
	var loss = 0;
	var totalGoals = 0;
	for (var i = 0; i < gameList.length; i++){
		if (gameList[i].round === "Bye") continue;
		if (gameList[i].homeTeam === team.name){
			totalGoals += gameList[i].homeTeamScore;
			if (gameList[i].homeTeamScore > gameList[i].awayTeamScore) wins++;
			else if (gameList[i].homeTeamScore == gameList[i].awayTeamScore) draw++;
			else {loss++;}
		} else {
			totalGoals += gameList[i].awayTeamScore;
			if (gameList[i].homeTeamScore > gameList[i].awayTeamScore) loss++;
			else if (gameList[i].homeTeamScore == gameList[i].awayTeamScore) draw++;
			else {wins++;}
		}
	}
	return { "name": team.name, "totalGoals": totalGoals, "wins": wins, "loss": loss, "draw": draw, "points": calcPoints(wins, draw, loss) };
}

function calcPoints (wins, draw, loss){
	return (wins*2 + draw);
}

function isNZ(teams){
	return filter(function (e) {return e.location === "New Zealand"}, teams);
}

function isAus(teams){
	return filter(function (e) {return e.location === "Australia"}, teams);
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
