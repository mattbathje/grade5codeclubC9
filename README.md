Ardmore School 5th Grade Code Club - HTML 5 Platformer 8 week course
====================================================================
Based on Mozilla Dev's HTML5 Games Workshop: https://mozdevs.github.io/html5-games-workshop/

Requires Phaser.io: http://phaser.io/   (which is included in the js folder)

See the instructional videos on my YouTube channel: https://www.youtube.com/channel/UCl6__R50LO_ED4rL2uhRhtw

How to use the Editor
=====================
* Run editor.html
* Make the changes you want to the level
  * Double-click icons in the black bar at the bottom to add them to the game
  * Drag game objects around to place them where you want
  * Double click game objects to remove them from the game
* When you have your level how you want it, click the Save button
  * This will save the JSON code for the level to your clipboard
  * Paste the JSON code into a new level json file (for example level03.json), and place the file in the data sub-directory
  * Edit PayState.preload in main.js and add the code to load the new level file
  * Increase the LEVEL_COUNT constant by 1