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
  active:9,
  mouseX:0,mouseY:0,
  color_bg:"#45f9ff",
  color:"white",
  color_hover:"#ffc2c2",
  color_p1:"red",
  color_p2:"blue",
  color_disabled:"#333333",
  color_draw:"#8a5a94"
};
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
    else if(this.state==4){
      gameState.context.fillStyle=gameState.color_draw;
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
      this.parent.decreaseActive();
      this.parent.checkMatch(this.x,this.y);
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
function group(x,y,left,top){
  this.x=x;
  this.y=y;
  this.left=left;
  this.top=top;
  this.active=9;
  this.state=0;
  this.can=new Array(3);
  for(let i=0;i<3;i++){
    this.can[i]=new Array(3);
    for(let j=0;j<3;j++){
      this.can[i][j]=new component(this,i,j,this.left+i*gameState.gridsize+gameState.gridoffset,this.top+j*gameState.gridsize+gameState.gridoffset,gameState.gridsize-2*gameState.gridoffset,gameState.gridsize-2*gameState.gridoffset);
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
  this.checkMatch=function(x,y){
    let winner = isMatch(this.can,x,y);
    if(winner!=0){
      this.win(winner,x,y);
    }
  }
  this.decreaseActive=function(){
    this.active--;
    if(this.active==0){
      for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
          this.can[i][j].state=4;
        }
      }
      gameState.active--;
      if(gameState.active==0){
        UltimateDraw();
      }
    }
  }

  this.win=function(player){
      this.active=0;
      this.state =player;
      for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
          this.can[i][j].state=player;
        }
      }
      checkUltimateMatch(this.x,this.y);
  }
}

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

function isMatch(arr,x,y){
  let cnt=0;
  for(let i=0;i<3;i++){
    if(arr[i][y].state==1)cnt++;
    else if(arr[i][y].state==2)cnt--;
  }
  if(cnt==3){
    return 1;
  }
  else if(cnt==-3){
    return 2;
  }

  cnt=0;
  for(let i=0;i<3;i++){
    if(arr[x][i].state==1)cnt++;
    else if(arr[x][i].state==2)cnt--;
  }
  if(cnt==3){
    return 1;
  }
  else if(cnt==-3){
    return 2;
  }

  if(x==y){
    cnt=0;
    for(let i=0;i<3;i++){
      if(arr[i][i].state==1)cnt++;
      else if(arr[i][i].state==2)cnt--;
    }
    if(cnt==3){
      return 1;
    }
    else if(cnt==-3){
      return 2;
    }
  }
  if(x+y==2){
    cnt=0;
    for(let i=0;i<3;i++){
      if(arr[i][2-i].state==1)cnt++;
      else if(arr[i][2-i].state==2)cnt--;
    }
    if(cnt==3){
      return 1;
    }
    else if(cnt==-3){
      return 2;
    }
  }

  return 0;
}
function checkUltimateMatch(x,y){
  let winner = isMatch(gameState.grid,x,y);
  if(winner!=0){
    UltimateWin(winner);
  }
}
function UltimateWin(winner){
  setTimeout(function(){alert("Player "+winner+" 승리!");},500);
}
function UltimateDraw(){
  setTimeout(function(){alert("무승부");},500);
}

function setpossiblegrid(x,y){
  if(gameState.grid[x][y].active!=0){
    gameState.possiblegrid={x:x,y:y};
  }else{
    gameState.possiblegrid=0;
  }

  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      if(gameState.possiblegrid!=0&&(gameState.possiblegrid.x!=i || gameState.possiblegrid.y!=j))
        gameState.grid[i][j].setDisabled();
      else {
        gameState.grid[i][j].setEnabled();
      }
    }
  }
}
function change_player(){
  if(gameState.player==1){
    gameState.player=2;
    gameState.color_hover="#12FFFF";
  }else if(gameState.player==2){
    gameState.player=1;
    gameState.color_hover="#ffc2c2";
  }
  document.getElementById("player").innerHTML="Player "+gameState.player;

}

function mouseMoved(e){
  let cRect= gameState.canvas.getBoundingClientRect();
  gameState.mouseX=Math.round(e.clientX-cRect.left);
  gameState.mouseY=Math.round(e.clientY-cRect.top);
}
function clicked(e){
  gameState.now_hovered.click();
}
