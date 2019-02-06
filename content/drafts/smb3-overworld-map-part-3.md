
If we take SMB3's World 1 map and remove the decorations, we 
get something like this. It becomes apparent that every component of 
the map is aligned to a grid. 
  
![](smb3_logic-map.png)

When Mario moves, he always walks two tiles 
at a time. We can make that even clearer by darkening the empty tiles and removing the distinction between types of levels: 

![](smb3_grid.png)

We can translate that grid into a list of numbers, each representing 
one type of tile.

- `0`: Empty
- `1`: Start tile
- `2`: Level
- `3`: Path
- `4`: Blocked path
- `5`: Last level

Here's a representation of the previous grid using this method:

```js
var tiles = [
  0,0,2,3,2,3,2,3,2,3,2,
  0,0,3,0,0,0,3,0,0,0,3,
  1,3,2,0,0,0,2,3,2,3,2,
  0,0,4,0,0,0,3,0,0,0,0,
  0,0,2,3,2,3,2,0,0,0,0,
  0,0,3,0,0,0,0,0,0,0,0,
  0,0,2,0,2,3,2,3,2,3,5,
  0,0,3,0,0,0,3,0,0,0,0,
  0,0,2,3,2,3,2,0,0,0,0
]
```

We can use it to know which tile to draw every time we call the `render` 
method:

```js
var tileset = [ ' ', 'S', 'L', 'P', 'X', 'E' ]

function getTile (x, y) {
  var index = y * WIDTH + x

  return tileset[tiles[index]]
}

```
