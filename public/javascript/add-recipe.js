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

function addNewRecipe() {
    event.preventDefault();

    // get all of the amounts and all of the ingredients chosen
    const name = $("#recipe-name").val().trim();
    const instructions = $("#recipe-instructions").val().trim();
    const imageFileName = $("#recipe-image-filename").val().trim();

    // get the amounts, ingredients, and new ingredients to create
    const ingredientAmounts = $(".ingredient-inputs .ingredient-amount").map((index, el) => el.value.trim().toLowerCase());
    const ingredientNames = $(".ingredient-inputs .ingredient-name").map((index, el) => el.value.trim().toLowerCase());
    const newIngredientNames = ingredientNames.filter((index, ingredientName) => !existingIngredients.includes(ingredientName));

    // create an Inrgredient for each newIngredient
    // Ingredient.bulkCreate(newIngredients);

    // create the Recipe

    // create the RecipeIngredient
}

$(".add-recipe-form").on('submit', addNewRecipe);
$(".add-ingredient").on('click', addIngredientInputs);
$(".remove-ingredient").on('click', removeIngredientInputs);