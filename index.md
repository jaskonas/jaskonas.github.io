---
layout: home
permalink: /
title: ""
---

<div id="mirv-wrap"><pre id="mirv" aria-label="MIRV reentry vehicles in test"></pre><span class="mirv-caption">MK 21 RV &middot; Peacekeeper MIRV test &middot; hover</span></div>
<script>
(function(){
  var COLS=90;
  var CHARS=' .,:;+=|/!*#@';
  var img=new Image();
  img.onload=function(){
    var rows=Math.round(COLS*(img.naturalHeight/img.naturalWidth)*0.5);
    var cv=document.createElement('canvas');
    cv.width=COLS;cv.height=rows;
    var ctx=cv.getContext('2d');
    ctx.drawImage(img,0,0,COLS,rows);
    var px=ctx.getImageData(0,0,COLS,rows).data;
    var base=[],bright=[];
    for(var y=0;y<rows;y++){
      var row=[];
      for(var x=0;x<COLS;x++){
        var i=(y*COLS+x)*4;
        var lum=px[i]*0.299+px[i+1]*0.587+px[i+2]*0.114;
        row.push(CHARS[Math.round(lum/255*(CHARS.length-1))]);
        if(lum>165)bright.push([x,y]);
      }
      base.push(row);
    }
    var pre=document.getElementById('mirv');
    function draw(a){pre.textContent=a.map(function(r){return r.join('');}).join('\n');}
    draw(base);
    var raf,on=false,t=0;
    var seq=['/','|','/','\\','!','|','/','|','\\','/','!','|'];
    function tick(){
      if(!on)return;
      var a=base.map(function(r){return r.slice();});
      for(var j=0;j<bright.length;j++){
        var bx=bright[j][0],by=bright[j][1];
        a[by][bx]=seq[(t+bx+by*4)%seq.length];
      }
      draw(a);t++;
      raf=requestAnimationFrame(tick);
    }
    var w=document.getElementById('mirv-wrap');
    w.onmouseenter=function(){on=true;tick();};
    w.onmouseleave=function(){on=false;cancelAnimationFrame(raf);draw(base);};
  };
  img.src='{{ site.url }}/images/mirv3.png';
})();
</script>

I am a [Fellow at the Center for the Study of Statesmanship at the Catholic University of America](https://css.cua.edu/team-members/jonathan-askonas/) and a member of the [Politics faculty](http://politics.catholic.edu). I was previously a Predoctoral Research Fellow at the [Clements Center for National Security](http://www.clementscenter.org) at the University of Texas at Austin.

I am grateful for the generous support of the following organizations:

+ [The Smith Richardson Foundation](https://www.srf.org/)
+ [The Cyril Foster Fund](http://www.politics.ox.ac.uk)
+ [The Charles Koch Foundation](https://www.charleskochfoundation.org/)
+ [The Tobin Project](https://www.tobinproject.org/)
+ [The Ridgway Family Endowment](https://ahec.armywarcollege.edu/ridgway.cfm)
+ [The Beinecke Scholarship](http://fdnweb.org/beinecke/)
+ [Georgetown University](http://www.georgetown.edu)
+ [The Mercatus Center](https://www.mercatus.org/)
