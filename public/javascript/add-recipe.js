$(document).ready(autoComplete());

// function to initialize autocomplete for ingredients
function autoComplete() {
    $.get('/api/ingredients')
    .done((ingredients) => {
        const ingredientNames = {};
        $.each(ingredients, function(index, ingredient) {
            const name = ingredient.ingredient_name;
            ingredientNames[name] = null;
        });
        $('input.autocomplete').autocomplete({
            data: ingredientNames
        });
    });
}

let inputCount = 1;  // used to generate unique IDs for HTML elements

function addIngredientInputs() {
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
    const nameInput = newInputs.find("input.ingredient-amount");
    const nameLabel = newInputs.find("label.ingredient-amount-label");

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
    autoComplete();
}

function removeIngredientInputs() {
    $(this).closest('.ingredient-inputs').remove();
}

$(".add-ingredient").on('click', addIngredientInputs);
$(".remove-ingredient").on('click', removeIngredientInputs);