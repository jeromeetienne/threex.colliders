# Rest of the work
* what about the demo ?
        * well it is supposed to show a basic.html with simple yet comprehensible usage
        * it will show the possibilities of the extensions
        * it is possible to choose various THREE.Geometry for each shape
        * on contact the object3d will react as visual feedback for the user
        * each collider expose all the .sync* variables
        * provide some presets
                * make them as educative as possible
        * one object toward the other in X, with a light delta in Y
        * a slider to go back in time would make it more educative
* test if it works in threex.gameeditor
    - do some collision
    - like shoot leaving map
    - like shoot onColliderEnter planet, then reset planet
    - if player onColliderEnter planet, then reset the player and planet
    - see if those works. if so, document this as definitive version
* rename every thing ala unity now ? NO GO
    - is yours better ? 
    - better in the absolute ? absolutly clear
    - or better for people who know unity ?
    - are unity ones real bad ? 
    - http://unity3d.com/learn/tutorials/modules/beginner/physics/colliders-as-triggers
    - or call all that threex.triggerzones ?
        + not a bad name, and all from unity so already well known by users
        + not that bad, you can always do it later tho

# about refactor
* remove the spheres
        * keep the fork mechanism with inheritance
        * but remove all spheres
* THREEx.Collider
        * .object3d
* THREEx.ColliderBox3d inherit from THREEx.Collider
        * .shape
        * .syncPosition = true/false
        * .syncRotation = true/false
        * .syncScale = true/false
        * .sync() to sync appropriatly
                * update the .lastSyncedShape
        * .collideWith
                * it is done between .lastSyncedShape
* in THREEx.ColliderSystem.compute()
        * do a pass of .sync on all colliders
        * then call the collideWith
                * "with new api, .updateMatrixWorld is now O(n) instead of O(n*sqrt(n)). fun :)"
* How to do the helpers ? 
    - from three.js definition
        + an helper is a THREE.Object3D attached at the scene itself or attached to the helped object3d. check in editor
        + it has a .update() function which make the helper in sync with object3d 
    - in our case, it will display a AABB
    - keep the type fork in the threex.colliderhelpers.js
    - remove the sphere tho
    - it display the .lastSyncedShape
    - so to be in sync, the helper.update() MUST be called after collider.sync()
        + maybe to do a ```helper.update(forceSync)```
        + with forceSync which default to false
    - worst thing which can happen ?
        - the collider helper is 1 frame behind the collider itself.
        - we can leave with that



## More about helpers
- from three.js definition
    + an helper is a THREE.Object3D attached at the scene itself or attached to the helped object3d. check in editor
    + it has a .update() function which make the helper in sync with object3d 
- in our case, it will display a AABB
    + So a Geometry.Box3(1,1,1)
    + the size update will be done at the helper.scale level
    + the center of collider.shape box3 is the helper.position
- keep the type fork in the threex.colliderhelpers.js
- remove the sphere tho
- it display the .lastSyncedShape
- so to be in sync, the helper.update() MUST be called after collider.sync()
    + maybe to do a ```helper.update(forceSync)```
    + with forceSync which default to false
- worst thing which can happen ?
    - the collider helper is 1 frame behind the collider itself.
    - we can leave with that



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

TODO
====
* a THREEx.ColliderGroup. it is a list of defined shape
