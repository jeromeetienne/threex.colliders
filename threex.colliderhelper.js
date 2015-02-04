var THREEx	= THREEx	|| {}

/**
 * An helper object to help visualize your colilder
 * 
 * @param {THREE.Collider} collider - the collider to monitor
 */
THREEx.ColliderHelper	= function( collider ){
	if( collider instanceof THREEx.ColliderBox3 ){
		return new THREEx.ColliderBox3Helper(collider)
	}else	console.assert(false)
}



//////////////////////////////////////////////////////////////////////////////////
//		THREEx.ColliderBox3Helper
//////////////////////////////////////////////////////////////////////////////////

/**
 * An helper object to help visualize your colilder
 * 
 * @param {THREE.Collider} collider - the collider to monitor
 */
THREEx.ColliderBox3Helper	= function( collider ){
	// check argument
	console.assert( collider instanceof THREEx.ColliderBox3 )
	// setup geometry/material
	var geometry	= new THREE.BoxGeometry(1,1,1)
	var material	= new THREE.MeshBasicMaterial({
		wireframe	: true
	})

	// create the mesh
	THREE.Mesh.call(this, geometry, material)

	/**
	 * make the helper match the collider shape. used the .updatedBox3
	 */
	this.update	= function(){
		var box3	= collider.updatedBox3
		this.scale.copy( box3.size() )
		this.position.copy( box3.center() )
	}
	
	/**
	 * free webgl memory
	 */
	this.dispose	= function(){
		geometry.dispose()
		material.dispose()
	}
}

THREEx.ColliderBox3Helper.prototype = Object.create( THREE.Mesh.prototype );
