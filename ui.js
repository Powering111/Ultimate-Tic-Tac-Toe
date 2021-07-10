var help=false;
function toggleHelp(){
  if(help){
    document.getElementById("help_container").style.display="none";
    help=false;
  }else{
    document.getElementById("help_container").style.display="block";
    help=true;
  }
}

function mouse_down_all(){
  if(help){
    toggleHelp();
  }
}
function updateDisplay(){
  //document.getElementById("debug").innerHTML=gameState.time_p1+","+gameState.time_p2+" ("+gameState.time_after_finished+")";
  if(gameState.player==1){
    displayTimer(1,timer1,0);
    displayTimer(2,timer2,1);
  }
  else{
      displayTimer(2,timer1,0);
      displayTimer(1,timer2,1);
  }

}
function displayTimer(player,timer,under){
  if(player==1){
    if(gameState.time_p1>0){
      displayTimerBg(gameState.time_p1,gameState.max_time,timer,"red","#ffd4d4");
    }
    else{
      if(!under)
      displayTimerBg(gameState.time_after_finished,gameState.max_time_after_finished,timer,"#910002","#ffd4d4");
      else{
      displayTimerBg(gameState.max_time_after_finished,gameState.max_time_after_finished,timer,"#910002","#ffd4d4");
      }
    }
  }
  else{
    if(gameState.time_p2>0){
      displayTimerBg(gameState.time_p2,gameState.max_time,timer,"blue","#c4ddff");
    }
    else{
      if(!under)
      displayTimerBg(gameState.time_after_finished,gameState.max_time_after_finished,timer,"#05008a","#c4ddff");
      else
      displayTimerBg(gameState.max_time_after_finished,gameState.max_time_after_finished,timer,"#05008a","#c4ddff");
    }
  }
}
function displayTimerBg(time,maxtime,to,color1,color2){
  let percent=(time/maxtime)*100;
  to.style.background="linear-gradient(to right, "+color1+" "+(percent-3)+"%,"+color2+" "+(percent)+"%)";
}
