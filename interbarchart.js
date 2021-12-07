//First Bar Chart
    var data = [
        {group: "Better Job", GT: 430, HND: 453, SLV: 356},
        {group: "Unemployment", GT: 190, HND: 286, SLV: 142},
        {group: "Basic Finances", GT: 94, HND: 127, SLV: 88},
        {group: "Remittances", GT: 92, HND: 83, SLV: 102},
        {group: "Money for Food", GT: 94, HND: 101, SLV: 39},
        {group: "Family Reunification", GT: 24, HND: 33, SLV: 80},
        {group: "Unsafe", GT: 4, HND: 23, SLV: 91},
    ];

    var subgroups = ["GT", "HND", "SLV"]
    
    var groups = ["Better Job", "Unemployment", "Basic Finances", "Remittances", "Money for Food", "Family Reunification", "Unsafe"]
        
    //var groups = data.map((rowInData)=>{return rowInData.group});
    
    var stackGen = d3.stack()
        .keys(subgroups)
    
    var stackedSeries = stackGen(data); 
    
    // console.log(stackedSeries)

    var margin = {top: 5, right: 10, bottom: 20, left: 50};
        width = 460- margin.left - margin.right;
        height = 250 - margin.top - margin.bottom;

    // define svg
    const svg3 = d3.select("#viz3")
        .append("svg")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr("viewBox", [0, 0, 460, 345])
        .append("g")
            .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, 400])
        .padding([0.5]);
    
    svg3.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickSizeOuter(0)
            .tickPadding(3))
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");;

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 1300])
        .range([ height, 0 ]);
    
    svg3.append("g")
        .call(d3.axisLeft(y)
            .ticks(5)
            .tickPadding(5));

    // color palette = one color per subgroup
    var color = function(d) {
        // console.log(d[0]);
        if (d[0] == 'G') { 
            return "#4698bc";
        }
        else if (d[0] == 'H') { 
            return "#6bbb5d";
        }
        else if (d[0] == 'S') { 
            return "#e18731";
        }};

    // var color = d3.scaleOrdinal()
    //     .domain(subgroups)
    //     .range(d3.schemeSet2);

    // What happens when user hover a bar
    var mouseover = function(d) {
                    // what subgroup are we hovering?
                    var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
                    console.log(subgroupName,d.data,d)
                    var subgroupValue = d.data[subgroupName];
                    // Reduce opacity of all rect to 0.2
                      d3.selectAll(".myRect").style("opacity", 0.2)
                    // Highlight all rects of this subgroup with opacity 0.8. It is possible to select them since they have a specific class = their name.
                    d3.selectAll("."+subgroupName)
                      .style("opacity", 1)
                      
                   Tooltip
                    .style("opacity", 1)
                    d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
                      
                    }
                  
         // create a tooltip
  var Tooltip = d3.select("#viz3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

 
  var mousemove = function(d) {
    var subgroupName = d3.select(this.parentNode).datum().key; 
      console.log("mousemove", d, subgroupName, event)
      Tooltip
      .html(subgroupName + ":" + d.data[subgroupName])
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }


    // Show the bars
    svg3.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedSeries)
        .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
            .attr("class", function(d){ return "myRect " + d.key}) // Add a class to each subgroup: their name
            
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data.group); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())
            .attr("stroke", "grey")
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .on("mousemove", mousemove);
            // console.log(d.key)

    // add title
    // svg3.append("text")
    //     .attr("class", "title_styling")
    //     .attr("y", margin.top - 25) 
    //     .attr("x", margin.left)
    //     .text("Motivations for Migrating");
    
    svg3.append("text")
        .attr("class", "source-styling")
        .attr("y", (margin.top + 330)) 
        .attr("x", 3)
        .text("Data Source: WFP Survey (2021)");

// // Add one dot in the legend for each name.
         legendDots = svg3.selectAll("legend-dots")
         .data(subgroups);

         legendDots.enter()
             .append("circle")
             .attr('class', 'legend-dots')
             .attr("cx", 305)
             .attr("cy", 20) 
             .attr("r", 4)
             .style("fill", "#4698bc")
             .attr('opacity',1);

         // Add one dot in the legend for each name.
         legendLabels = svg3.selectAll("legend-labels")
         .data(subgroups);
         legendLabels.enter()
         .append("text")
             .attr('class', 'legend-labels')
             .attr("x", 315)
            .attr("y", 20)
//             .attr("y", function(d,i){return 150 + i*15})
             .style("fill", 'black')
             .text("Guatemala")
             .attr("text-anchor", "left")
             .style("alignment-baseline", "middle")
             .attr('opacity',1)

   legendDots.enter()
             .append("circle")
             .attr('class', 'legend-dots')
             .attr("cx", 305)
             .attr("cy", 40) 
             .attr("r", 4)
             .style("fill", "#6bbb5d")
             .attr('opacity',1);

         // Add one dot in the legend for each name.
         legendLabels = svg3.selectAll("legend-labels")
         .data(subgroups);
         legendLabels.enter()
         .append("text")
             .attr('class', 'legend-labels')
             .attr("x", 315)
            .attr("y", 40)
//             .attr("y", function(d,i){return 150 + i*15})
             .style("fill", 'black')
             .text("Honduras")
             .attr("text-anchor", "left")
             .style("alignment-baseline", "middle")
             .attr('opacity',1)

   legendDots.enter()
             .append("circle")
             .attr('class', 'legend-dots')
             .attr("cx", 305)
             .attr("cy", 60) 
             .attr("r", 4)
             .style("fill", "#e18731")
             .attr('opacity',1);

         // Add one dot in the legend for each name.
         legendLabels = svg3.selectAll("legend-labels")
         .data(subgroups);
         legendLabels.enter()
         .append("text")
             .attr('class', 'legend-labels')
             .attr("x", 315)
            .attr("y", 60)
//             .attr("y", function(d,i){return 150 + i*15})
             .style("fill", 'black')
             .text("El Salvador")
             .attr("text-anchor", "left")
             .style("alignment-baseline", "middle")
             .attr('opacity',1)
