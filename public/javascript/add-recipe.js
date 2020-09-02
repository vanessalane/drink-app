// create an option in the dropdown for each ingredient in the database
$(document).ready(function(){
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

$(".remove-ingredient").on('click', () => console.log('delete'));
$(".add-ingredient").on('click', () => console.log('add'));