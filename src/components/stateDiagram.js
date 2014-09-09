define(function (require) {
  'use strict'

  var Vue = require('vue')
    , d3 = require('d3')

  return Vue.component('state-diagram', {

    template: '<div id="diagram-svg-box"></div>',
    replace: true,

    created: function (value) {
      this.$on('update', this.render.bind(this))
    },

    methods: {
      render: function() {
        var width = 600
        , height = 300
        , nodes = {}
        , links = []

        for (var stateName in this.states) {
          if (this.states.hasOwnProperty(stateName)) {
            nodes[stateName] = {name: stateName}  
          }
        }
        
        for (var j = 0 ; j < this.transitions.length ; j++) {
          for (var k = 0 ; k < this.transitions[j].states.length ; k++) {
            var source = this.transitions[j].states[k].from
              , target = this.transitions[j].states[k].to
            links.push({
              id: this.transitions[j].id,
              source: nodes[source] || (nodes[source] = {name: source}),
              target: nodes[target] || (nodes[target] = {name: target}),
              value: 1
            })
          }
        }

        var force = d3.layout.force()
          .nodes(d3.values(nodes))
          .links(links)
          .size([width, height])
          .linkDistance(120)
          .charge(-300)
          .on('tick', tick)
          .start()

        // clear the object
        d3.select('#diagram-svg-box svg').remove()

        var svg = d3.select('#diagram-svg-box')
          .append('svg')
          .attr('width', width)
          .attr('height', height)

        // build the arrow.
        svg.append('svg:defs').selectAll('marker')
            .data(['end'])      // Different link/path types can be defined here
          .enter().append('svg:marker')    // This section adds in the arrows
            .attr('id', String)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 15)
            .attr('refY', -1.5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
          .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')

        // add the transitions
        var transition = svg.selectAll('.link')
              .data(force.links())

        // add the transitions line and arrows
        var path = svg.append('svg:g').selectAll('path')
            .data(force.links())
          .enter().append('svg:path')
            .attr('class', 'link')
            .attr('marker-end', 'url(#end)')
        
        // add the transition text
        var text = svg.append('svg:g').selectAll('path')
            .data(force.links())
          .enter().append('text')
            .attr('x', 14)
            .attr('dy', '.35em')
            .text(function(d) { return d.id })

        // define the nodes
        var node = svg.selectAll('.node')
            .data(force.nodes())
          .enter().append('g')
            .attr('class', 'node')
            .call(force.drag)

        // // add the nodes
        node.append('circle')
          .attr('r', 10)

        // // add the state text 
        node.append('text')
          .attr('x', 14)
          .attr('dy', '.35em')
          .text(function(d) { return d.name })

        // // add the curvy lines
        function tick() {
          path.attr('d', function(d) {
            var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy)
            return 'M' + 
              d.source.x + ',' + 
              d.source.y + 'A' + 
              dr + ',' + dr + ' 0 0,1 ' + 
              d.target.x + ',' + 
              d.target.y
          })

          node.attr('transform', function(d) { 
            return 'translate(' + d.x + ',' + d.y + ')'
          })

          text.attr('x', function(d) {
            return (d.target.x + d.source.x) / 2
          })
          text.attr('y', function(d) {
            return (d.target.y + d.source.y) / 2
          })
        }

      }     
    }

  })
})