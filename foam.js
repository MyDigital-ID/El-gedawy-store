(function(){
 var c=document.querySelector('.bubbles-container');
 if(!c){c=document.createElement('div');c.className='bubbles-container';document.body.prepend(c)}
 c.innerHTML='';
 var cls=['blue','blue','blue','orange','yellow'];
 for(var i=0;i<26;i++){
  var b=document.createElement('div'),s=14+Math.random()*70;
  b.className='bubble '+cls[i%cls.length];
  b.style.cssText='left:'+Math.random()*96+'%;width:'+s+'px;height:'+s+'px;animation-duration:'+(11+Math.random()*16)+'s;animation-delay:-'+Math.random()*20+'s';
  c.appendChild(b);
 }
})();
