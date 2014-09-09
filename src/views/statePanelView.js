define(function (require) {
	'use strict'

	var Vue = require('vue')
		, stateDefinition = require('models/stateDefinition')

	return new Vue({
		el: '#controls',

		created: function() {
			stateDefinition.onUpdate(this.onUpdate.bind(this))
		},

		methods: {
			onAddStateClick: function() {
				stateDefinition.addState(this.newState)
				this.newState = ''
				this.newTransitionFromState = this.newTransitionToState = ''
			},

			onAddTransitionClick: function() {
				stateDefinition.addTransition(this.newTransitionId, this.newTransitionFromState, this.newTransitionToState)
				this.newTransitionId = this.newTransitionFromState = this.newTransitionToState = ''
			},

			onUpdate: function() {
				this.states = stateDefinition.states
				this.transitions = stateDefinition.transitions
			}
		},

		data: {
			newState: '',
			newTransitionId: '',
			newTransitionFromState: '',
			newTransitionToState: '',
			states: stateDefinition.states,
			transitions: stateDefinition.transitions
		}
	})
})