
document.addEventListener("DOMContentLoaded",function(){
  var canvas = document.getElementById("game");
  var context = canvas.getContext("2d");
  context.moveTo(0,0);
  context.lineTo(200,100);
  context.stroke();
});
