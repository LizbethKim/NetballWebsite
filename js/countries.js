function headToHead(year){
	var dat = find(function(e){return e.year == year}, newData).data;
	var nzTeams = filterByCountry(teams, "NZ");
	var ausTeams = filterByCountry(teams, "AUS");
	var nzGames = getCountryMatches(dat, nzTeams);
	var ausGames = getCountryMatches(dat, ausTeams);
	return intersect(nzGames, ausGames);
}

function filterByCountry(list, country){
	return filter(function(e){
		return e.country === country;
	}, list);
}

function getCountryMatches(list, countryList){
	return filter(function(e){
		return find(function(f){
			return e.awayTeam === (f.region + " " + f.name) || e.homeTeam === (f.region + " " + f.name);
		}, countryList);
	}, list);
}

function intersect(lista, listb){
	var ret = [];
	for (var i = 0; i < lista.length; i++){
		for (var j = 0; j < listb.length; j++){
			if (lista[i] == listb[j]) {
				ret.push(lista[i]);
				break;
			}
		}
	}
	return ret;
}

function getCountryWins(list, country){
	var countryList = filterByCountry(teams, country);
	var wins = 0;
	for (var i = 0; i < list.length; i++){
		for (var j = 0; j < countryList.length; j++){
			var name = countryList[j].region + " " + countryList[j].name;
			if (list[i].awayTeam === name){
				if (list[i].awayTeamScore > list[i].homeTeamScore) wins++;
				break;
			} else if (list[i].homeTeam === name){
				if (list[i].homeTeamScore > list[i].awayTeamScore) wins++;
				break;
			}
		}
	}
	return wins;
}

function getGoalsScored(list, country){
	var countryList = filterByCountry(teams, country);
	var goals = +0;
	for (var i = 0; i < list.length; i++){
		for (var j = 0; j < countryList.length; j++){
			var name = countryList[j].region + " " + countryList[j].name;
			if (list[i].awayTeam === name){
				goals += +list[i].awayTeamScore;
				break;
			} else if (list[i].homeTeam === name){
				goals += +list[i].homeTeamScore;
				break;
			}
		}
	}
	return goals;
}