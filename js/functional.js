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
