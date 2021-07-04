var gameObject1,gameObject2,gameObject3;
var canvas,context;
function startGame(){
  canvas = document.getElementById("game");
  context = canvas.getContext("2d");

  gameObject1=new component(0,0,100,100,"red");
  gameObject2 = new component(300,30,20,20,"yellow");
  gameObject3 = new component(50,10,30,5,"blue");


  var interval=setInterval(updateCanvas,20);

}

function component(x,y,width,height,color){
  this.x=x;
  this.y=y;
  this.width=width;
  this.height=height;
  this.color=color;
  this.update=function(){
    context.fillStyle=color;
    context.fillRect(this.x,this.y,this.width,this.height);
  }
}

function updateCanvas(){
  context.clearRect(0,0,canvas.width,canvas.height);
  context.fillStyle="#99FF99";
  context.fillRect(0,0,500,500);
  context.fillStyle="#0000FF";

  gameObject1.update();
  gameObject2.update();
  gameObject3.update();


}
