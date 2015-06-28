// load all of the teams stored in LIST into $(element)
function populate_team_select(element, list) {
    $(element).empty();
    $.each(list, function(idx, team) {
        $(element)
            .append($('<option>', {value: team.name.toLowerCase()})
                .text(team.region + " " + team.name))
    });
}

// load all of the teams in to $(element)
function select_load_teams(element) {
    populate_team_select(element, teams);
}

// load all the teams into $(element2) except for the teams selected
// by $(element1)
function select_load_teams_sub(element1, element2) {
    var team_name = $(element1).val();
    var new_teams =
        filter(function(e) { return e.name.toLowerCase() !== team_name; },
                teams);
    populate_team_select(element2, new_teams);
}

// load all the teams into $(element) except the one at idx
function select_load_teams_remove(idx, element) {
    populate_team_select(element, remove_at(idx, teams));
}

// update the blurb area of $(blurb), setting it to the blub of the
// selected team of $(element)
function update_blurb(element, blurb) {
    var teamname = $(element).val();
    var elem = find(function(e) { return e.name.toLowerCase() === teamname }, teams);
    $(blurb).text(elem.blurb);
}

// update all other_elements based on the value of element, also set
// blurb to the blurb for the team selected by element
function update_team_select(element, other_elements, blurb, graph, pos, logo,
        linegraph) {
    $.each(other_elements, function(idx, e) {
        var v = $(e).val();
        select_load_teams_sub(element, e);
        $(e).val(v);
    });
    update_blurb(element, blurb);
    load_team_bargraph($(element).val(), graph, pos);
    update_image(element, logo);
    load_team_linegraph($("#selectTeam1").val(),
            $("#selectTeam2").val(), "#teamABLineGraph");
}

function update_image(element, logo){
    $(logo).attr("src", "img/" + $(element).val() + ".png");
}

// get all the games a team has played
function get_team_games(year, teamname) {
    var data_list = find(function(e) { return e.year == year; }, newData).data;
    var team = get_team_from_name(teamname);
    var fullname = team.region + " " + team.name;
    return filter(function(e){
            return e.homeTeam === fullname || e.awayTeam === fullname;
        }, data_list);

}

// returns the team object from the name
function get_team_from_name(teamname) {
    return find(function(e) { return e.name.toLowerCase() === teamname; },
            teams);
}

// get a years standings
function year_standings(year) {
    var data = find(function(e) { return e.year == year; }, newData).data;
    var make_score = function(acc, e) {
        if(!acc[e.homeTeam]) acc[e.homeTeam] = 0;
        if(!acc[e.awayTeam]) acc[e.awayTeam] = 0;
        if(e.homeTeamScore > e.awayTeamScore)
            acc[e.homeTeam] += 2;
        else if(e.homeTeamScore < e.awayTeamScore)
            acc[e.awayTeam] += 2;
        else {
            acc[e.homeTeam] += 1;
            acc[e.awayTeam] += 1;
        }

        return acc;
    };
    var folded = foldl(make_score, {}, data);
    var sorted = sort(function(a, b) {
        return folded[a] > folded[b];
    }, Object.keys(folded));
    return foldl(function(acc, e) {
        if(folded[e] == acc.last)
            acc.step += 1;
        else
            acc.step = 0;
        acc.dict[e] = acc.count - acc.step;
        acc.last = folded[e];
        acc.count += 1;
        return acc;
    }, {dict: {}, last: -1, count: 1, step: 0}, sorted).dict;
}

// get all years standings
function all_year_standings() {
    return map(function(e) {
            return {year: e.year,
                    standings: year_standings(e.year)
                   }
        }, newData);
}

// returns a list of years and standings for a team
function team_all_standings(teamname) {
    return map(function(e) {
        return { year: e.year,
                 standing: e.standings[teamname]
               }
    }, all_year_standings());
}
