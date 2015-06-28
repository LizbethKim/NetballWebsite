// get the currently selected year
function get_year() {
    return $("#selectYear").val();
}


// get the maximum value in a list
function listmax(list) {
    var maxfun = function(acc, e) { return e > acc ? e : acc };
    return foldl(maxfun, list[0], list.slice(1, list.length));
}
