function meow(list){
	console.log(isNZ(list));
}

function isNZ(list){
	return filter(function (e) {return e.location == "New Zealand"}, list);
}

function filter (func, list) {
	var ret = [];
	for (var i = 0; i < list.length; i++){
		if (fun(list[i]))
			ret.push(list[i]);
	}
	return ret;
}