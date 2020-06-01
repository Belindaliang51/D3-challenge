// @TODO: YOUR CODE HERE!
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
var chosenXAxis = "poverty"
var chosenYAxis = "healthcareLow"

function xScale(povertyData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8, d3.max(povertyData, d => d[chosenXAxis])*1.2])   
        .range([0,chartWidth]);
    return xLinearScale
};

function yScale(povertyData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(povertyData, d => d[chosenYAxis]) * 0.8, d3.max(povertyData, d => d[chosenYAxis])*1.2])
        .range([chartHeight,0]);
    return yLinearScale;
};

function renderXAxes(newXScale,xAxis){
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
};

function renderYAxes(newYScale,yAxis){
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
};

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

        return circlesGroup;
};

function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){
    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;
};

function updateToolTip(chosenXAxis,circlesGroup){
    var toolTip = d3.tip()
        .classed("tooltip",true)
        .offset([80,-60])
        .html(function(d){
            if(chosenXAxis ==="poverty"){
                return (`${d.state}<br>$${chosenXAxis}: ${d[chosenXAxis]}`)
            }
            else if(chosenXAxis ==="age"){
                return (`${d.state}<br>$${chosenXAxis}: ${d[chosenXAxis]}`)
            }
            else{
                return (`${d.state}<br>$${chosenXAxis}: ${d[chosenXAxis]}`)
            }

            circlesGroup.call(toolTip);

            circlesGroup.on("mouseover",function(data){
                toolTip.show(data)
            })
            .on("mouseout",function(data){
                toolTip.hide(data)
            })
        })
};


// Retrieve data from csv
d3.csv("../assets/data/data.csv").then(function(povertyData, err){
    if(err) throw err;
    console.log(povertyData);
    // parse data
    povertyData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcareLow = +data.healthcareLow;
        data.obesity = +data.obesity;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.income = +data.income;
        data.abbr = data.abbr;
    });
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
        .classed("stateCircle",true)
        .attr("opacity","0.75");

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
        .attr("value","poverty") //value to grab for event listener
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
        .attr("value", "income") //value to grab for event listener
        .classed("inactive", true)
        .text("Household Income(Median");
    
    // Append y axes 
    var yLabelsGroup = chartGroup.append('g')

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0 - margin.left+40)
        .attr("x",0 - (chartHeight/2))
        .attr("value", "healthcareLow") //value to grab for event listener
        .attr("dy","1.6em")
        .classed("axis-text",true)
        .classed("active",true)
        .text("Lacks Healthcare (% )");

    var smokeLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left+20)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "smokers") //value to grab for event listener
        .attr("dy", "1.6em")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Smokes (% )");

    var obeseLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "obesity") //value to grab for event listener
        .attr("dy", "1.6em")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Obese (% )");

    // x axis labels event listener
    labelsGroup.selectAll("text").on("click",function(){
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis){

            //replace chosenXAxis with value 
            chosenXAxis = value;
            //console.log(chosenXAxis)

            //Update x and y scale
            xLinearScale = xScale(povertyData,chosenXAxis);
            yLinearScale = yScale(povertyData,chosenYAxis);

            //Update x axis
            xAxis = renderXAxes(xLinearScale,xAxis);

            //Update circles
            circlesGroup = renderCircles(circlesGroup,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis);

            //Update text group 
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //Update Tooltip
            var toolTip = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //change the classes to bold text
            if (chosenXAxis === "poverty"){
                povertyLables
                    .classed("active",ture)
                    .classed("inactive".false);
                ageLables
                    .classed("active", false)
                    .classed("inactive".true);
                incomeLables
                    .classed("active", false)
                    .classed("inactive".true);
            }
            else if (chosenXAxis === "age"){
                povertyLables
                    .classed("active", false)
                    .classed("inactive".true);
                ageLables
                    .classed("active", true)
                    .classed("inactive".false);
                incomeLables
                    .classed("active", false)
                    .classed("inactive".true);
            }
            else{
                povertyLables
                    .classed("active", false)
                    .classed("inactive".true);
                ageLables
                    .classed("active", false)
                    .classed("inactive".true);
                incomeLables
                    .classed("active", true)
                    .classed("inactive".false);
            }
        }
    });

    // y axis label event listener 
    yLabelsGroup.selectAll("text").on("click",function(){
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            //replace chosenXAxis with value 
            chosenYAxis = value;
            //console.log(chosenXAxis)

            //Update x and y scale
            xLinearScale = xScale(povertyData, chosenXAxis);
            yLinearScale = yScale(povertyData, chosenYAxis);

            //Update x axis
            yAxis = renderYAxes(yLinearScale, yAxis);

            //Update circles
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //Update text group 
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //Update Tooltip
            var toolTip = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //change the classes to bold text
            if (chosenYAxis ==="healthcareLow"){
                healthcareLabel
                    .classed("active",true)
                    .classed("inactive",false);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis ==="smokes"){
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else{
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obeseLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }

    }
    
});
});