var gameState,interval;
var accumulatedMs=0,last_frame;
var timer1,timer2;
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
      decreaseActive();
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
      decreaseActive();
  }
}

function startGame(){
  gameState={
    game:true,
    paused:false,
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
    color_bg:"#f3e6fc",
    color:"white",
    color_hover:"#ffc2c2",
    color_p1:"red",
    color_p2:"blue",
    color_disabled:"#333333",
    color_draw:"#8a5a94",
    max_time:60,
    time_p1:0,
    time_p2:0,
    max_time_after_finished:10,
    time_after_finished:10,
    time_started:0
  };
  gameState.time_p1=gameState.time_p2=gameState.max_time;
  gameState.time_started=last_frame=new Date().getTime();
  gameState.canvas = document.getElementById("game");
  gameState.context = gameState.canvas.getContext("2d");

  for(let i=0;i<9;i++){
    gameState.grid[i]=new Array(9);
    for(let j=0;j<9;j++){
      gameState.grid[i][j]=new group(i,j,i*(3*gameState.gridsize+gameState.groupoffset),j*(3*gameState.gridsize+gameState.groupoffset));
    }
  }
  interval=setInterval(update,20);
  timer1=document.getElementById('player');
  timer2=document.getElementById('player_c');

}
function update(){
  gameState.context.clearRect(0,0,gameState.canvas.width,gameState.canvas.height);
  gameState.context.fillStyle=gameState.color_bg;
  gameState.context.fillRect(0,0,550,550);

  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      gameState.grid[i][j].update();
    }
  }
  updateTime();
  updateDisplay();
  document.getElementById("debug").innerHTML=gameState.active;

}
function updateTime(){
  let now_frame = new Date().getTime();
  accumulatedMs+=now_frame - last_frame;
  last_frame=now_frame;
  if(accumulatedMs>=1000){
    if(gameState.player==1){
      if(gameState.time_p1<=0){
        gameState.time_after_finished--;
        if(gameState.time_after_finished<=0){
          change_player();

        }
      }else{
        gameState.time_p1--;
      }
    }
    else{
      if(gameState.time_p2<=0){
        gameState.time_after_finished--;
        if(gameState.time_after_finished<=0){
          change_player();

        }
      }else{
        gameState.time_p2--;
      }
    }
    accumulatedMs=0;
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
  gameState.game=false;
  clearInterval(interval);
  setTimeout(function(){alert("Player "+winner+" 승리!");},500);
  update();
}
function UltimateDraw(){
  gameState.game=false;
  clearInterval(interval);
  setTimeout(function(){alert("무승부");},500);
  update();
}
function decreaseActive(){
  gameState.active--;
  if(gameState.active==0&&gameState.game==true){
    UltimateDraw();
  }
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
    document.getElementById("player").innerHTML="Player 2";
  }else if(gameState.player==2){
    gameState.player=1;
    gameState.color_hover="#ffc2c2";
    document.getElementById("player").innerHTML="Player 1";
  }
  accumulatedMs=0;
  gameState.time_after_finished=gameState.max_time_after_finished;
}

function mouseMoved(e){
  let cRect= gameState.canvas.getBoundingClientRect();
  gameState.mouseX=Math.round(e.clientX-cRect.left);
  gameState.mouseY=Math.round(e.clientY-cRect.top);
}
function clicked(e){
  gameState.now_hovered.click();
}
