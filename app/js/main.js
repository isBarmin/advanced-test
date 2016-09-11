$(document).ready(function() {

  (function() {
    var coursesCnt = $('.course-item').length;


    $(document).on('click', '.course-item__check', function(e) {
      var check = $(this);
      var card  = check.closest('.course-item');
      var item  = card.closest('.courses__item');
      var container;


      if( card.hasClass('course-item--complete') ) {
        e.preventDefault();
        return;
      }

      card.addClass('course-item--complete');
      check.find('input').prop('checked', true)

      setTimeout(function() {
        card.fadeOut(function() {
          --coursesCnt;

          item.hide(250);

          if( coursesCnt === 0 ) {
            container = card.closest('.courses');
            container.addClass('courses--complete');
          }
        });
      }, 1000);

    }); // click
  })();

}); // ready





$(window).load(function() {

});/* load */