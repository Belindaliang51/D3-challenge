// @TODO: YOUR CODE HERE!
function makeResponsive(){

    var svgWidth = 860;
    var svgHeight = 600;

    var margin = {
        top:50,
        bottom:100,
        left:100,
        right: 100
    };

    var chartWidth = svgWidth - margin.left - margin.right; 
    var chartHeight = svgHeight - margin.top - margin.bottom; 

    // Create an svg wrapper, append svg group that will hold the chart 
    var svg = d3.select("#scatter").append("svg").attr("width", svgWidth).attr("height", svgHeight);

    // Append an svg group
    var chartGroup = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

    // Initial params
    var chosenXAxis = "In_Poverty"
    var chosenYAxis = "lack_of_Healthcare"

    function xScale(povertyData, chosenXAxis) {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(povertyData, d => d.poverty) * 0.9, d3.max(povertyData, d => d.poverty)])   
            .range([0,chartWidth]);

        return xLinearScale
    };

    function yScale(povertyData, chosenYAxis) {
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(povertyData, d => d.healthcareLow)*0.85, d3.max(povertyData, d => d.healthcareLow)])
            .range([chartHeight,0]);

        return yLinearScale;
    };

    // Retrieve data from csv
    d3.csv("../assets/data/data.csv").then(function(povertyData, err){
        if(err) throw err;
        console.log(povertyData);

        // parse data
        povertyData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcareLow = +data.healthcareLow;
            data.abbr = data.abbr;
        })

        // xLinearScale function above csv imports 
        var xLinearScale = xScale(povertyData, chosenXAxis);

        // Create yScale function 
        var yLinearScale = yScale(povertyData, chosenYAxis);

        // Create initial axis function 
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append x axis 
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform",`translate(0,${chartHeight})`)
            .call(bottomAxis);

        // Append y axis 
        var yAxis = chartGroup.append('g')
            .classed("y-axis", true)
            .call(leftAxis);

        // Add initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(povertyData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy",d => yLinearScale(d.healthcareLow))
            .attr("r", 12 )
            //.attr("fill","skyblue")
            .classed("stateCircle",true)
            .attr("opacity","0.75")
            .on("mouseover",function(data){
                toolTip.show(data)
            })
            .on("mouseout", function(data){

            });
        
        // Add text on the circles
        var textGroup = chartGroup.selectAll("text")
            .data(povertyData)
            .enter()
            .append("text")
            .classed("stateText", true)
            .text(d=>d.abbr)
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcareLow))
            .attr("r", 12);


        //create group for x and y axes lables
        var labelsGroup = chartGroup.append('g')
            .attr("transform",`translate(${chartWidth/2},${chartHeight+20})`);

        // Append x axes
        var povertyLables = labelsGroup.append("text")
            .attr("x",0)
            .attr("y",20)
            .attr("value","In_Poverty") //value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");

        var ageLabel = labelsGroup.append("text")
            .attr("x",0)
            .attr("y", 40)
            .attr("value","age") //value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

        var incomeLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "Household_Income") //value to grab for event listener
            .classed("inactive", true)
            .text("Household Income(Median");
        
        // Append y axes 
        var homecareLabel = chartGroup.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",0 - margin.left+40)
            .attr("x",0 - (chartHeight/2))
            .attr("value", "healthcare") //value to grab for event listener
            .attr("dy","1.6em")
            .classed("axis-text",true)
            .classed("active",true)
            .text("Lacks Healthcare (% )");

        var smokeLabel = chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left+20)
            .attr("x", 0 - (chartHeight / 2))
            .attr("value", "smokers") //value to grab for event listener
            .attr("dy", "1.6em")
            .classed("axis-text", true)
            .classed("inactive", true)
            .text("Smokes (% )")

        var smokeLabel = chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (chartHeight / 2))
            .attr("value", "obese") //value to grab for event listener
            .attr("dy", "1.6em")
            .classed("axis-text", true)
            .classed("inactive", true)
            .text("Obese (% )")
        
        

    });
}

makeResponsive()

d3.select("window").on("resize", makeResponsive);
