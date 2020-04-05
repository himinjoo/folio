

function openNav() {
  document.getElementById("smallMenu").style.display = "block";
}

function closeNav() {
  document.getElementById("smallMenu").style.display = "none";
}

$(document).ready(function () {
    $('.nav-link').on("click", function () {
        $(this).parent().siblings().find("a").removeClass('active');
        $(this).addClass('active');
				$(".header-arrow").removeClass("remove");
    });
});


$(document).ready(function() {
$('html, body, *').mousewheel(function(e, delta) {
this.scrollLeft -= (delta * 50);
e.preventDefault();
});
});

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("nav-wrapper").style.height = "40px";
    document.getElementById("secondNavbar").style.top = "0";
    document.getElementById("spantitle").style.marginTop = "-21px";
    document.getElementById("logo").style.position = "absolute";
  } else {
    document.getElementById("nav-wrapper").style.height = "179px";
    document.getElementById("secondNavbar").style.top = "-60px";
    document.getElementById("spantitle").style.marginTop = "0px";
    document.getElementById("logo").style.fontSize = "absolute";
  }
};

$(window).scroll(function() {
  var scroll = $(window).scrollTop();
  if (scroll > 0) {
      $("#nav-wrapper").addClass("active");
  }
  else {
      $("#nav-wrapper").removeClass("active");
  }
});

/*Scroll to top when arrow up clicked BEGIN*/
$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});
$(document).ready(function() {
    $("#back2Top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 });
        return false;
    });

});
 /*Scroll to top when arrow up clicked END*/


 $(document).on('ready', function() {
   var winHeight = $(window).height(),
       docHeight = $(document).height(),
       progressBar = $('progress'),
       max, value;

   /* Set the max scrollable area */
   max = docHeight - winHeight;
   progressBar.attr('max', max);

   $(document).on('scroll', function(){
      value = $(window).scrollTop();
      progressBar.attr('value', value);
   });
 });
