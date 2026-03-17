(function($) {
"use strict";
    function subpages_resize() {
        var subpagesHeight = $('.pt-page-current').height();
        $(".subpages").height(subpagesHeight + 50);
    }

    function mobileMenuHide() {
        var windowWidth = $(window).width();
        if (windowWidth < 1024) {
            $('#site_header').addClass('mobile-menu-hide');
        }
    }

    $(window)
        .on('load', function() {
            $(".preloader").fadeOut("slow");

            var ptPage = $('.subpages');
            if (ptPage[0]) {
                PageTransitions.init({
                    menu: 'ul.site-main-menu',
                });
            }
        })
        .on('resize', function() {
             mobileMenuHide();

             setTimeout(function(){
                subpages_resize();
            }, 500);
        })
        .scroll(function () {
            if ($(window).scrollTop() < 20) {
                $('.header').removeClass('sticked');
            } else {
                $('.header').addClass('sticked');
            }
        })
        .scrollTop(0);

    $(document).on('ready', function() {
        $('.menu-toggle').on("click", function () {
            $('#site_header').toggleClass('mobile-menu-hide');
        });

        $('.site-main-menu').on("click", "a", function (e) {
            mobileMenuHide();
        });

        $('.text-rotation').owlCarousel({
            loop: true,
            dots: false,
            nav: false,
            margin: 0,
            items: 1,
            autoplay: true,
            autoplayHoverPause: false,
            autoplayTimeout: 3800,
            animateOut: 'zoomOut',
            animateIn: 'zoomIn'
        });
    });

})(jQuery);
