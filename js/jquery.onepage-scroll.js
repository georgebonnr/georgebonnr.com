/* ===========================================================
 * jquery-onepage-scroll.js v1.2
 * ===========================================================
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Create an Apple-like website that let user scroll
 * one page at a time
 *
 * Credit: Eike Send for the awesome swipe event
 * https://github.com/peachananr/onepage-scroll
 * 
 * License: GPL v3
 *
 * ========================================================== */

 // Hacked for another purpose by me (George)

var onepage = function($){

  // I set delta filtering on mousewheel events (+-100). If this 
  // is too strong for some devices, consider removing and increasing
  // quiet Period.

  var nouns = ['one','two','three','four']
  
  var defaults = {
    sectionContainer: "section",
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    updateURL: false,
    keyboard: true,
    beforeMove: null,
    afterMove: null,
    loop: false,
    responsiveFallback: false
	};
	
	$.fn.swipeEvents = function() {
      return this.each(function() {

        var startX,
            startY,
            $this = $(this);

        $this.bind('touchstart', touchstart);

        function touchstart(event) {
          var touches = event.originalEvent.touches;
          if (touches && touches.length) {
            startX = touches[0].pageX;
            startY = touches[0].pageY;
            $this.bind('touchmove', touchmove);
          }
        }

        function touchmove(event) {
          var touches = event.originalEvent.touches;
          if (touches && touches.length) {
            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;

            if (deltaX >= 50) {
              $this.trigger("swipeLeft");
            }
            if (deltaX <= -50) {
              $this.trigger("swipeRight");
            }
            if (deltaY >= 50) {
              $this.trigger("swipeUp");
            }
            if (deltaY <= -50) {
              $this.trigger("swipeDown");
            }
            if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
              $this.unbind('touchmove', touchmove);
            }
          }
        }

      });
    };
	

  $.fn.onepage_scroll = function(options){
    var settings = $.extend({}, defaults, options),
        el = $(this),
        sections = $(settings.sectionContainer)
        total = sections.length,
        status = "off",
        topPos = 0,
        lastAnimation = 0,
        quietPeriod = 100,
        paginationList = "";
    
    $.fn.transformPage = function(settings, pos, index) {
      console.log('this',this)
      $(this).css({
        "-webkit-transform": "translate3d(0, " + pos + "%, 0)", 
        "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-moz-transform": "translateY(0, " + pos + "%, 0)", 
        "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-ms-transform": "translate3d(0, " + pos + "%, 0)", 
        "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "transform": "translate3d(0, " + pos + "%, 0)", 
        "transition": "all " + settings.animationTime + "ms " + settings.easing
      });
      $(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
        if (typeof settings.afterMove == 'function') settings.afterMove(index);
      });
    }
    
    $.fn.moveDown = function() {
      var el = $(this)
      index = $(settings.sectionContainer +".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index + 1) + "']");

      if (index === 4) {
        setTimeout(function(){
          $('.triangle-up').fadeTo(1500,1)
        },3000)
      }

      if(next.length < 1) {
        if (settings.loop == true) {
          pos = 0;
          next = $(settings.sectionContainer + "[data-index='1']");
        } else {
          return
        }
      }else {
        pos = (index * 100) * -1;
      }
      if (typeof settings.beforeMove == 'function') settings.beforeMove( current.data("index"));
      current.removeClass("active");
      next.addClass("active");
      if(settings.pagination == true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active").removeClass("hidden").fadeTo(300,1);
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active").removeClass("hidden").fadeTo(300,1);
      }
      
      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"))
      
      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index + 1);
        history.pushState( {}, document.title, href );
      }   
      el.transformPage(settings, pos, index);
    }
    
    $.fn.moveUp = function() {
      var el = $(this)
      index = $(settings.sectionContainer +".active").data("index");
      if (index === 1) { return; }
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index - 1) + "']");
      
      $('a').filter('.active').addClass('hidden').fadeTo(400,0);

      if (index === 5) {
        setTimeout(function(){
          $('.triangle-up').fadeTo(1500,0)
        },1000)
      }
      
      if(next.length < 1) {
        if (settings.loop == true) {
          pos = ((total - 1) * 100) * -1;
          next = $(settings.sectionContainer + "[data-index='"+total+"']");
        }
        else {
          return
        }
      }else {
        pos = ((next.data("index") - 1) * 100) * -1;
      }
      if (typeof settings.beforeMove == 'function') settings.beforeMove(current.data("index"));
      current.removeClass("active");
      next.addClass("active");
      if(settings.pagination == true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
        if (next.data("index") === 1) {
          $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("hidden").delay(500).fadeTo(400,0);
        }
      }
      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-"+next.data("index"))
      
      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index - 1);
        history.pushState( {}, document.title, href );
      }
      el.transformPage(settings, pos, index);
    }
    
    $.fn.moveTo = function(page_index) {
      current = $(settings.sectionContainer + ".active");
      next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");
      if(next.length > 0) {
        if (typeof settings.beforeMove == 'function') settings.beforeMove(current.data("index"));
        current.removeClass("active");
        next.addClass("active");
        $(".onepage-pagination li a" + ".active").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");

        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-"+next.data("index"));
        
        pos = ((page_index - 1) * 100) * -1;
        el.transformPage(settings, pos, page_index);
        if (settings.updateURL == false) return false;
      }
    };

    
    function responsive() {
      if ($(window).width() < settings.responsiveFallback) {
        $("body").addClass("disabled-onepage-scroll");
        $(document).unbind('mousewheel DOMMouseScroll');
        el.swipeEvents().unbind("swipeDown swipeUp");
      } else {
        if($("body").hasClass("disabled-onepage-scroll")) {
          $("body").removeClass("disabled-onepage-scroll");
          $("html, body, .wrapper").animate({ scrollTop: 0 }, "fast");
        }
        
        
        el.swipeEvents().bind("swipeDown",  function(event){ 
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          el.moveUp();
        }).bind("swipeUp", function(event){ 
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          el.moveDown();
        });
        
        $(document).bind('mousewheel DOMMouseScroll', function(event) {
          event.preventDefault();
          var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
          if (delta > 50 || delta < -50) {
            $.fn.init_scroll(event, delta);
          }
        });
      }
    }
    
    
    $.fn.init_scroll = function (event, delta) {
        deltaOfInterest = delta;
        var timeNow = event.originalEvent.timeStamp;
        // console.log(delta,timeNow)
        // Cancel scroll if currently animating or within quiet period
        if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
            event.preventDefault();
            return;
        }

        if (deltaOfInterest < 0) {
          el.moveDown()
        } else {
          el.moveUp()
        }
        lastAnimation = timeNow;
    }
    
    // Prepare everything before binding wheel scroll
    
    el.addClass("onepage-wrapper").css("position","relative");
    $.each( sections, function(i) {
      $(this).css({
        position: "absolute",
        top: topPos + "%"
      }).addClass("section").attr("data-index", i+1);
      topPos = topPos + 100;
      if(settings.pagination == true) {
        if (i !== 4) {
          var title = this.id
          title = title.charAt(0).toUpperCase() + title.slice(1);
          paginationList += "<li class='neve square'><a class='squaresquare' data-index='"+(i+1)+"' href='#" + (i+1) + "'></a><span class='neve navtitle' data-index='"+(i+1)+"'>"+title+"</span></li>"
        }         
      }
    });
    
    el.swipeEvents().bind("swipeDown",  function(event){ 
      if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
      el.moveUp();
    }).bind("swipeUp", function(event){ 
      if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
      el.moveDown(); 
    });
    
    // Create Pagination and Display Them
    if(settings.pagination == true) {
      $("<ul class='onepage-pagination'>" + paginationList + "</ul>").prependTo("body");
      posTop = (el.find(".onepage-pagination").height() / 2) * -1;
      el.find(".onepage-pagination").css("margin-top", posTop);
    }
    
    if(window.location.hash != "" && window.location.hash != "#1") {
      init_index =  window.location.hash.replace("#", "")
      $(settings.sectionContainer + "[data-index='" + init_index + "']").addClass("active")
      $("body").addClass("viewing-page-"+ init_index)
      if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");
      
      next = $(settings.sectionContainer + "[data-index='" + (init_index) + "']");
      if(next) {
        next.addClass("active")
        if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + (init_index) + "']").addClass("active");
        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-"+next.data("index"))
        if (history.replaceState && settings.updateURL == true) {
          var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (init_index);
          history.pushState( {}, document.title, href );
        }
      }
      pos = ((init_index - 1) * 100) * -1;
      el.transformPage(settings, pos, init_index);
      
    }else{
      $(settings.sectionContainer + "[data-index='1']").addClass("active")
      $("body").addClass("viewing-page-1")
      if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
    }
    if(settings.pagination == true)  {
      var moveIt = function(triIndex) {
        var page_index = triIndex || $(this).data("index");
        if (!$(this).hasClass("active")) {
          current = $(settings.sectionContainer + ".active")
          next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");

          if(next) {
            current.removeClass("active")
            next.addClass("active")
            $(".onepage-pagination li a" + ".active").removeClass("active");
            $(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");
            $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
            $("body").addClass("viewing-page-"+next.data("index"))
          }

          for (var i = page_index+1; i < 6; i++) {
            $(".onepage-pagination li a" + "[data-index='" + i + "']").addClass("hidden");
            $(".onepage-pagination li .navtitle" + "[data-index='" + i + "']").addClass("hidden");
          }

          for (var i = page_index; i >= 1; i--) {
            $(".onepage-pagination li a" + "[data-index='" + i + "']").removeClass("hidden").fadeTo(300,1);
          }

          if (page_index === 1) {
            $(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("hidden");
          }

          pos = ((page_index - 1) * 100) * -1;
          console.log(pos, page_index)
          el.transformPage(settings, pos, page_index);
        }
        if (settings.updateURL == false) return false;
      }

      moveIt(5);

      $(".onepage-pagination li a, .onepage-pagination li span").click(function (){
        moveIt.call(this);
      });
    }

    $('.triangle').on('click', function(e){
      moveIt(5);
    })

    $(document).bind('mousewheel DOMMouseScroll', function(event) {
      event.preventDefault();
      var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
      if (typeof event.originalEvent.wheelDelta === 'undefined') {
        delta < 0 ? delta -= 46 : delta += 46;
      }
      if (delta > 50 || delta < -50) {
            if(!$("body").hasClass("disabled-onepage-scroll")) $.fn.init_scroll(event, delta);
          }
    });
    
    
    if(settings.responsiveFallback != false) {
      $(window).resize(function() {
        responsive();
      });
      
      responsive();
    }
    
    if(settings.keyboard == true) {
      $(document).keydown(function(e) {
        var tag = e.target.tagName.toLowerCase();
        
        if (!$("body").hasClass("disabled-onepage-scroll")) {
          switch(e.which) {
            case 38:
              if (tag != 'input' && tag != 'textarea') el.moveUp()
            break;
            case 40:
              if (tag != 'input' && tag != 'textarea') el.moveDown()
            break;
            default: return;
          }
        }
        
        e.preventDefault(); 
      });
    }
    return false;
  }

  var exports = {
    bindKeys: function(){
        $(document).keydown(function(e) {
          var tag = e.target.tagName.toLowerCase();
          
          if (!$("body").hasClass("disabled-onepage-scroll")) {
            switch(e.which) {
              case 38:
                if (tag != 'input' && tag != 'textarea') el.moveUp()
              break;
              case 40:
                if (tag != 'input' && tag != 'textarea') el.moveDown()
              break;
              default: return;
            }
          }
          
          e.preventDefault(); 
        });
      },
    bindWheel: function(){
      $(document).bind('mousewheel DOMMouseScroll', function(event) {
        event.preventDefault();
        var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
        if (delta > 50 || delta < -50) {
              if(!$("body").hasClass("disabled-onepage-scroll")) $.fn.init_scroll(event, delta);
            }
      });
    }
  }

  return exports;
  
}(window.jQuery);

