# SAT_JS
Small demo showing how Separating Axis Theorem (SAT) could be achieved using javascript.
This is in no way an optimised piece of code. Instead it is just meant to act as a guide as to how this could all work, and it could possibly be used as is, but if performance is an issue, there are many things that could be addressed.

The code is roughly based on the original Action Script version of my [SAT example files](https://github.com/sevdanski/SAT_AS3) which can be found in my other repo.

For a full explanation of how it all works (and a example of this demo) please check out the article on my blog: [Separating Axis Theorem (SAT) Explained](https://www.sevenson.com.au/actionscript/sat/).

## Project Rundown

This project contains a number of pieces that should be fairly straight forward.

The `index.html` file is a basic html template with the links to the required js and css files.  It contains a single line call to create the `SATDemo` class which then injects the required hmtl into the target DIV.

The `sat.js` file contains all of the classes used to define the SAT geometry and do the required calculations.  This is where all the core logic lives.

The `satdemo.js` file contains all the logic to create and operate the interactive demo.  It is designed to automatically populate a target DIV element with a canvase and some ui controls.

There are a couple of `css` files as well that are just to make sure that the UI elements are rendered at a suitable size and to prevent the controls from looking like total garbage.

## How To Use

If you open up the `index.html` file in a browser, it should automatically create the interactive demo with two random shapes displayed.

Use your mouse to click on the centre of a shape and then drag the shapes around causing them to overlap.  When a collision is detected, the shapes will turn red, and a possible resolution to the collision will be drawn in grey.

You can use the UP and DOWN arrow keys to control the scale of the selected shape, and the LEFT and RIGHT arrow keys to control the rotation.

There are two drop down boxes at the bottom of the demo that lets you change the shapes you are comparing.