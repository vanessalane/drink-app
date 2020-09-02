// load the rating functionality
// docs: https://rateyo.fundoocode.ninja/
$(window).ready(() => {
    $("#rateYo").rateYo({
            rating: 2.5,
            onSet: function (rating, rateYoInstance) {
                alert("Rating is set to: " + rating);
              }
        });
    }
);