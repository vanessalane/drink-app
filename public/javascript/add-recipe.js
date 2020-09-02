$(document).ready(function(){

    // create an option in the dropdown for each ingredient in the database
    $.get('/api/ingredients')
    .done((ingredients) => {
        $.each(ingredients, function(index, ingredient) {
            const newOption = $("<option>")
                .attr({'value': ingredient.ingredient_id})  // set the value to ingredient_id
                .text(ingredient.ingredient_name);  // set the text content to ingredient_name

            // set up the select element
            $('select')
                .append(newOption)
                .formSelect();
        });
    });
});