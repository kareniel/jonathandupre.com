---
title: Canvas Transforms
date: 2019-02-05
---

I made this little widget to help myself visualize the 
methods on the HTML5 canvas' 2d context. I was having a hard time drawing 
rotated tiles because keeping track of the transform matrix can get confusing when you don't understand how it works.

The x-axis is red and the y-axis is green. Clicking on one of the buttons will show you the code for that function.

<div id="learn-canvas">
  <style>
    button {
      margin: 0.25rem 0.15rem;
      border: 1px solid #131313;
      background-color: #131313;
      color: #fff;
      cursor: pointer;
    }
  </style>
</div>

You can imagine the rendering context as a plane that's superimposed over the canvas. When you are painting an image on a canvas, you have to manipulate the rendering context so that it faces the canvas in the right way. 

There are three transformation operations that can be done: scale, rotate and translate. These operations always apply on the rendering context, not on the canvas itself. That means that the origin (0, 0) is in the upper-left corner only if the context hasn't moved.

You can use the scale operation to flip the context along one or both axes. The x-axis follows the horizontal edges of the canvas by default. But if the context is rotated by 90 degrees, suddenly the x-axis follows the vertical edges. That means that flipping accross the x-axis axis would result in a vertical flip.

Try drawing a 270-degree rotated tile in the middle of the canvas!

<script src="https://unpkg.com/@krnl/learn-canvas@1.1.1/index.js"></script>
