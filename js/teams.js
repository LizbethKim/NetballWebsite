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

function update_team_select(element, other_elements, blurb) {
    $.each(other_elements, function(idx, e) {
        var v = $(e).val();
        select_load_teams_sub(element, e);
        $(e).val(v);
    });
    update_blurb(element, blurb);
}
