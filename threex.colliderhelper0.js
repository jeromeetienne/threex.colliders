var THREEx	= THREEx	|| {}


THREEx.ColliderHelper	= function( collider ){
	if( collider instanceof THREEx.ColliderBox3 ){
		return new THREEx.ColliderBox3Helper(collider)
	}else if( collider instanceof THREEx.ColliderSphere ){
		return new THREEx.ColliderSphereHelper(collider)
	}else	console.assert(false)
}

//////////////////////////////////////////////////////////////////////////////////
//		THREEx.ColliderBox3Helper
//////////////////////////////////////////////////////////////////////////////////
THREEx.ColliderBox3Helper	= function( collider ){
	console.assert( collider instanceof THREEx.ColliderBox3 )
	// there are 2 shapes for collider
	var geometry	= new THREE.CubeGeometry(1,1,1)
	var material	= new THREE.MeshBasicMaterial({
		wireframe	: true
	})

	// create the mesh
	THREE.Mesh.call(this, geometry, material)


	/**
	 * make the helper match the collider shape
	 */
	this.update	= function(){
		var box3	= collider.box3.clone()
		collider.object3d.updateMatrixWorld( true );
		box3.applyMatrix4(collider.object3d.matrixWorld)

		this.scale.copy( box3.size() )
		this.position.copy( box3.center() )
	}
}

THREEx.ColliderBox3Helper.prototype = Object.create( THREE.Mesh.prototype );


//////////////////////////////////////////////////////////////////////////////////
//		THREEx.ColliderSphereHelper
//////////////////////////////////////////////////////////////////////////////////
THREEx.ColliderSphereHelper	= function( collider ){
	console.assert( collider instanceof THREEx.ColliderSphere )
	// there are 2 shapes for collider
	var geometry	= new THREE.SphereGeometry(0.5, 32, 16)
	var material	= new THREE.MeshBasicMaterial({
		wireframe	: true
	})
	// create the mesh
	THREE.Mesh.call(this, geometry, material)


	/**
	 * make the helper match the collider shape
	 */
	this.update	= function(){
		var sphere	= collider.sphere.clone()
		collider.object3d.updateMatrixWorld( true );
		sphere.applyMatrix4(collider.object3d.matrixWorld)

		this.scale.set(1,1,1).multiplyScalar( 2*sphere.radius )
		this.position.copy( sphere.center )
	}
}

THREEx.ColliderSphereHelper.prototype = Object.create( THREE.Mesh.prototype );



