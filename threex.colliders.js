var THREEx	= THREEx	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////
THREEx.ColliderSystem	= function(){

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
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
			// console.log('dispatchEvent', eventName)
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


/**
 * microevents.js - https://github.com/jeromeetienne/microevent.js
 * 
 * @param {Object} destObj - the destination object
*/
THREEx.ColliderSystem.MicroeventMixin	= function(destObj){
	destObj.addEventListener	= function(event, fct){
		if(this._events === undefined) 	this._events	= {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
		return fct;
	};
	destObj.removeEventListener	= function(event, fct){
		if(this._events === undefined) 	this._events	= {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	};
	destObj.dispatchEvent	= function(event /* , args... */){
		if(this._events === undefined) 	this._events	= {};
		if( this._events[event] === undefined )	return;
		var tmpArray	= this._events[event].slice();
		for(var i = 0; i < tmpArray.length; i++){
			var result	= tmpArray[i].apply(this, Array.prototype.slice.call(arguments, 1))
			if( result !== undefined )	return result;
		}
		return undefined;
	};
};

//////////////////////////////////////////////////////////////////////////////////
//		THREEx.Collider
//////////////////////////////////////////////////////////////////////////////////

/**
 * collider base class
 * 
 * @param {THREE.Object3D} object3d - the object
 */
THREEx.Collider	= function(object3d){
	this.id		= THREEx.Collider.idCount++
	this.object3d	= object3d
	this.userData	= {}
}

THREEx.Collider.idCount	= 0;

THREEx.ColliderSystem.MicroeventMixin(THREEx.Collider.prototype)

//////////////////////////////////////////////////////////////////////////////////
//		Comment								//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Easy create a collider from a object3d
 * 
 * @param  {THREE.Object3D}	object3d	- the object
 * @param  {String=}		hint		- hint on how to create it
 * @return {THREE.Collider}			- the create collider
 */
THREEx.Collider.createFromObject3d	= function(object3d, hint){
	hint	= hint	|| 'default'

 	if( hint === 'accurate' ){
		var box3	= new THREE.Box3()
		var collider	= new THREEx.ColliderBox3(object3d, box3, 'vertices')
	}else if( hint === 'fast' || hint === 'default' ){
		// set it from object3d
		var box3	= new THREE.Box3()
		box3.setFromObject( object3d );

		// cancel the effect of object3d.position
		var center	= box3.center()
		center.sub(object3d.position)
		// cancel the effect of object3d.scale
		var size	= box3.size()
		size.divide(object3d.scale)
		// update box3
		box3.setFromCenterAndSize(center, size)
		// actually create the collider
		var collider	= new THREEx.ColliderBox3(object3d, box3, 'positionScaleOnly')		
	}else	console.assert(false)

	return collider
}

//////////////////////////////////////////////////////////////////////////////////
//		THREEx.ColliderBox3
//////////////////////////////////////////////////////////////////////////////////

THREEx.ColliderBox3	= function(object3d, shape, updateMode){
	console.assert(shape instanceof THREE.Box3 )

	THREEx.Collider.call( this, object3d )

	this.shape	= shape
	this.updatedBox3= shape.clone()

	this.updateMode	= updateMode	|| 'vertices'
}

THREEx.ColliderBox3.prototype = Object.create( THREEx.Collider.prototype );

//////////////////////////////////////////////////////////////////////////////////
//		.update
//////////////////////////////////////////////////////////////////////////////////

THREEx.ColliderBox3.prototype.update	= function(updateMode){
	// default arguments
	updateMode	= updateMode	|| this.updateMode
	var newBox3	= this.shape.clone()

	// init newBox3 based on updateMode
	if( updateMode === 'vertices' ){
		// full recomputation of the box3 for each vertice, of geometry, of each child
		// - it is quite expensive
		newBox3.setFromObject(this.object3d)
	}else if( updateMode === 'transform' ){
		// TODO should i do that .updateMatrixWorld ?
		this.object3d.updateMatrixWorld( true );
		newBox3.applyMatrix4(this.object3d.matrixWorld)
	}else if( updateMode === 'none' ){
		// may be useful if the object3d never moves
		// - thus you do a collider.update('vertices') on init and collide.updateMode = 'none'
	}else if( updateMode === 'positionScaleOnly' ){
		// get matrix in world coordinate
		this.object3d.updateMatrixWorld( true )
		var matrix	= this.object3d.matrixWorld
		// update scale
		var scale	= new THREE.Vector3().setFromMatrixScale( matrix );
		newBox3.min.multiply(scale)
		newBox3.max.multiply(scale)
		// update position
		var position	= new THREE.Vector3().setFromMatrixPosition( matrix );
		newBox3.translate(position)
	}else	console.assert(false)

	// save this.updatedBox3
	this.updatedBox3	= newBox3
}

//////////////////////////////////////////////////////////////////////////////////
//		.collideWith
//////////////////////////////////////////////////////////////////////////////////

THREEx.ColliderBox3.prototype.collideWith	= function(otherCollider){
	if( otherCollider instanceof THREEx.ColliderBox3 ){
		return this.collideWithBox3(otherCollider)
	}else	console.assert(false)
}

THREEx.ColliderBox3.prototype.collideWithBox3	= function(otherCollider){
	console.assert( otherCollider instanceof THREEx.ColliderBox3 )

	var doCollide	= this.updatedBox3.isIntersectionBox(otherCollider.updatedBox3)

	return doCollide ? true : false
}
