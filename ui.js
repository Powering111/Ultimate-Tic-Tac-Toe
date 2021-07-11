
var help=false,credit=false;

function time_check_changed(){
  let checked=document.getElementById("time_check").checked;
  if(checked){
    document.getElementsByClassName("time_limit")[0].style.visibility="visible";
    document.getElementsByClassName("time_limit")[1].style.visibility="visible";
  }
  else{
    document.getElementsByClassName("time_limit")[0].style.visibility="hidden";
    document.getElementsByClassName("time_limit")[1].style.visibility="hidden";
  }
}

function toggleHelp(){
  if(help){
    document.getElementById("help_container").style.display="none";
    help=false;
  }else{
    document.getElementById("help_container").style.display="block";
    help=true;
    document.getElementById("credit_container").style.display="none";
    credit=false;
  }
}
function toggleCredit(){
  if(credit){
    document.getElementById("credit_container").style.display="none";
    credit=false;
  }else{
    document.getElementById("credit_container").style.display="block";
    credit=true;
    document.getElementById("help_container").style.display="none";
    help=false;
  }
}

function mouse_down_all(){
  if(help){
    toggleHelp();
  }
  if(credit){
    toggleCredit();
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
      displayTimerBg(gameState.time_p1,gameState.max_time,timer,gameState.color_p1,gameState.color_p1_hover);
    }
    else{
      if(!under)
      displayTimerBg(gameState.time_after_finished,gameState.max_time_after_finished,timer,gameState.color_p1_cho,gameState.color_p1_hover);
      else{
      displayTimerBg(gameState.max_time_after_finished,gameState.max_time_after_finished,timer,gameState.color_p1_cho,gameState.color_p1_hover);
      }
    }
  }
  else{
    if(gameState.time_p2>0){
      displayTimerBg(gameState.time_p2,gameState.max_time,timer,gameState.color_p2,gameState.color_p2_hover);
    }
    else{
      if(!under)
      displayTimerBg(gameState.time_after_finished,gameState.max_time_after_finished,timer,gameState.color_p2_cho,gameState.color_p2_hover);
      else
      displayTimerBg(gameState.max_time_after_finished,gameState.max_time_after_finished,timer,gameState.color_p2_cho,gameState.color_p2_hover);
    }
  }
}
function displayTimerBg(time,maxtime,to,color1,color2){
  let percent=(time/maxtime)*100;
  to.style.background="linear-gradient(to right, "+color1+" "+(percent-3)+"%,"+color2+" "+(percent)+"%)";
}
function displayFinish(result){
  let elem=document.getElementById("gameFinished");

  if(result==1){
    elem.innerHTML="Player 1 승리!";
    elem.style.background_color=gameState.color_p1;
    gameState.color_bg=gameState.color_p1_hover;
  }else if(result==2){
    elem.innerHTML="Player 2 승리!";
    elem.style.background_color=gameState.color_p2;
    gameState.color_bg=gameState.color_p2_hover;

  }
  document.querySelector("body").style.backgroundColor=gameState.color_bg;
  elem.style.display="block";
}
function hideFinish(){
  document.getElementById("gameFinished").style.display="none";
  timer1.innerHTML="Player "+gameState.winner+" 승리!";
}
