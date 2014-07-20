threex.colliders.js
===================
* how to test the hierarchy of the THREE.Object3D

## How to support other collider
* currently seems to work with boundingSphere
    - THREE.ColliderSphere(object3d, sphere)
    - THREE.ColliderBox(object3d, box3)

* a boundingSphere can be approximated to a boundingBox
* sphereCollideSphere
    - sphere.intersectsSphere(otherSphere)
* boxCollideBox
    - box.apply matrix
    - box.isIntersectionBox(otherBox)
* boxCollideSphere (approximating sphere with box)
    - box.apply matrix
    - otherBox.setFromCenterAndSize(otherSphere.center, otherSphere.radius)
    - box.isIntersectionBox(otherBox)
* boxCollideSphere
    - box.apply matrix
    - var distance      = box.distanceToPoint(sphere.center)
    - var doCollide     = distance > sphere.radius ? true : false
