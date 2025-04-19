
/**
 * Meter gauge with pointer and cent scale
 */
const Meter = function(selector){
  this.$root = document.querySelector(selector);
  this.$pointer = this.$root.querySelector('.meter-pointer');
  this.init();
};

Meter.prototype.init = function(){
  // draw cent scale (–50c to +50c, step 10c)
  for(let i=0;i<=10;i++){
    const $scale=document.createElement('div');
    $scale.className='meter-scale';
    $scale.style.transform=`rotate(${i*9-45}deg)`;
    if(i%5===0) $scale.classList.add('meter-scale-strong');
    this.$root.appendChild($scale);
  }
  // add quarter/half‐tone labels once
  this.createLabels();
};

Meter.prototype.createLabels = function(){
  const createLabel=(deg,text,radius)=>{
    const lbl=document.createElement('div');
    lbl.className='meter-label';
    lbl.style.transform=`rotate(${deg}deg) translateY(-${radius}px) rotate(${-deg}deg)`;
    lbl.textContent=text;
    this.$root.appendChild(lbl);
  };
  createLabel(-45,'−½',24);
  createLabel(-22.5,'−¼',18);
  createLabel(22.5,'+¼',18);
  createLabel(45,'+½',24);
};

/**
 * Update pointer angle
 * @param {number} deg
 */
Meter.prototype.update=function(deg){
  this.$pointer.style.transform=`rotate(${deg}deg)`;
};
