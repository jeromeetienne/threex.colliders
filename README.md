3threex.colliders
=============

threex.colliders is a
[threex game extension for three.js](http://www.threejsgames.com/extensions/).
It provides an collider system. Each ```THREE.Object3D``` may be attached to a ```THREEx.Collider``` for AABB. Sphere will be added when time allow.
Then you add those in a ```THREEx.ColliderSystem``` and ```.computeAndNotify()``` all the collisions at this time.
When 2 colliders start colliding with each other, the event 'contactEnter' is sent to each listener. When those colliders keep colliding, the event 'contactStay' is sent. When those colliders are no more colliding, the event sent is 'contactExit'.

Show Don't Tell
===============
* [examples/basic.html](http://jeromeetienne.github.io/threex.colliders/examples/basic.html)
\[[view source](https://github.com/jeromeetienne/threex.colliders/blob/master/examples/basic.html)\] :
It shows a basic usage of this extension.
* [examples/demo.html](http://jeromeetienne.github.io/threex.colliders/examples/demo.html)
\[[view source](https://github.com/jeromeetienne/threex.colliders/blob/master/examples/demo.html)\] :
It shows all the cases of collisions.

A Screenshot
============
[![screenshot](https://raw.githubusercontent.com/jeromeetienne/threex.colliders/master/examples/images/screenshot-threex-colliders-512x512.jpg)](http://jeromeetienne.github.io/threex.colliders/examples/basic.html)

How To Install It
=================

You can install it via script tag

```html
<script src='threex.colliders.js'></script>
```

Or you can install with [bower](http://bower.io/), as you wish.

```bash
bower install threex.colliders
```

How To Use It
=============

First you need to create a ```THREEx.ColliderSystem```. It gonna handle the whole thing for you

```
var colliderSystem  = new THREEx.ColliderSystem()
```

Every time you wish to compute collision and notify associated events among colliders, just do the following

```
colliderSystem.computeAndNotify(colliders)
````

### How To Add Box3 Collider ? (or call it [AABB](http://en.wikipedia.org/wiki/Axis-aligned_bounding_box#Axis-aligned_minimum_bounding_box))

You need a ```THREE.Box3``` to define the shape of your collider.
Say you take default boundingBox from your object geometry, Or another it is all up to you.

```
object3d.geometry.computeBoundingBox()
var box3    = object3d.geometry.boundingBox.clone()
```

Now with your ```THREEx.Box3``` you create your controller

```
var collider    = new THREEx.ColliderBox3(object3d, box3)
```

### Helpers for easier creation

If you dont want to handle all those cases yourself, i create a small helper

```
var collider    = THREEx.Collider.createFromObject3d(object3d)
```

### How to receive event from colliders ?

There are 3 kind of events
    - **contactEnter(otherCollider)** which is triggered when an object start colliding with another
    - **contactExit(otherCollider)** which is notified when the object is no more colliding with another
    - **contactStay(otherCollider)** which is notified when the object is still colliding with another
    - **contactRemoved(otherColliderId)** which is notified when the other collider has been removed

To start listening on a event, just do

```
var onCollideEnter  = collider.addEventListener('contactEnter', function(otherCollider){
    console.log('contactEnter with', otherCollider.id)
})
```

To remove the event listener, do the following

```
collider.removeEventListener(onColliderEnter)
```

TODO
====
* a THREEx.ColliderGroup. it is a group of other colliders shape
* a collider for sphere, oriented bounding box etc...
