---
layout: home
permalink: /
title: ""
image:
  feature: mirv3.png
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

I am a Member of the [Policy Planning Staff](https://www.state.gov/bureaus-offices/under-secretary-for-political-affairs/policy-planning-staff/) at the U.S. Department of State, an Assistant Professor of Politics and Fellow at the [Center for the Study of Statesmanship](https://css.cua.edu/team-members/jonathan-askonas/) at the Catholic University of America, and a Senior Fellow at the [Foundation for American Innovation](https://www.thefai.org/). I co-host [The Dynamist](https://www.thefai.org/the-dynamist), a podcast on technology, politics, and society.

My research focuses on military adaptation and organizational learning, the political economy of technology, and American grand strategy. I am completing two books: *A Muse of Fire: Why the U.S. Military Forgets What It Learns in War* (manuscript completed) and *The Shot in the Dark: A History of the U.S. Army Asymmetric Warfare Group, 2006–2021* (under contract with the U.S. Army).

I hold a DPhil in Politics from the University of Oxford and a B.S.F.S. *summa cum laude* from Georgetown University's School of Foreign Service.

I am grateful for the generous support of the following organizations:

+ [The John Templeton Foundation](https://www.templeton.org/)
+ [The Smith Richardson Foundation](https://www.srf.org/)
+ [The Clements Center for National Security](http://www.clementscenter.org)
+ [The Mercatus Center](https://www.mercatus.org/)
+ [The Cyril Foster Fund](http://www.politics.ox.ac.uk)
+ [The Beinecke Scholarship](http://fdnweb.org/beinecke/)
+ [Georgetown University](http://www.georgetown.edu)
