var THREEx	= THREEx	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
THREEx.ColliderSystem	= function(){
	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////

	/**
	 * compute collisions states and notify events appropriatly
	 * @param  {THREEx.Collider[]} colliders - array of colliders
	 */
	this.computeAndNotify	= function(colliders){
		// purge states from the colliders which are no more there 
		purgeState(colliders)
		// compute and notify contacts between colliders
		notifyContacts(colliders)
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		handle colliding states
	//////////////////////////////////////////////////////////////////////////////////
	var states	= {}
	this._states	= states
	function getStateLabel(collider1, collider2){
		if( collider1.id < collider2.id )
			var stateLabel	= collider1.id + '-' + collider2.id
		else
			var stateLabel	= collider2.id + '-' + collider1.id
		return stateLabel

	}



	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////

	/**
	 * purge states 
	 * - go thru all states
	 * - any states which isnt both in colliders, remove it
	 * - if only one of both colliders is still present, notify contactRemoved(contactId)
	 * 
	 * @param  {THREE.Collider[]} colliders - base to purge state
	 */
	function purgeState(colliders){
		// remove pending states for removed collider
		Object.keys(states).forEach(function(stateLabel){
			// get leftColliderId
			var leftColliderId	= parseInt(stateLabel.match(/^([0-9]+)-/)[1])
			var rightColliderId	= parseInt(stateLabel.match(/-([0-9]+)$/)[1])

			// get colliders based on their id
			var leftCollider	= findById(colliders, leftColliderId)
			var rightCollider	= findById(colliders, rightColliderId)

			// handle differently depending on their presence
			if( leftCollider !== null && rightCollider !== null ){
				// both still present, do nothing
				return
			}else if( leftCollider !== null && rightCollider === null ){
				// right collider got removed
				leftCollider.dispatchEvent('contactRemoved', rightColliderId)
			}else if( leftCollider === null && rightCollider !== null ){
				// left collider got removed
				rightCollider.dispatchEvent('contactRemoved', leftColliderId)
			}else{
				// both got removed
			}

			// update states
			delete states[stateLabel]
		})

		return

		function findById(colliders, colliderId){
			for( var i = 0; i < colliders.length; i++ ){
				if( colliders[i].id === colliderId ){
					return colliders[i]
				}
			}
			return null
		}
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////


	/**
	 * Compute the collision and immediatly notify the listener
	 * 
	 * @param  {THREE.Collider[]} colliders - base to purge state
	 */
	function notifyContacts(colliders){
		for(var i = 0; i < colliders.length; i++){
			var collider1	= colliders[i]
			for(var j = i+1; j < colliders.length; j++){
				var collider2	= colliders[j]
				// stay if they do collide
				var doCollide	= collider1.collideWith(collider2)
				// get previous state
				var stateLabel	= getStateLabel(collider1, collider2)
				var stateExisted= states[stateLabel] ? true : false
				// process depending do Collide
				if( doCollide ){
					// notify proper events
					if( stateExisted === true ){
						dispatchEvent(collider1, collider2, 'contactStay')
					}else{
						dispatchEvent(collider1, collider2, 'contactEnter')
					}
					// update states
					states[stateLabel]	= 'dummy'
				}else{
					// notify proper events
					if( stateExisted === true ){
						dispatchEvent(collider1, collider2, 'contactExit')
					}
					// update states
					delete states[stateLabel]
				}
			}
		}
		// console.log('post notify states', Object.keys(states).length)
		return

		function dispatchEvent(collider1, collider2, eventName){
			// console.log('dispatchEvent', eventName, 'between', collider1.id, 'and', collider2.id)
			// send event to collider1
			collider1.dispatchEvent(eventName, collider2, collider1)
			// send event to collider2
			collider2.dispatchEvent(eventName, collider1, collider2)
		}
	}

	/**
	 * reset the events states
	 */
	this.reset	= function(){
		states	= {}
	}
}

