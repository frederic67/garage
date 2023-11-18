document.addEventListener('DOMContentLoaded', function() {

    // 1. Change navbar color on scroll
    const navbar = document.querySelector('.navbar');
    window.onscroll = function() {
        if (window.scrollY > 50) { // Adjust this value for when you want the background to appear (how far scrolled down)
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // 2. Animate sections when they're visible
    const sections = document.querySelectorAll('.services, .occasions, .testimonials, .brands, .slider');
    function animateSections() {
        sections.forEach(section => {
            if (isInViewport(section)) {
                section.classList.add('animate');
            }
        });
    }

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    window.addEventListener('scroll', animateSections);

    // 3. Initialize Bootstrap carousel (if you've included it in the HTML)
    // $('.carousel').carousel();

});
document.addEventListener('DOMContentLoaded', function() {
    const services = document.querySelectorAll('.service-item');

    function showServices() {
        services.forEach(service => {
            if (isInViewport(service)) {
                service.style.opacity = "1";
                service.style.transform = "translateX(0)";
            }
        });
    }

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    window.addEventListener('scroll', showServices);
});
$(document).ready(function() {
    $('.image-popup').magnificPopup({
      type: 'image',
      closeOnContentClick: true,
      mainClass: 'mfp-img-mobile',
      image: {
        verticalFit: true
      }
    });
  });
  