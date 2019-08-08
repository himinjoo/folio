$(document).on("scroll", function() {

	if($(document).scrollTop()>0) {
		$(".logo").addClass("small");
    $(".nav").addClass("nav-bg").removeClass("large");
		$(".nav-link").addClass("small-li");

	} else {
		$(".logo").removeClass("small");
		$(".nav").removeClass("nav-bg").addClass("large");
		$(".nav-link").removeClass("small-li");
	}
});
$(document).ready(function () {
    $('.nav-link').on("click", function () {
        $(this).parent().siblings().find("a").removeClass('active');
        $(this).addClass('active');
    });
});
// $(document).ready(function(){
//   $(".about").click(function(){
//     $(".about").animate({
//       left: '0',
//       opacity: '1',
//       height: '70vh',
//       width: '100%'
//     });
//   });
// });
