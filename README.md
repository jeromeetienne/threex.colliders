threex.colliders
=============

threex.coloradjust is a 
[threex game extension for three.js](http://www.threejsgames.com/extensions/).
It provides an collider system. Each ```THREE.Object3D``` may be attached to a ```THREEx.Collider``` for Sphere or AABB.
Then you add those in a ```THREEx.ColliderSystem``` and ```.compute()``` all the collisions at this time.
When 2 colliders start colliding with each other, the event 'collideEnter' is sent to each listener. When those colliders keep colliding, the event 'collideStay' is sent. When those colliders are no more colliding, the event sent is 'collideExit'. 

Show Don't Tell
===============
* [examples/basic.html](http://jeromeetienne.github.io/threex.colliders/examples/basic.html)
\[[view source](https://github.com/jeromeetienne/threex.colliders/blob/master/examples/basic.html)\] :
It shows a basic usage of this extension.
* [examples/demo.html](http://jeromeetienne.github.io/threex.colliders/examples/demo.html)
\[[view source](https://github.com/jeromeetienne/threex.colliders/blob/master/examples/demo.html)\] :
It shows a more elaborate usage of this extension.

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

Every time you wish to notify collision event, just do the following

```
colliderSystem.compute()        
````

### How To Add Sphere Collider ?

First you get THREE.Sphere.
Say you get the default bounding sphere of the object geometry

```
var sphere  = object3d.geometry.boundingSphere.clone()
```

Then from it, you create the collider

```
var collider    = new THREEx.ColliderSphere(object3d, sphere)
```

Dont forget, to add collider in the system

```
colliderSystem.add(collider)
```

And you are done! :)

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

and add it to the system

```
colliderSystem.add(collider)
```

### Helpers for easier creation

If you dont want to handle all those cases yourself, i create a small helper

```
var collider    = THREEx.Collider.createFromObject3d(object3d)
```

### How to receive event from colliders ?

There are 3 kind of events
    - **collideEnter** which is triggered when an object start colliding with another
    - **collideExit** which is notified when the object is no more colliding with another
    - **collideStay** which is notified when the object is still colliding with another

To start listening on a event, just do

```
var onCollideEnter  = collider.addEventListener('colliderEnter', function(otherObject3d, myObject3d){
    console.log('contactEnter', myObject3d.name, 'with', otherObject3d.name)
})
```

To remove the event listener, do the following

```
collider.removeEventListener(onColliderEnter)
```

The full callback to notify collision event is 

```
collider.addEventListener('colliderEnter', function(otherObject3d, myObject3d, otherCollider, myCollider){  
})
```