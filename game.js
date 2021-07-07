var canvas,context;
var mouseX,mouseY;
var grid=new Array(9);
var gridsize=60;
var gridoffset=3;
var now_selected;
function startGame(){
  canvas = document.getElementById("game");
  context = canvas.getContext("2d");


  for(let i=0;i<9;i++){
    grid[i]=new Array(9);
    for(let j=0;j<9;j++){
      grid[i][j]=new group(i,j,(i*3*gridsize),(j*3*gridsize));
    }
  }
  var interval=setInterval(updateCanvas,20);

}
function mouseMoved(e){
  let cRect= canvas.getBoundingClientRect();
  mouseX=Math.round(e.clientX-cRect.left);
  mouseY=Math.round(e.clientY-cRect.top); //todo

  document.getElementById("mousePosition").innerHTML=mouseX+", "+mouseY;
}
function group(x,y,left,top){
  this.x=x;
  this.y=y;
  this.left=left;
  this.top=top;
  this.can=new Array(3);
  for(let i=0;i<3;i++){
    this.can[i]=new Array(3);
    for(let j=0;j<3;j++){
      this.can[i][j]=new component(i+1,j+1,this.left+i*gridsize+gridoffset,this.top+j*gridsize+gridoffset,gridsize-2*gridoffset,gridsize-2*gridoffset,"red","blue");
    }
  }
  this.update=function(){
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        this.can[i][j].update();
      }
    }
  }
}
function component(x,y,left,top,width,height,color,color_hover){
  this.x=x;
  this.y=y;
  this.left=left;
  this.top=top;
  this.width=width;
  this.height=height;
  this.color=color;
  this.color_hover=color_hover;
  this.update=function(){
    if(this.left-gridoffset<=mouseX&&this.left+this.width+gridoffset>=mouseX&&this.top-gridoffset<=mouseY&&this.top+this.height+gridoffset>=mouseY){
      context.fillStyle=color_hover;
      now_selected=this;
    }else{
      context.fillStyle=color;
    }
    context.fillRect(this.left,this.top,this.width,this.height);
  }
}
function clicked(e){
  alert(now_selected.x+","+now_selected.y);
}
function updateCanvas(){
  context.clearRect(0,0,canvas.width,canvas.height);
  context.fillStyle="#99FF99";
  context.fillRect(0,0,540,540);
  context.fillStyle="#0000FF";

  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      grid[i][j].update();
    }
  }

}
