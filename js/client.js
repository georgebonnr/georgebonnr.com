// quick and dirty spaghetti.

$(document).ready(function() {
  $(".main").onepage_scroll({
    sectionContainer: "section",
    easing: "ease",
    animationTime: 600,
    pagination: true,
    updateURL: false
  });

  $allSquares          = $('.squaresquare');
  var $navTitles       = $('.onepage-pagination').children().children().filter('.navtitle');
  var $navClickTargets = $('.onepage-pagination li a, .onepage-pagination li span')
  var $navHoverTarget  = $('.onepage-pagination')
  var $overlay         = $('#overlay');
  var $albumModal      = $('.albumModal');
  var $specialist      = $('#specialist');
  var $play            = $('#play');
  var $triangleUp      = $('.triangle-up');
  var $triangleWhite   = $('.triangle-white');
  var $match           = $('#match');
  var $guitarsModal    = $('.guitarsModal');
  var $arrow           = $('.arrow');
  var $main            = $('.main');
  var toHide           = null

  $navTitles.addClass("hide");

  $('#perspective').css('background-image', 'url("./images/GEORGE_blur9-7.jpg")');

  $navHoverTarget.hover(function(e){
    navShowing = true;
    $navTitles.removeClass("hide")
    $allSquares.removeClass("hide")
  },function(e){
    var active = $allSquares.filter('.active');
    var activeIndex = active[0].dataset.index;
    toHide = activeIndex === "1" ? $allSquares : $allSquares.filter(function(index){
      var elementPageIndex = index + 1;
      return elementPageIndex > activeIndex;
    })
    navShowing = false;
    $navTitles.addClass("hide")
    toHide.addClass("hide")
  });

  $('#intro').on('click',function(){
    $main.moveUp();
  });

  setTimeout(function(){
    $triangleUp.fadeTo(2000,1);
  }, 600)

  $arrow.hover(function(e){
    e.preventDefault();
  });

  $albumModal.css('background-image', 'url("./images/specialist.jpg")');
  $albumModal.show();
  $play.html('&#9654;');
  $play.show().hide();
  $albumModal.hide();
  $('#gtr-gold').attr('src', './images/match_gtrs_gold.jpg');
  $('#gtr-black').attr('src', './images/match_gtrs_black.jpg');

  var makePlayer = function(tracks) {
    var player = {
      playing: false,
      track: null
    };
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var fileType = '';
    fileType += isFirefox ? '.ogg' : '.mp3';
    for (var i = 0; i < tracks.length; i++) {
      var track = $('#' + tracks[i]);
      track.attr('src', 'media/' + tracks[i] + fileType);
      player[i] = track[0];
    }
    return player;
  };

  var tracks = ['setonfire','badluck','gotmegood'];
  var player = null;

  $('.controls').hover(function(){
    $play.show();
  }, function(){
    $play.hide();
  });

  $('.controls').click(function(e){
    e.stopPropagation();
    if (!player.playing) {
      player[0].volume = 0;
      player[0].play();
      setTimeout(function(){
        player[0].volume = 0.5;
      },100);
      player.track = 0;
      $play.html('&#9193;');
      player.playing = true;
    } else if (player.playing) {
      player[player.track].volume = 0;
      player[player.track].pause();
      if (player.track === 2) {
        player.track = 0;
      } else {
        player.track +=1;
      }
      player[player.track].currentTime = 0;
      player[player.track].volume = 0;
      player[player.track].play();
      setTimeout(function(){
        player[player.track].volume = 0.5;
      },100);
    }
  });

  var navBinding = {
    bindWheel: function(){
      $(document).bind('mousewheel DOMMouseScroll', function(event) {
        event.preventDefault();
        var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
        if (delta > 50 || delta < -50) {
          if(!$("body").hasClass("disabled-onepage-scroll")) $.fn.init_scroll(event, delta);
        }
      });
    },
    bindKeys: function(){
      $(document).keydown(function(e) {
        var tag = e.target.tagName.toLowerCase();
        if (!$("body").hasClass("disabled-onepage-scroll")) {
          switch(e.which) {
            case 38:
              if (tag != 'input' && tag != 'textarea') $main.moveUp();
            break;
            case 40:
              if (tag != 'input' && tag != 'textarea') $main.moveDown();
            break;
            default: return;
          }
        }
        e.preventDefault();
      });
    }
  };

  var displayModal = function(overlay,lightbox,button,callback) {
    if (typeof button === 'function') {
      callback = button;
      button = null;
    }
    $(document).unbind('mousewheel DOMMouseScroll');
    $(this).swipeEvents().unbind("swipeDown swipeUp");
    $(document).unbind('keydown');
    overlay.fadeIn(300);
    lightbox.fadeIn(100);
    button && button.fadeIn(300);
  };

  var closeModal = function(overlay, lightbox, callback, binding) {
    binding && navBinding.bindWheel();
    binding && navBinding.bindKeys();
    lightbox.fadeOut(100);
    overlay.fadeOut(100, callback);
  };

  $guitarsModal.switch = function(){
    $(this).children('#gtr-gold').fadeTo(100,0);
    $(this).children('#gtr-black').fadeTo(100,1);
  };

  $specialist.on('click', function(e) {
    e && e.preventDefault();
    $(this).closest('.par').fadeOut(200, function(){
      displayModal($overlay,$albumModal);
      if (!player) {
        player = makePlayer(tracks);
      }
    });
  });

  $overlay.click(function(){
    if (player && player.playing) {
      player[player.track].pause();
      player[0].currentTime = 0;
      player.playing = false;
    }
    closeModal($(this), $albumModal, function(){
      $specialist.closest('.par').fadeIn(100);
    }, true);
    closeModal($(this), $guitarsModal);
  });

  $match.click(function(){
    $(this).closest('.par').fadeOut(200, function(){
      displayModal($overlay, $guitarsModal);
    });
  });

  $guitarsModal.click(function(e){
    e.stopPropagation();
  });
  $guitarsModal.click(function(e){
    e.stopPropagation();
  });
});
