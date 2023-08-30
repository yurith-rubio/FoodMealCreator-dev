import {select, axisBottom, axisLeft, scaleLinear, scaleBand} from 'd3'
import * as d3 from "d3";
import SectionHeading from './SectionHeading.jsx'
import { useContext, useRef, useState, useEffect } from 'react'
import { InfoContext } from "./InfoContext.jsx";
import d3Tip from "d3-tip";

export default function MacrosOverview() {
    const value = useContext(InfoContext);
    const info = value.info;
    const svgRef = useRef();
    const [macro, setMacro] = useState("carbs")

    useEffect(() => {
        const svg = select(svgRef.current);
        const highestBar = d3.max(info, function(item) {
            return item[macro];
        });

        const xScale = scaleBand()
            .domain(info.map((value) => value.name))
            .range([0, 500])
            .padding(.6, 0)
        
        const xAxis = axisBottom(xScale)
            .ticks(info.length)
        
        const yScale = scaleLinear()
            .domain([0, highestBar])
            .rangeRound([500, 0])

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
            .attr('class', 'd3-tip-macros')
            .offset((d, i) => {
                return [-(500 - yScale(i[macro])), 80]
            })
            .html((d, i) => {
                return `<div>${i[macro]} g - ${macro}</div>`
            })

        svg.call(tooltip)

        select(".bar-group")
            .selectAll(".bar-ingredient")
            .data(info)
            .join("rect")
            .classed("bar-ingredient", true)
            .attr("x", info => xScale(info.name))
            .attr("height", info => {
                return 500 - yScale(info[macro]);
            })
            .style("transform", "scale(1, -1) translateY(-500px)")
            .attr('y', 0)
            .attr('width', xScale.bandwidth())
            .on("mouseover", tooltip.show)
            .on("mouseleave", tooltip.hide)

    },  [macro, info])

    function handleRadioInput(event) {
        setMacro(event.target.value);
    }

    return <section>
        <SectionHeading title="Macros Overview" />
        <div className="graph-container macros-overview">
            <svg ref={svgRef}>
                <g className="x-axis"></g>
                <g className="y-axis"></g>
                <g className={macro + " bar-group"}></g>
            </svg>
            <div className="radioButtonsContainer">
                <label className="container" htmlFor="carbs-input">
                    Carbs
                    <input type="radio" id="carbs-input" name="macros" value="carbs" onChange={handleRadioInput} />
                    <span className="checkmark"></span>
                </label>
                <label className="container" htmlFor="protein-input">
                    Protein
                    <input type="radio" id="protein-input" name="macros" value="protein" onChange={handleRadioInput} />
                    <span className="checkmark"></span>
                </label>
                
                <label className="container" htmlFor="fat-input">
                    Fat
                    <input type="radio" id="fat-input" name="macros" value="fat" onChange={handleRadioInput} />
                    <span className="checkmark"></span>
                </label>
                
            </div>
        </div>
    </section>
}