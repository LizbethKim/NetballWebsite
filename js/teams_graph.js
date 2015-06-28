// produce a bargraph for the given team, written to the innerHTML of target
function load_team_bargraph(teamname, target, position) {
    var team = get_team_from_name(teamname);
    var games = get_team_games(get_year(), teamname);
    var empty_acc = { wins: 0, losses: 0, draws: 0, total_points: 0 };
    var fullname = team.region + " " + team.name;

    // count the team stats
    var count_stats = function(acc, e) {
        var our_score, their_score;
        if(e.homeTeam === fullname) {
            our_score = e.homeTeamScore;
            their_score = e.awayTeamScore;
        } else {
            their_score = e.homeTeamScore;
            our_score = e.awayTeamScore;
        }

        if(our_score > their_score)
            acc.wins += 1;
        else if(our_score < their_score)
            acc.losses += 1;
        else
            acc.draws +=1 ;
        acc.total_points += parseInt(our_score, 10);
        return acc;
    };
    var stats = foldl(count_stats, empty_acc, games);

    // convert data to list
    var data =
        [ {name: "Wins", value: stats.wins},
          {name: "Loses", value: stats.losses},
        ];
    if(stats.draws >  0)
        data.push({name: "Draws", value: stats.draws});
    data = data.concat(
        [ {name: "Total Games", value: games.length},
          {name: "Average Points",
           value: (stats.total_points / games.length).toFixed(2) },
          {name: "Total Points", value: stats.total_points}
        ]);

    // draw graph
    $(target).html($('<h2>', {class: 'bargraph_title'}).text('Statistics'));
    d3.select(target)
        .selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .classed("barchart_" + position, true)
        .style("width", function(d) {
            if(d.name === "Total Points")
                return (d.value  / 2.5) + "px";
            else if(d.name == "Average Points")
                return (d.value * 4) + "px";
            else
                return (d.value * 20) + "px";
        })
        .text(function(d) { return d.name + ": " + d.value; });
}
