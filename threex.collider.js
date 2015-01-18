var THREEx	= THREEx	|| {}

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


/**
 * microevents.js - https://github.com/jeromeetienne/microevent.js
 * 
 * @param {Object} destObj - the destination object
*/
THREEx.Collider.MicroeventMixin	= function(destObj){
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

THREEx.Collider.MicroeventMixin(THREEx.Collider.prototype)

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
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//		THREEx.ColliderBox3
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
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

/**
 * update this Collider
 * 
 * @param  {String=} updateMode - the update mode to use. default to this.updateMode
 */
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

/**
 * test if this collider collides with the otherCollider
 * 
 * @param {THREEx.Collider} otherCollider - the other collider
 * @return {Boolean} - true if they are in contact, false otherwise
 */
THREEx.ColliderBox3.prototype.collideWith	= function(otherCollider){
	if( otherCollider instanceof THREEx.ColliderBox3 ){
		return this.collideWithBox3(otherCollider)
	}else	console.assert(false)
}

/**
 * test if this collider collides with the otherCollider
 * 
 * @param {THREEx.ColliderBox3} otherCollider - the other collider
 * @return {Boolean} - true if they are in contact, false otherwise
 */
THREEx.ColliderBox3.prototype.collideWithBox3	= function(otherCollider){
	console.assert( otherCollider instanceof THREEx.ColliderBox3 )

	var doCollide	= this.updatedBox3.isIntersectionBox(otherCollider.updatedBox3)

	return doCollide ? true : false
}
