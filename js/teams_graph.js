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
        if(our_score !== "null")
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
function load_team_linegraph(teamname1, teamname2, target) {
    var team1 = get_team_from_name(teamname1);
    var team2 = get_team_from_name(teamname2);
    var fullname1 = team1.region + " " + team1.name;
    var fullname2 = team2.region + " " + team2.name;

    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 500 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom,
        key = {top: 10,
               left: width + margin.right,
               width: 150};
    var standings1 = team_all_standings(fullname1);
    var standings2 = team_all_standings(fullname2);

    var x_tick = width / (standings1.length - 1);
    var y_max = Math.max(
        listmax(map(function(e) {
            return e.standing;
        }, standings1)),
        listmax(map(function(e) {
            return e.standing;
        }, standings2)));
    var y_tick = height / y_max;

    $(target).html($('<h2>', {class: 'bargraph_title'}).text('Standings'));
    var svg = document.createElementNS(svg_namespace, "svg");
    $(svg).attr("width", width + margin.left + margin.right + key.width)
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

    // standings1 line
    $.each(standings1.slice(1, standings1.length), function(idx, v) {
        $(g).append($(document.createElementNS(svg_namespace, 'line'))
            .attr("x1", "" + Math.floor(idx * x_tick))
            .attr("y1", "" + Math.floor(standings1[idx].standing * y_tick - y_tick))
            .attr("x2", "" + Math.floor((idx + 1) * x_tick))
            .attr("y2", "" + Math.floor(v.standing * y_tick - y_tick))
            .attr("style", "stroke: #C9017B; stroke-width: 2;"));
    });

    // standings2 line
    $.each(standings2.slice(1, standings2.length), function(idx, v) {
        $(g).append($(document.createElementNS(svg_namespace, 'line'))
            .attr("x1", "" + Math.floor(idx * x_tick))
            .attr("y1", "" + Math.floor(standings2[idx].standing * y_tick - y_tick))
            .attr("x2", "" + Math.floor((idx + 1) * x_tick))
            .attr("y2", "" + Math.floor(v.standing * y_tick - y_tick))
            .attr("style", "stroke: white; stroke-width: 2;"));
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
                .text(standings1[i/x_tick].year));
    }
    // y-axis
    $(g).append($(document.createElementNS(svg_namespace, 'line'))
            .attr("x1", -1)
            .attr("y1", -1)
            .attr("x2", -1)
            .attr("y2", height+1)
            .attr("style", "stroke: black; stroke-width: 2;"));
    for(var i = 0, count = 1; i <= height; i += y_tick * 2, count += 2) {
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
                .text(count));
    }
    // key
    $(g).append($(document.createElementNS(svg_namespace, 'text'))
            .attr("x", key.left + key.width / 2)
            .attr("y", key.top + 20)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("style", "font: Helvetica, Arial, sans-serif;" +
                           "text-decoration: underline;")
            .text("Key"));
    // first key
    $(g).append($(document.createElementNS(svg_namespace, 'rect'))
            .attr("x", key.left + 5)
            .attr("y", key.top + 30)
            .attr("width", "10")
            .attr("height", "10")
            .attr("style", "fill: #C9017B;"));
    $(g).append($(document.createElementNS(svg_namespace, 'text'))
            .attr("x", key.left + 20)
            .attr("y", key.top + 40)
            .attr("text-anchor", "begin")
            .attr("fill", "black")
            .attr("style", "font: Helvetica, Arial, sans-serif")
            .text(team1.name));
    // second key
    $(g).append($(document.createElementNS(svg_namespace, 'rect'))
            .attr("x", key.left + 5)
            .attr("y", key.top + 50)
            .attr("width", "10")
            .attr("height", "10")
            .attr("style", "fill: white;"));
    $(g).append($(document.createElementNS(svg_namespace, 'text'))
            .attr("x", key.left + 20)
            .attr("y", key.top + 60)
            .attr("text-anchor", "begin")
            .attr("fill", "black")
            .attr("style", "font: Helvetica, Arial, sans-serif")
            .text(team2.name));

    // add svg to page
    $(target).append(svg);
}

function load_team_piegraph(teamname1, teamname2, target)
{
    var team1 = get_team_from_name(teamname1);
    var team2 = get_team_from_name(teamname2);
    var team1_stats = get_team_games(get_year(), teamname1);
    var team2_stats = get_team_games(get_year(), teamname2);
    var fullname1 = team1.region + " " + team1.name;
    var fullname2 = team2.region + " " + team2.name;

    var count_wins_fun = function(fullname) {
        return function(acc, e) {
            var ours, theirs;
            if(e.homeTeamScore === "null" || e.awayTeamScore === "null")
                return acc;
            if(e.homeTeam === fullname)
                return e.homeTeamScore > e.awayTeamScore ? acc + 1 : acc;
            else if(e.awayTeam === fullname)
                return e.awayTeamScore > e.homeTeamScore ? acc + 1 : acc;
            return acc;
        };
    };
    var wins1 = foldl(count_wins_fun(fullname1), 0, team1_stats);
    var wins2 = foldl(count_wins_fun(fullname2), 0, team2_stats);
    var total_wins = wins1 + wins2;

    var dataset = [
        {label: team1.name, count: wins1, color: '#C9017B'},
        {label: team2.name, count: wins2, color: 'white'}
    ];

    var width = 300;
    var donut_width = 50;
    var height = 300;
    var radius = Math.min(width, height) / 2;
    var legend_rect_size = 18;
    var legend_spacing = 4;

    $(target).html($('<h2>', {class: 'linegraph_title'})
            .text('Win Percentage'));

    var svg = d3.select(target)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +
                    ',' + (height / 2) + ')');

    // create the arc
    var arc = d3.svg.arc()
        .innerRadius(radius - donut_width)
        .outerRadius(radius);
    var pie = d3.layout.pie()
        .value(function(d) { return d.count; })
        .sort(null);

    // create all the sections
    var path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
            return d.data.color;
        });

    // add the legend
    var legend = svg.selectAll('.legend')
        .data(dataset)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legend_rect_size + legend_spacing;
            var offset = height * dataset.length / 2;
            var horz = -2 * legend_rect_size;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legend_rect_size)
        .attr('height', legend_rect_size)
        .style('fill', function(d) { return d.color });

    legend.append('text')
        .attr('x', legend_rect_size + legend_spacing)
        .attr('y', legend_rect_size - legend_spacing)
        .text(function(d) { return d.label; });
}

