import {select, axisBottom, axisLeft, scaleLinear, scaleBand} from 'd3'
import * as d3 from "d3";
import SectionHeading from './SectionHeading.jsx'
import { useEffect, useRef, useContext } from 'react'
import d3Tip from "d3-tip";
import { InfoContext } from "./InfoContext.jsx";

export default function IngredientsQuantity() {
    let info = useContext(InfoContext);
    info = info.info;
    const svgRef = useRef();

    useEffect(() => {
        const newInfo = info.map(item => {
            const result = {
                ...item,
                "carbs": item.carbs * 4,
                "protein": item.protein * 4,
                "fat": item.fat * 9,
            };
            result["calories"] = result.carbs + result.protein + result.fat;
            return result;
        });

        const svg = select(svgRef.current);
        const keys = ['carbs', 'protein', 'fat'];
        const stack = d3.stack().keys(keys)
        const stackedData = stack(newInfo)
        const highestBar = d3.max(newInfo, function(item) {
            return item.calories;
        });

        const xScale = scaleBand()
            .domain(newInfo.map((value) => value.name))
            .range([0, 500])
            .padding(.6, 0)

        const xAxis = axisBottom(xScale)
            .ticks(newInfo.length)

        const yScale = scaleLinear()
            .domain([0, highestBar])
            .rangeRound([highestBar, 0])
        
        const yAxis = axisLeft(yScale)
            .ticks(newInfo.length)

        svg
            .attr("width", 500)
            .attr("height", highestBar)

        svg
            .select(".x-axis")
            .style("color", "#D9FFC8")
            .style("transform", `translateY(${highestBar}px)`)
            .style("font-size", 15)
            .call(xAxis)
        
        svg
            .selectAll(".x-axis .tick text")
            .style("transform", "translate(14px, 74px) rotate(90deg)")
        
        svg
            .select(".y-axis")
            .style("color", "#D9FFC8")
            .call(yAxis)

        const tooltip = d3Tip()
            .attr('class', 'd3-tip')
            .offset([-30, 0])
            .html((d, i) => {
                let macro = ""
                if(d.target.parentElement.classList.contains("carbs")){
                     macro = "carbs"
                }
                if(d.target.parentElement.classList.contains("protein")) {
                    macro = "protein"
                }
                if(d.target.parentElement.classList.contains("fat")) {
                    macro = "fat"
                }
                return `<div><span class="tooltip ingredient-name">${i.data.name}</span>
                <br/>
                (per 100g)
                </div>
                <ul class="ingredients-list">
                    <li><span class='${macro === "carbs" && "bold"}'>${Math.round(i.data.carbs/4)} g - Carbs</span></li>
                    <li><span class='${macro === "protein" && "bold"}'>${Math.round(i.data.protein/4)} g - Protein</span></li>
                    <li><span class='${macro === "fat" && "bold"}'>${Math.round(i.data.fat/9)} g - Fat</span></li>
                </ul>
                <div class="total-calories">${Math.round(i.data.calories)} cal</div>
                `
            })

        svg.call(tooltip)

        const groups = select(".bar-groups")
            .selectAll(".macro-group")
            .data(stackedData)
            .join("g")
            .attr("class", d => d.key)
            .classed("macro-group", true)

        // Adding 'carbs, protein, fat' classes to each rect element in order to be able to show in the tooltip in bold the macro that is being selected
        d3
            .select(".carbs.macro-group")
            .html(`<defs><pattern id="pattern-carbs" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"><image xlink:href="pattern-carbs.svg" x="0" y="0" width="50" height="50"></image></pattern></defs>`)
        
        d3
            .select(".protein.macro-group")
            .html(`<defs><pattern id="pattern-protein" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"><image xlink:href="pattern-protein.svg" x="0" y="0" width="50" height="50"></image></pattern></defs>`)
        
        d3
            .select(".fat.macro-group")
            .html(`<defs><pattern id="pattern-fat" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"><image xlink:href="pattern-fat.svg" x="0" y="0" width="50" height="50"></image></pattern></defs>`)

        d3
            .selectAll(".carbs.macro-group .bar-ingredient")
            .attr("class", "carbs bar-ingredient")
        d3
            .selectAll(".protein.macro-group .bar-ingredient")
            .attr("class", "protein bar-ingredient")

        d3
            .selectAll(".fat.macro-group .bar-ingredient")
            .attr("class", "fat bar-ingredient")
        
        groups
            .selectAll(".bar-ingredient")
            .data(d => d)
            .join("rect")
            .classed("bar-ingredient", true)
            .attr("x", d => xScale(d.data.name))
            .attr("height", highestBar)
            .attr('y', d => yScale(0))
            .attr('width', xScale.bandwidth())
            .on("mouseover", tooltip.show)
            .on("mouseleave", tooltip.hide)
        
        groups.selectAll("rect")
            .transition()
            .duration(1000)
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .attr('y', d => yScale(d[1]))

    }, [info])

  return <section>
        <SectionHeading title="Ingredients and Quantity" />
        <div className="graph-container ingredients">
            <svg ref={svgRef}>
                <g className="x-axis"></g>
                <g className="y-axis"></g>
                <g className="bar-groups"></g>
            </svg>
        </div>
    </section>
}