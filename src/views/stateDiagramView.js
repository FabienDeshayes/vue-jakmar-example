define(function (require) {
	'use strict'

	var Vue = require('vue')
		, stateDefinition = require('models/stateDefinition')

	return new Vue({
		el: '#diagram',

		created: function() {
			stateDefinition.onUpdate(this.onUpdate.bind(this))
		},

		methods: {
			onUpdate: function(event) {
				this.stateDef.states = stateDefinition.states
				this.stateDef.transitions = stateDefinition.transitions
				this.$broadcast('update')
			}
		},

		data: {
			stateDef: {
				currentState: '',
				states: [],
				transitions: []
			}
		}
	})
})