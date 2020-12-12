import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import * as data from '../../assets/miserables.json';
import {Node} from '../d3/models/node';
import {Link} from '../d3/models/link';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('d3 version:', d3.version);
    this.loadForceDirectedGraph(data.nodes, data.links);
  }

  loadForceDirectedGraph(nodes: Node[], links: Link[]) {
    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: Node) => d.id))// the id of the node
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    console.log(nodes, links);

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-width', d => Math.sqrt(d.value))
      .attr('stroke', 'black');

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', 'red')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
      );

    node.append('title').text((d) => d.id);

    simulation
      .nodes(nodes)
      .on('tick', ticked);

    simulation.force<d3.ForceLink<any, any>>('link')
      .links(links);

    function ticked() {
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
    }

    function dragStarted(event) {
      if (!event.active) { simulation.alphaTarget(0.3).restart(); }
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragEnded(event) {
      if (!event.active) { simulation.alphaTarget(0); }
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }

}
