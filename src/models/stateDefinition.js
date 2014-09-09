define(function(require) {
	'use strict'

	var jakmar = require('jakmar')

	var stateDef = jakmar.create()
		, updateCbs = []


	function getFlatTransitions() {
		var transitions = stateDef.getTransitions()
			,	res = []
			,	i = 0
		for (i ; i < transitions.length ; i++) {
			var transition = { id : transitions[i].id, states: [] }

			for (var fromState in transitions[i].applicableStates) {
				transition.states.push({from: fromState, to: transitions[i].applicableStates[fromState]})
			}

			res.push(transition)
		}

		return res
	}
	
	function triggerUpdate() {
		var i = 0

		stateDefModel.states = stateDef.getStates()
		stateDefModel.transitions = getFlatTransitions()

		for (; i < updateCbs.length; i++) {
			updateCbs[i]()
		}
	}

	var stateDefModel = {

		addState: function(newState) {
			var res = stateDef.state(newState)
			triggerUpdate()
			return res
		},

		addTransition: function(newTransition, fromState, toState) {
			var res = stateDef.transition(newTransition, fromState, toState)
			triggerUpdate()
			return res
		},

		onUpdate: function(cb) {
			updateCbs.push(cb)
		},

		states: [],
		transitions: [],
		currentState: ''
	}

	return stateDefModel
})