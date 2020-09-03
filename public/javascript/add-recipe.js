let existingIngredients;  // used to determine when we need to add ingredients to the db
let autocompleteData = {};  // options for the ingredient name autocomplete functionality
let inputCount = 1;  // used to generate unique IDs for HTML elements

$(document).ready(() => {
    // get all of the ingredients
    $.get('/api/ingredients')
    .done((ingredients) => {

        // store the ingredient names so that we don't need to run another request
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

async function addIngredientInputs() {
    inputCount++;

    // copy the ingredient inputs section
    let newInputs = $(this).closest('.ingredient-inputs').clone();

    // update the input value and id
    let amountInput = newInputs.find("input.ingredient-amount");
    let amountLabel = newInputs.find("label.ingredient-amount-label");
    
    const amountId = `ingredient-amount-${inputCount}`;
    amountInput.attr('id', amountId);
    amountLabel.attr('for', amountId);

    // update the name value and id
    const nameInput = newInputs.find("input.ingredient-name");
    const nameLabel = newInputs.find("label.ingredient-name-label");

    const nameId = `ingredient-name-${inputCount}`;
    nameInput.attr('id', nameId);
    nameLabel.attr('for', nameId);

    // show the delete button since it's not the first ingredient input
    newInputs.find(".remove-ingredient").removeClass('hidden');

    // add event listeners to the buttons
    newInputs.find(".add-ingredient").on("click", addIngredientInputs);
    newInputs.find(".remove-ingredient").on("click", removeIngredientInputs);

    // append the copy to the ingredients section
    $("#ingredient-section").append(newInputs);

    // set up autocomplete again
    $('input.autocomplete').autocomplete({
        data: autocompleteData
    });
}

function removeIngredientInputs() {
    $(this).closest('.ingredient-inputs').remove();
}

async function addNewRecipe() {
    event.preventDefault();

    // get all of the amounts and all of the ingredients chosen
    const recipe_name = $("#recipe-name").val().trim();
    const instructions = $("#recipe-instructions").val().trim();
    const image_file_name = $("#recipe-image-filename").val().trim();
    const newRecipe = {
        recipe_name,
        instructions,
        image_file_name
    }
    console.log(newRecipe);

    // create the Recipe
    $.post('/api/recipes', newRecipe)
    .done(() => console.log("recipe created"))
    .catch((err) => console.log(err));

    // get the amounts and ingredient names
    let ingredientAmounts = $(".ingredient-inputs .ingredient-amount").map((index, el) => el.value.trim().toLowerCase());
    ingredientAmounts = $.makeArray(ingredientAmounts);

    let ingredientNames = $(".ingredient-inputs .ingredient-name").map((index, el) => el.value.trim().toLowerCase());
    ingredientNames = $.makeArray(ingredientNames);

    // find any ingredients that aren't already in the db
    let newIngredients = ingredientNames
        .filter(name => !existingIngredients.includes(name))
        .map(name => ({ingredient_name: name}));

    // create any missing ingredients
    $.post('/api/ingredients/bulkcreate', {newIngredients})
    .done(() => console.log("ingredients created"))
    .catch((err) => console.log(err));

    // create the RecipeIngredient associations

}

$(".add-recipe-form").on('submit', addNewRecipe);
$(".add-ingredient").on('click', addIngredientInputs);
$(".remove-ingredient").on('click', removeIngredientInputs);