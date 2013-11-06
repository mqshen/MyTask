function getData() {
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 885 - margin.left - margin.right,
        height = 170 - margin.top - margin.bottom;
    
    var x = d3.time.scale()
        .range([0, width]);
    
    var y = d3.scale.linear()
        .range([height, 0]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.days, 1)
        .tickFormat(function(date) {
            if(date.getDate() == 1)
                return date.getMonth() + 1 + '月'
            return d3.time.format("%e")(date)
        });
    
    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(-width).tickPadding(6).ticks(3);
    
    var area = d3.svg.area()
        .x(function(d) { return x(d.add_date); })
        .y0(height)
        .y1(function(d) { return y(d.total_number); })
        .interpolate("cardinal");
    
    var svg = d3.select("#message_graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", width )
        .attr("height", height )
    
    d3.json("messagedata", function(error, responseData) {
        var data = responseData.projectData
        data.forEach(function(d) {
            d.add_date = parseDate(d.add_date);
        });
    
        x.domain(d3.extent(data, function(d) { return d.add_date; }));
        y.domain([0, d3.max(data, function(d) { return d.total_number; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);
    });
}

function getUserData() {
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    var margin = {top: 20, right: 10, bottom: 20, left: 20},
        width = 438 - margin.left - margin.right,
        height = 130 - margin.top - margin.bottom;
    
    var x = d3.time.scale()
        .range([0, width]);
    
    var y = d3.scale.linear()
        .range([height, 0]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.days, 1)
        .tickFormat(function(date) {
            if(date.getDate() == 1)
                return date.getMonth() + 1 + '月'
            return d3.time.format("%e")(date)
        });
    
    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(-width).tickPadding(6).ticks(3);
    
    var area = d3.svg.area()
        .x(function(d) { return x(d.add_date); })
        .y0(height)
        .y1(function(d) { return y(d.total_number); })
        .interpolate("cardinal");
    
    d3.json("messageuserdata", function(error, responseData) {
        var data = responseData.projectData
        if(data.length == 0)
            return 
        var lastUserId = data[0].user_id
        var svg, userData = []; 
        data.forEach(function(d) {
            d.add_date = parseDate(d.add_date);
            if(d.user_id != lastUserId) {

                x.domain(userData.map(function(d) { return d.add_date; }));
                y.domain([0, d3.max(userData, function(d) { return d.total_number; })]);

                svg = d3.select("#message_user_graph")
                    .append("li")
                    .attr("class", "person")
                
                var user_info = svg.append("h3")
                user_info.append("img")
                    .attr("class", "avatar")
                    .attr("src", "/avatar/" + userData[0].own.avatar)

                user_info.append("span")
                    .attr("class", "rank")
                    .text("#1")

                user_info.append("a")
                    .attr("class", "aname")
                    .text(userData[0].own.name)

                svg = svg.append("svg")
                    .attr("class", "spark")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
    
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)

                svg.append("path")
                    .datum(userData)
                    .attr("class", "area")
                    .attr("d", area);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

    
                userData = []
                lastUserId = d.user_id
            }
            userData.push(d)

        });
            x.domain(userData.map(function(d) { return d.add_date; }));
            y.domain([0, d3.max(userData, function(d) { return d.total_number; })]);

            svg = d3.select("#message_user_graph")
                .append("li")
                .attr("class", "person")
            
            var user_info = svg.append("h3")
            user_info.append("img")
                .attr("class", "avatar")
                .attr("src", "/avatar/" + userData[0].own.avatar)

            user_info.append("span")
                .attr("class", "rank")
                .text("#1")

            user_info.append("a")
                .attr("class", "aname")
                .text(userData[0].own.name)

            svg = svg.append("svg")
                .attr("class", "spark")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
    
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)

            svg.append("path")
                .datum(userData)
                .attr("class", "area")
                .attr("d", area);
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
    
    });
}
getData();
getUserData();
