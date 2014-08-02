var THREEx	= THREEx	|| {}


THREEx.ColliderHelper	= function( collider ){
	if( collider instanceof THREEx.ColliderBox3 ){
		return new THREEx.ColliderBox3Helper(collider)
	}else	console.assert(false)
}

//////////////////////////////////////////////////////////////////////////////////
//		THREEx.ColliderBox3Helper
//////////////////////////////////////////////////////////////////////////////////
THREEx.ColliderBox3Helper	= function( collider ){
	console.assert( collider instanceof THREEx.ColliderBox3 )
	// there are 2 shapes for collider
	var geometry	= new THREE.BoxGeometry(1,1,1)
	var material	= new THREE.MeshBasicMaterial({
		wireframe	: true
	})

	// create the mesh
	THREE.Mesh.call(this, geometry, material)

	/**
	 * make the helper match the collider shape
	 */
	this.update	= function(){
		var box3	= collider.updatedBox3
		this.scale.copy( box3.size() )
		this.position.copy( box3.center() )
	}
}

THREEx.ColliderBox3Helper.prototype = Object.create( THREE.Mesh.prototype );



