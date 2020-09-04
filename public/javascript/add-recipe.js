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

async function addNewRecipe() {
    event.preventDefault();

    // get all of the amounts and all of the ingredients chosen
    const recipe_name = $("#recipe-name").val().trim();
    const instructions = $("#recipe-instructions").val().trim();
    const image_file_name = $("#image-file-name").val();

    const newRecipe = {
        recipe_name,
        instructions,
        image_file_name
    }

    // create the Recipe
    $.post('/api/recipes', newRecipe)
    .done(newRecipe => {
        console.log(`Successfully created a recipe: ${newRecipe}`);

        // get the amounts and ingredient names
        $(".ingredient-inputs").each(() => {

            // figure out the amount and name for the ingredient
            const amount = $(this).find(".ingredient-amount").val().trim().toLowerCase();
            const ingredient_name = $(this).find(".ingredient-name").val().trim().toLowerCase();
            
            // find or create the ingredient in the db
            $.post('/api/ingredients/findorcreate', {ingredient_name})
            .done(newIngredients => {
                console.log(`Successfully found or created these ingredients: ${JSON.stringify(newIngredients)}`);

                // get data for the new RecipeIngredient record
                const recipe_id = newRecipe.recipe_id
                const ingredient_id = newIngredients[0].ingredient_id;
                const newRecipeIngredient = {ingredient_id, amount, recipe_id};

                // add the new RecipeIngredient to the RecipeIngredients table
                $.post('/api/recipeingredients', newRecipeIngredient)
                .done(newRecipeIngredient => {
                    console.log(`Successfully associated recipe and ingredients: ${newRecipeIngredient}`)

                    // redirect to the new recipe page
                    document.location.replace(`/recipe/${recipe_id}`);
                })
                .catch(err => console.log(`Couldn't create a RecipeIngredient: ${JSON.stringify(err)}`));
            })
            .catch(err => console.log(`Couldn't find or create an Ingredient: ${JSON.stringify(err)}`));
        })
    })
    .catch(err => console.log(`Couldn't create a Recipe: ${JSON.stringify(err)}`));
}

$(".add-recipe-form").on('submit', addNewRecipe);
$(".add-ingredient").on('click', addIngredientInput);
$(".remove-ingredient").on('click', removeIngredientInput);