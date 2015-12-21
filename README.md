Entropy of boids in HTML5
===========================

Boids is
a famous simulation of birds' flocking behavior by Craig Reynolds. Three basic rules
(separation, aligment, and cohesion) generate a suprisingly complex
motion of bird-like creatures.
See [this wikipedia page](https://en.wikipedia.org/wiki/Boids) or
[Reynold's page](http://www.red3d.com/cwr/boids/) for detailed
explanation of the experiment.

[This simulation](http://jataka.hu/rics/boids) is based on <a href="https://github.com/skeeto/boids-js">Christopher Wellons' work</a>.
I have completely reused his algorithm for boids simulation.
However it is interesting to know whether birds are about to converge
in the sense that they form a large flock after a certain amount of time.
One possible way of checking this convergence is the usage of entropy.
[Entropy](https://en.wikipedia.org/wiki/Entropy_%28order_and_disorder%29) \- in general \- measure the (dis)order of particles.
Entropy \- in this context \- can be defined as the sum of average distance among birds.
(There are several other possible definition, for example taking bird
direction into account would be a natural extension.)

I have added the entropy calculation (sum of average distances)
and visualization to investigate the convergence
of bird behavior.
A new layer with two tabs above boids' two dimensional airfield shows
the entropy and some configuration parameters.
The entropy tab indicates the current entropy value and the history of
the value in a graph.
The configuration tab makes possible the modification of simulation parameters,
namely the speed and the radial speed of the birds, and their range of vision.

Wellons' original parameters do not appear to show that a large flock is
created after a while.
However there are certain configurations in which large flocks form. For example
changing range of vision from 50 to 200 or
radial distance from &Pi;/60 to 2*&Pi; would cause some kind of convergence.

More projects at [jataka.hu/rics](<a href=")http://jataka.hu/rics).
