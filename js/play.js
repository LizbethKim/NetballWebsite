var teams = [{ name: "Central Pulse", location: "New Zealand"},
             { name: "Queensland Firebirds", location: "Australia"},
             { name: "Northern Mystics", location: "New Zealand"},
             { name: "Waikato Bay of Plenty Magic", location: "New Zealand"},
             { name: "New South Wales Swifts", location: "Australia"},
             { name: "Canterbury Tactix", location: "New Zealand"},
             { name: "Melbourne Vixens", location: "Australia"},
             { name: "West Coast Fever", location: "Australia"},
             { name: "Adelaide Thunderbirds", location: "Australia"},
             { name: "Southern Steel", location: "New Zealand"}];

var colors = ["SlateGrey", "#CD7F32", "Silver", "Gold"];

// meow(newData[0].concat(newData[1], newData[2], newData[3], newData[4], newData[5]), teams);

var currentFunc = function(e) {return teamScores(e, teams)};
var positiveFunc  = function(e) {return e.wins};
var selection = newData[newData.length - 1];
var data = currentFunc(selection);

/*
*  Filters data by season
*/
function onFilterDidChange(func) {
    selection = newData[$("#select option:selected" ).text()-2008];
    updateGraph(func(selection));
}

/*
*  Updates the bar chart with the new information
*/
function updateGraph(data) {
    // remove
    d3.select("#barChart").selectAll("div").remove();

    // create
    var graph = d3.select("#barChart")
        .selectAll("div")
        .data(data);

    // add
    graph.enter().append("div");
    // update
    graph.style("width", function(d) { return x(positiveFunc(d)) + "px"; })	//gets the x value from the scale. get the homescore from here
         .text(function(d) { return d.name + " " + positiveFunc(d); });

    d3.select("svg").remove();
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      // dat.forEach(function(d) {
      //   d.wins = +d.wins;
      // });

    var g = svg.selectAll(".arc")
          .data(pie(data))
          .enter().append("g")
          .attr("class", "arc");

      g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(positiveFunc(d.data)); });

      g.append("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.data.name; });
}

var maxScore = d3.max(data, positiveFunc);

//line chart //--------------------------------------------------------------------------------------
var index = 0;

var lineChartHeight = 200;
var lineChartWidth = 200;
var padding = 10;

//Define the scales
var xScale = d3.scale.linear()
                .domain([0,d3.max(data, positiveFunc)])
                .range([padding, lineChartWidth - padding * 2]);

var yScale = d3.scale.ordinal()
                .domain([0,d3.max(data, positiveFunc)])
                .range([padding, lineChartWidth - padding * 2]);

//Define the X Axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var svgContainer = d3.select("#lineChart")
    .append("svg")
    .attr("width", lineChartWidth)
    .attr("height", lineChartHeight)
    .style("border", "1px solid black");

var lineFunction = d3.svg.line()
    //need to add in both hometeam and awayteam scores

    .x(function(d) { var temp = index; index += 200/(data.length-1); return temp; })
    .y(function(d) { return (positiveFunc(d)/maxScore)*200})
    .interpolate("cardinal-open");

var lineGraph = svgContainer.append("path")
    .attr("d", lineFunction(data))
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

var svgContainer = d3.select("#lineChart").append("svg")
    .attr("width", 400)
    .attr("height", 100);

//end of line chart //-------------------------------------------------------------------------------

//start of bar chart//-------------------------------------------------------------------------------

var x = d3.scale.linear()
    .domain([0, maxScore])		//from 0 to max of the data
    .range([0, 200]);					//the range (should be width of the svg instad of 420)

//create the x axis
svgContainer.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (lineChartHeight - padding) + ")")
    .call(xAxis);

onFilterDidChange(currentFunc);

var width = 960,
height = 500,
radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
.outerRadius(radius - 10)
.innerRadius(0);

var pie = d3.layout.pie()
.sort(null)
.value(positiveFunc);
