import {select, scaleBand, scaleLinear, axisBottom, axisLeft} from 'd3'
import * as d3 from 'd3';
import {useContext, useEffect, useRef} from 'react';
import { InfoContext } from "./InfoContext.jsx";
import SectionHeading from './SectionHeading.jsx';
import d3Tip from 'd3-tip'

export default function MealOverview() {
    let info = useContext(InfoContext);
    info = info.info;
    const svgRef = useRef();

    let totalCalories = info.reduce((result, item) => {
        result.calories += (item.carbs * 4 + item.protein * 4 + item.fat * 9);
        return result;
    }, {"calories":0});

    totalCalories = totalCalories.calories;

    let newInfo = info.reduce((result, item) => {
        result[0].quantity += item.carbs;
        result[1].quantity += item.protein;
        result[2].quantity += item.fat;
        return result;
    }, [{ 
            "macro" : "carbs",
            "quantity":0,
            "percentage": 0,
        },
        { 
            "macro" : "protein",
            "quantity":0,
            "percentage": 0,
        },
        {
            "macro": "fat",
            "quantity":0,
            "percentage": 0
        }]
    );

    newInfo = newInfo.map(function (item) {
       if (item.macro === "fat") {
            item.percentage = item.quantity * 900 / totalCalories;
       } else {
            item.percentage = item.quantity * 400 / totalCalories;
       }
       return item;
    });
    
    const macrosPercentage = [{
        "carbs": newInfo[0].percentage,
        "protein": newInfo[1].percentage,
        "fat": newInfo[2].percentage,
    }]

    const keys = ["carbs", "protein", "fat"];
    const stack = d3.stack().keys(keys);
    const stackedData = stack(macrosPercentage);

    useEffect(() => {
        const svg = select(svgRef.current);

        const xScale = scaleBand()
            .domain(["meal overview"])
            .range([0, 500])
            
        const xAxis = axisBottom(xScale)

        const yScale = scaleLinear()
            .domain([100, 0])
            .range([0, 500])
        
        const yAxis = axisLeft(yScale)
            .ticks(5)

        svg
            .attr("width", 500)
            .attr("height", 500)

        svg
            .select(".x-axis")
            .style("color", "#D9FFC8")
            .style("transform", "translateY(500px)")
            .call(xAxis)
        
        svg
            .select(".y-axis")
            .style("color", "#D9FFC8")
            .call(yAxis)

        const tooltip = d3Tip()
            .attr('class', 'd3-tip-meal')
            .offset([-30, 0])
            .html((d, i) => {
                console.log("testing here")
                console.log(d)
                console.log(i[0].data)
                return `Test`
            })

        svg.call(tooltip)

        select(".bar-group-meal")
            .selectAll(".bar-ingredients")
            .data(stackedData)
            .join("rect")
            .attr("class", macros => {
                return macros.key + " bar-ingredients";
            })
            .attr("x", 0)
            .attr('height', function(d) {
                const dd = d[0];
                return yScale(dd[0]) - yScale(dd[1]);
            })
            .attr('y', function (d) {
                const dd = d[0];
                return yScale(dd[1]);
            })
            .attr('width', xScale.bandwidth())
            .on("mouseover", tooltip.show)
            .on("mouseleave", tooltip.hide)
            
    })

    return <section>
        <SectionHeading title="Meal Overview" />
        <div className="graph-container meal-overview">
            <svg ref={svgRef}>
                <g className="x-axis"></g>
                <g className="y-axis"></g>
                <g className="bar-group-meal"></g>
            </svg>
            <div className="total-calories">Total Calories: {totalCalories.toFixed(0)} cal</div>
        </div>
    </section>
}