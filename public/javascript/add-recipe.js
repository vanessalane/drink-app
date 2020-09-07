let existingIngredients;  // used to determine when we need to add ingredients to the db
let autocompleteData = {};  // options for the ingredient name autocomplete functionality
let inputCount = 1;  // used to generate unique IDs for HTML elements

$(document).ready(() => {
    // get all of the ingredients
    $.get('/api/ingredients')
    .done((ingredients) => {

        // store the ingredient names so that we don't need to run another request for new inputs
        existingIngredients = ingredients.map((ingredient) => ingredient.ingredient_name.toLowerCase());

        // set up the options for autocomplete
        $.each(ingredients, function(index, ingredient) {
            const ingredientName = ingredient.ingredient_name;
            autocompleteData[ingredientName] = null;
        });

        // activate autocomplete functionality
        $('input.autocomplete').autocomplete({
            data: autocompleteData
        });
    });
});

async function addIngredientInput() {
    inputCount++;

    // copy the ingredient inputs section
    let newInputs = $(this).closest('.ingredient-inputs').clone();

    // update the input value and id
    let amountInput = newInputs.find("input.ingredient-amount");
    let amountLabel = newInputs.find("label.ingredient-amount-label");
    
    const amountId = `ingredient-amount-${inputCount}`;
    amountInput.attr('id', amountId).text("");
    amountLabel.attr('for', amountId);

    // update the name value and id
    const nameInput = newInputs.find("input.ingredient-name");
    const nameLabel = newInputs.find("label.ingredient-name-label");

    const nameId = `ingredient-name-${inputCount}`;
    nameInput.attr('id', nameId).text("");
    nameLabel.attr('for', nameId);

    // show the delete button since it's not the first ingredient input
    newInputs.find(".remove-ingredient").removeClass('hidden');

    // add event listeners to the buttons
    newInputs.find(".add-ingredient").on("click", addIngredientInput);
    newInputs.find(".remove-ingredient").on("click", removeIngredientInput);

    // append the copy to the ingredients section
    $("#ingredient-section").append(newInputs);

    // set up autocomplete again
    $('input.autocomplete').autocomplete({
        data: autocompleteData
    });
}

function removeIngredientInput() {
    $(this).closest('.ingredient-inputs').remove();
}

$(".add-ingredient").on('click', addIngredientInput);
$(".remove-ingredient").on('click', removeIngredientInput);