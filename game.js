var gameState={
  canvas:null,
  context:null,
  player:1,
  possiblegrid:0,
  now_hovered:null,
  gridsize:60,
  gridoffset:3,
  groupoffset:5,
  grid:new Array(9),
  mouseX:0,mouseY:0,
  color_bg:"#99FF99",
  color:"white",
  color_hover:"#FFFF00",
  color_p1:"red",
  color_p2:"blue",
  color_disabled:"#333333"
};
function startGame(){
  gameState.canvas = document.getElementById("game");
  gameState.context = gameState.canvas.getContext("2d");


  for(let i=0;i<9;i++){
    gameState.grid[i]=new Array(9);
    for(let j=0;j<9;j++){
      gameState.grid[i][j]=new group(i,j,i*(3*gameState.gridsize+gameState.groupoffset),j*(3*gameState.gridsize+gameState.groupoffset));
    }
  }
  var interval=setInterval(updateCanvas,20);

}
function mouseMoved(e){
  let cRect= gameState.canvas.getBoundingClientRect();
  gameState.mouseX=Math.round(e.clientX-cRect.left);
  gameState.mouseY=Math.round(e.clientY-cRect.top); //todo

  document.getElementById("mousePosition").innerHTML=gameState.mouseX+", "+gameState.mouseY;
}
function group(x,y,left,top){
  this.x=x;
  this.y=y;
  this.left=left;
  this.top=top;
  this.active=9;
  this.can=new Array(3);
  for(let i=0;i<3;i++){
    this.can[i]=new Array(3);
    for(let j=0;j<3;j++){
      this.can[i][j]=new component(this,i+1,j+1,this.left+i*gameState.gridsize+gameState.gridoffset,this.top+j*gameState.gridsize+gameState.gridoffset,gameState.gridsize-2*gameState.gridoffset,gameState.gridsize-2*gameState.gridoffset);
    }
  }
  this.update=function(){
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        this.can[i][j].update();
      }
    }
  }
  this.setEnabled=function(){
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        this.can[i][j].setEnabled();
      }
    }
  }
  this.setDisabled=function(){
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        this.can[i][j].setDisabled();
      }
    }
  }
}
function setpossiblegrid(x,y){
  if(gameState.grid[x-1][y-1].active!=0){
    gameState.possiblegrid={x:x,y:y};
  }else{
    gameState.possiblegrid=0;
  }

  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      if(gameState.possiblegrid!=0&&(gameState.possiblegrid.x-1!=i || gameState.possiblegrid.y-1!=j))
        gameState.grid[i][j].setDisabled();
      else {
        gameState.grid[i][j].setEnabled();
      }
    }
  }
}
function component(parent,x,y,left,top,width,height){
  this.parent=parent;
  this.x=x;
  this.y=y;
  this.left=left;
  this.top=top;
  this.width=width;
  this.height=height;
  this.state=0;
  this.mouseHovered=function(){
    return this.left-gameState.gridoffset<=gameState.mouseX&&this.left+this.width+gameState.gridoffset>gameState.mouseX&&this.top-gameState.gridoffset<=gameState.mouseY&&this.top+this.height+gameState.gridoffset>gameState.mouseY;
  }
  this.update=function(){
    if(this.state==1){
      gameState.context.fillStyle=gameState.color_p1;
    }
    else if(this.state==2){
      gameState.context.fillStyle=gameState.color_p2;
    }
    else if(this.state==3){
      gameState.context.fillStyle=gameState.color_disabled;
    }
    else if(this.mouseHovered()){
      gameState.context.fillStyle=gameState.color_hover;
      gameState.now_hovered=this;
    }else{
      gameState.context.fillStyle=gameState.color;
    }
    gameState.context.fillRect(this.left,this.top,this.width,this.height);
  }
  this.click=function(){
    if(this.state==0 && this.mouseHovered()){
      this.state=gameState.player;
      this.parent.active--;
      change_player();
      setpossiblegrid(this.x,this.y);
    }
  }
  this.setEnabled=function(){
    if(this.state==3)
    this.state=0;
  }
  this.setDisabled=function(){
    if(this.state==0)
      this.state=3;
  }
}
function change_player(){
  if(gameState.player==1){
    gameState.player=2;
  }else if(gameState.player==2){
    gameState.player=1;
  }
  document.getElementById("player").innerHTML="Player "+gameState.player;
}
function clicked(e){
  gameState.now_hovered.click();
}
function updateCanvas(){
  gameState.context.clearRect(0,0,gameState.canvas.width,gameState.canvas.height);
  gameState.context.fillStyle=gameState.color_bg;
  gameState.context.fillRect(0,0,550,550);

  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      gameState.grid[i][j].update();
    }
  }

}
