/*!
 * tv.com
 *
 * MIT licensed
 * Copyright (C) 2014 Thibaut Villemont, http://moderntree.net
 */


var App = (function () {

    var pixelDataRef = new Firebase('https://tvillemont.firebaseio.com/'),
        obj = { foo: { bar: 'rgba(0,0,0,0.7)',  bar2: 50 } },
        ii = 0,
        zz = 1500,
        palette = [],
        frequency = 0.3, //.1;
        amplitude = 127,
        center = 200,
        width = 90,
        canvas = document.createElement('canvas'),
        c = canvas.getContext('2d'),
        iter = 750,
        x1, y1, x2, y2,
        radius = window.innerWidth / 3,
        theta = 0, t;
  
      return {
          init: function() {
  
            if (canvas.getContext){
  
              document.body.appendChild(canvas);
  
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;
  
              c.fillStyle = 'white';
              c.fillRect(0, 0, canvas.width, canvas.height);
  
            } else {
              // force fadeOut
              var divsToFade = document.querySelectorAll('.load');
                for (var iz = 0, len = divsToFade.length; iz < len; iz++) {
                  divsToFade[iz].classList.remove('load');
                }
  
            }
  
            pixelDataRef.on('child_changed', this.triggerClick);
  
            this.makePalette();
            this.eventsCustom();
            
             
          },
  
          eventsCustom: function() {
  
            [].forEach.call(document.querySelectorAll('article a'), App.clickMenu);
            [].forEach.call(document.querySelectorAll('h1 a'), App.clickMenu);
  
            var innerL = document.querySelectorAll('.content a');
  
              for (var i=0; i<innerL.length; i++){
                innerL[i].setAttribute('target', '_blank');
                innerL[i].addEventListener('click', function(el) {
                  var url =  el.target.href;
                  ga('send', 'event', 'sortie', url);
                })
  
              }
  
          },
  
          clickMenu : function (el) {
              
              el.addEventListener('click', function(el) {
  
                var active = '.'+el.target.id;
                var links = document.querySelectorAll('article a');
  
                    for (var i = 0, len = links.length; i < len; i++) {
                        links[i].classList.remove('active');
                    }
                    el.target.classList.add('active');
  
  
  
                App.triggerClick();
                
                pixelDataRef.child('cc').set(ii);
  
                var divs = document.querySelectorAll('.content');
  
                    for (var i = 0, len = divs.length; i < len; i++) {
                        divs[i].classList.add('hide');
                    }
  
                var activeDivs = document.querySelectorAll('.content'+active);
                    activeDivs[0].classList.remove('hide');
  
              });
  
          },
  
          convertHex: function(hex,opacity) {
              hex = hex.replace('#','');
              r = parseInt(hex.substring(0,2), 16);
              g = parseInt(hex.substring(2,4), 16);
              b = parseInt(hex.substring(4,6), 16);
  
              result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
              return result;
          },
  
          byte2Hex: function (n) {
            var nybHexString = "0123456789ABCDEF";
            return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
          },
  
          RGB2Color: function(r,g,b) {
            return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
          },
  
          triggerClick: function () {
  
            if(ii % 2 === 0) {
  
                obj.foo.bar2 = zz = 190;
                obj.foo.bar = palette[ii];
                App.paletteS(palette,ii,obj,zz);
  
            } else {
  
                obj.foo.bar = palette[ii];
                obj.foo.bar2 = zz = 750;
                
            }
             
            ii++; ii++;
  
            if(ii == 64) { ii = 0; }
  
          },
  
          makePalette: function() {
            for (var i = 0; i < 64; ++i)
              {
                red   = Math.sin(frequency*i + 0) * width + center;
                green = Math.sin(frequency*i + 2) * width + center;
                blue  = Math.sin(frequency*i + 4) * width + center;
                palette.push(this.convertHex(this.RGB2Color(red,green,blue),90));
                palette.push(this.convertHex(this.RGB2Color(red,green,blue),20));
              }
          },
  
          paletteS: function (palette,ii,obj,zz) {
  
            var time = Math.random() * 180; // 400
            setTimeout(function() {
              obj.foo.bar2 = zz = 270; //370
              obj.foo.bar = '';
            }, time, palette, ii,obj,zz);
  
          },
  
          render: function() {
  
            //c.save();
            c.translate(window.innerWidth / 2, window.innerHeight / 2);
            c.strokeStyle = 'rgba(0,0,0,0.7)';
  
            for (var i = 0; i < iter; i++){
  
              theta += 0.1;
              t = Math.pow(theta, 5);
              x2 = x1;
              y2 = y1; //radius * Math.sin(t)
              
              if (Math.random() < 0.005) {
                   x1 = window.innerWidth*2;
              } else {
                 x1 = radius * Math.tan(t);
              }
              
              if (Math.random() > 0.5) {
                  y1 = radius * Math.tan(t);
              } else {
                y1 = window.innerHeight*2;
              }
              
              if(theta > 400 && theta <400.1) { // show content
                var divsToFade = document.querySelectorAll('.load');
                for (var iz = 0, len = divsToFade.length; iz < len; iz++) {
                  divsToFade[iz].classList.remove('load');
                }
              }
  
              if (x2 && y2) {
  
                c.lineWidth = 0.1 + Math.random() * 1;
  
                if (Math.random() < 0.0005) {
                  c.lineWidth = 0.03 + Math.random() * Math.random() * 2;
                }
               
                c.beginPath();
                c.moveTo(x1, y2); //or y1,y2
                c.lineTo(y2, x1);
                c.rotate(10 * Math.PI / 180);
  
                if(theta > 4000) {
                  iter = obj.foo.bar2;
                  c.strokeStyle = obj.foo.bar; //'rgba(155,155,155,0.3)';
                  c.stroke();
                }
                
                else {
                  c.stroke();
                }
  
              }
  
            }
            
            c.restore();
  
          }
  
    
  
  
      };
  
  })();
  
  
  document.addEventListener("DOMContentLoaded", function() {
  
  
  App.init();
  
  
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();
  
  
  (function animloop(){
    requestAnimFrame(animloop);
    App.render();
  })();
  
  
  });