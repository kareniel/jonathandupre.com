---
title: Canvas Transforms
date: 2019-02-05
---

I made this little widget to help myself visualize the 
methods on the HTML5 canvas' 2d context. I was having a hard time drawing 
rotated tiles because keeping track of the transform matrix gets confusing.

The x-axis is red and the y-axis is green. The coordinate system starts in the upper left corner. Clicking on one of the buttons will show you the code for that function.

Try drawing a 270-degree rotated tile in the middle of the canvas!

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

<script src="https://unpkg.com/@krnl/learn-canvas@1.1.1/index.js"></script>
