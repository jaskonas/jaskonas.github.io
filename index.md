---
layout: home
permalink: /
title: ""
---

<div id="mirv-wrap"><pre id="mirv" aria-label="MIRV reentry vehicles in test"></pre><span class="mirv-caption">MK 21 RV &middot; Peacekeeper MIRV test &middot; hover</span></div>
<script>
(function(){
  var THRESH=155, FS=11, LS=0.05;
  var seq=['/','|','/','\\','|','/'];
  var img=new Image(), pre, wrap;
  var raf, on=false, t=0, art=null, resizeTimer;

  function charW(){
    var cv=document.createElement('canvas');
    var ctx=cv.getContext('2d');
    ctx.font=FS+'px "Courier New"';
    return ctx.measureText('M').width + FS*LS;
  }

  function buildArt(cols){
    var rows=Math.round(cols*(img.naturalHeight/img.naturalWidth)*0.5);
    var cv=document.createElement('canvas');
    cv.width=cols; cv.height=rows;
    var ctx=cv.getContext('2d');
    ctx.drawImage(img,0,0,cols,rows);
    var px=ctx.getImageData(0,0,cols,rows).data;
    var base=[],bright=[];
    for(var y=0;y<rows;y++){
      var row=[];
      for(var x=0;x<cols;x++){
        var i=(y*cols+x)*4;
        var lum=px[i]*0.299+px[i+1]*0.587+px[i+2]*0.114;
        row.push(lum>THRESH?'/':' ');
        if(lum>THRESH)bright.push([x,y]);
      }
      base.push(row);
    }
    return {base:base,bright:bright};
  }

  function draw(a){pre.textContent=a.map(function(r){return r.join('');}).join('\n');}

  function tick(){
    if(!on)return;
    var a=art.base.map(function(r){return r.slice();});
    for(var j=0;j<art.bright.length;j++){
      var bx=art.bright[j][0],by=art.bright[j][1];
      a[by][bx]=seq[(t+bx+by*4)%seq.length];
    }
    draw(a);t++;
    raf=requestAnimationFrame(tick);
  }

  function update(){
    var w=wrap.clientWidth||320;
    var cols=Math.max(20,Math.floor(w/charW()));
    art=buildArt(cols);
    if(!on)draw(art.base);
  }

  img.onload=function(){
    pre=document.getElementById('mirv');
    wrap=document.getElementById('mirv-wrap');
    update();
    wrap.onmouseenter=function(){on=true;tick();};
    wrap.onmouseleave=function(){on=false;cancelAnimationFrame(raf);draw(art.base);};
    window.addEventListener('resize',function(){
      clearTimeout(resizeTimer);
      resizeTimer=setTimeout(update,150);
    });
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
