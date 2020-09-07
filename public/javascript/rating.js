// JS for the rating functionality
// docs: https://rateyo.fundoocode.ninja/
$(document).ready(() => {
    const url =  $(location). attr('href'); var
    recipeId = url.substring(url.lastIndexOf('/') + 1);

    // get the logged in user and rating for this recipe
    $.get(`/api/reciperatings/${recipeId}`)
    .done(dbRatingData => {
        const currentRating = dbRatingData.rating;
        const userId = dbRatingData.user_id;

        // if the user_id is defined, someone has logged in and the rating should be editable
        if (userId) {        
            $("#rateYo").rateYo({
                rating: currentRating,
                precision: 2,
                starWidth: "25px",
                onSet: (rating, rateYoInstance) => {
                    const newRating = {
                        recipe_id: recipeId,
                        user_id: userId,
                        rating
                    }
                    $.post('/api/reciperatings', newRating)
                    .catch(err => console.log(err.message))
                }
            });
        } // otherwise, show the rating but don't let them edit
        else {
            $("#rateYo").rateYo({
                rating: currentRating,
                starWidth: "25px",
                readOnly: true
            });
        }
    })
    .catch(err => {
        // if the rating couldn't be loaded, add a default rating of 0 and don't let anyone edit it
        $("#rateYo").rateYo({
            rating: 0,
            starWidth: "25px",
            readOnly: true
        });
    })
});