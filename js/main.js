document.getElementsByTagName("body").style.opacity = "0";
(function ($) {
  "use strict";

  // Spinner+
  let spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".sticky-top").css("top", "0px");
    } else {
      $(".sticky-top").css("top", "-100px");
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Header carousel
  $(".header-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    items: 1,
    dots: true,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    margin: 24,
    dots: true,
    loop: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
})(jQuery);

// Toggle the login and signup modals for Job Seekers
let loginModal;
let signupModal;
const loginModalElement = document.getElementById("loginModal");
if (loginModalElement) {
  loginModal = new bootstrap.Modal(loginModalElement);
}
const signupModalElement = document.getElementById("signupModal");
if (signupModalElement) {
  signupModal = new bootstrap.Modal(signupModalElement);
}

document.getElementById("switchToSignup")?.addEventListener("click", (e) => {
  e.preventDefault();
  loginModal.hide();
  // setTimeout(() => signupModal.show(), 300);
  signupModal.show();
});

document.getElementById("switchToLogin")?.addEventListener("click", (e) => {
  e.preventDefault();
  signupModal.hide();
  // setTimeout(() => loginModal.show(), 300);
  loginModal.show();
});

// Toggle the login and signup modals for Employers
let recruiterSignupModal;
let recruiterLoginModal;
const recruiterSignupModalElement = document.getElementById(
  "recruiterSignupModal"
);
if (recruiterSignupModalElement) {
  recruiterSignupModal = new bootstrap.Modal(recruiterSignupModalElement);
}

recruiterLoginModal = document.getElementById("recruiterLoginModal");
if (recruiterLoginModal) {
  recruiterLoginModal = new bootstrap.Modal(recruiterLoginModal);
}

document
  .getElementById("switchToRecruiterLogin")
  ?.addEventListener("click", function (e) {
    e.preventDefault();
    recruiterSignupModal.hide();
    // setTimeout(() => recruiterLoginModal.show(), 300);
    recruiterLoginModal.show();
  });

document
  .getElementById("switchToRecruiterSignup")
  ?.addEventListener("click", function (e) {
    e.preventDefault();
    recruiterLoginModal.hide();
    // setTimeout(() => recruiterSignupModal.show(), 300);
    recruiterSignupModal.show();
  });
