var canvas,context;
var mouseX,mouseY;
var grid=new Array(9);
function startGame(){
  canvas = document.getElementById("game");
  context = canvas.getContext("2d");


  for(let i=0;i<9;i++){
    grid[i]=new Array(9);
    for(let j=0;j<9;j++){
      grid[i][j]=new component(i*60+5,j*60+5,50,50,"red","blue");
    }
  }
  var interval=setInterval(updateCanvas,20);

}
function mouseMoved(e){
  mouseX=e.pageX;
  mouseY=e.pageY; //todo
}
function component(x,y,width,height,color,color_hover){
  this.x=x;
  this.y=y;
  this.width=width;
  this.height=height;
  this.color=color;
  this.color_hover=color_hover;
  this.update=function(){
    if(this.x<=mouseX&&this.x+this.width>=mouseX&&this.y<=mouseY&&this.y+this.height>=mouseY){
      context.fillStyle=color_hover;
    }else{
      context.fillStyle=color;
    }
    context.fillRect(this.x,this.y,this.width,this.height);
  }
}

function updateCanvas(){
  context.clearRect(0,0,canvas.width,canvas.height);
  context.fillStyle="#99FF99";
  context.fillRect(0,0,540,540);
  context.fillStyle="#0000FF";

  for(let i=0;i<9;i++){
    for(let j=0;j<9;j++){
      grid[i][j].update();
    }
  }

}
