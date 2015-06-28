function foldl(fun, acc, list) {
    for(var i = 0; i < list.length; i++)
        acc = fun(acc, list[i]);
    return acc;
}

function map(fun, list) {
    return foldl(function(acc, e) { return acc.push(fun(e)) }, [], list);
}

function filter(fun, list) {
    return foldl(function(acc, e) { if(fun(e)) acc.push(e); return acc },
            [], list);
}

function remove_at(idx, list) {
    return list
        .slice(0, idx)
        .concat(list.slice(idx + 1, list.length));
}

function find(fun, list) {
    for(var i = 0; i < list.length; i++)
        if(fun(list[i]))
            return list[i];
    return undefined;
}

function sort(less_than_fun, list) {
    var sorter = function(acc, e) {
        var head = [];
        var i;
        for(i = 0; i < acc.length; i++) {
            if(less_than_fun(e, acc[i]))
                break;
            head.push(acc[i]);
        }
        head.push(e);
        return head.concat(acc.splice(i, acc.length));
    }

    return foldl(sorter, [], list);
}
