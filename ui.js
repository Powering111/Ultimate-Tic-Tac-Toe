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
