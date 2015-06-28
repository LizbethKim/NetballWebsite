var svg_namespace = "http://www.w3.org/2000/svg";

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


// produce a line graph, written to the innerHTML of target
function load_team_linegraph(teamname, target) {
    var team = get_team_from_name(teamname);
    var fullname = team.region + " " + team.name;
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;
    var standings = team_all_standings(fullname);

    var x_tick = width / (standings.length - 1);
    var y_max = listmax(map(function(e) {
            return e.standing;
        }, standings));
    var y_tick = height / y_max;

    var valueline = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return x(d.standing); });

    $(target).html($('<h2>', {class: 'bargraph_title'}).text('Standings'));
    var svg = document.createElementNS(svg_namespace, "svg");
    $(svg).attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    var g = document.createElementNS(svg_namespace, "g");
    // add global transform
    $(svg).append($(g).attr("transform", "translate(" + margin.left + ", " +
                                         margin.top + ")"));
    // add background rectangle
    $(g).append($(document.createElementNS(svg_namespace, 'rect'))
            .attr("width", width)
            .attr("height", height)
            .attr("style", "fill: white; opacity: 0.25"));
    $.each(standings.slice(1, standings.length), function(idx, v) {
        $(g).append($(document.createElementNS(svg_namespace, 'line'))
            .attr("x1", "" + Math.floor(idx * x_tick))
            .attr("y1", "" + Math.floor(standings[idx].standing * y_tick - y_tick))
            .attr("x2", "" + Math.floor((idx + 1) * x_tick))
            .attr("y2", "" + Math.floor(v.standing * y_tick - y_tick))
            .attr("style", "stroke: blue; stroke-width: 2;"));
    });
    // x-axis
    $(g).append($(document.createElementNS(svg_namespace, 'line'))
            .attr("x1", -1)
            .attr("y1", height + 1)
            .attr("x2", width)
            .attr("y2", height + 1)
            .attr("style", "stroke: black; stroke-width: 2;"));
    for(var i = 0; i <= width; i += x_tick) {
        $(g).append($(document.createElementNS(svg_namespace, 'line'))
                .attr("x1", i - 1)
                .attr("y1", height)
                .attr("x2", i - 1)
                .attr("y2", height + 5)
                .attr("style", "stroke: black; stroke-width: 2;"));
        $(g).append($(document.createElementNS(svg_namespace, 'text'))
                .attr("x", i - 1)
                .attr("y", height + 20)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .attr("style", "font: Helvetica, Arial, sans-serif")
                .text(standings[i/x_tick].year));
    }
    // y-axis
    $(g).append($(document.createElementNS(svg_namespace, 'line'))
            .attr("x1", -1)
            .attr("y1", -1)
            .attr("x2", -1)
            .attr("y2", height+1)
            .attr("style", "stroke: black; stroke-width: 2;"));
    for(var i = 0; i < height; i += y_tick * 2) {
        $(g).append($(document.createElementNS(svg_namespace, 'line'))
                .attr("x1", 0)
                .attr("y1", i)
                .attr("x2", -5)
                .attr("y2", i)
                .attr("style", "stroke: black; stroke-width: 2;"));
        $(g).append($(document.createElementNS(svg_namespace, 'text'))
                .attr("x", -6)
                .attr("y", i + 5)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .attr("style", "font: Helvetica, Arial, sans-serif")
                .text(y_max - (height - i) / y_tick + 1));
    }
    $(target).append(svg);
}
