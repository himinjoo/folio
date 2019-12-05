function passWord() {
var testV = 1;
var pass1 = prompt('Please Enter Your Password',' ');
while (testV < 3) {
if (!pass1)
history.go(-1);
if (pass1.toLowerCase() == "himinjoo") {
alert("Welcome! I'm glad you're here");
window.open('index.html');
break;
}
testV+=1;
var pass1 =
prompt('Access Denied - Password Incorrect, Please Try Again.','Password');
}
if (pass1.toLowerCase()!="password" & testV ==3)
history.go(-1);
return " ";
}

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
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("nav-wrapper").style.height = "48px";
    document.getElementById("spantitle").style.marginTop = "-21px";
    document.getElementById("logo").style.position = "absolute";

  } else {
    document.getElementById("nav-wrapper").style.height = "179px";
    document.getElementById("spantitle").style.marginTop = "0px";
    document.getElementById("logo").style.fontSize = "absolute";
  }
}

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
