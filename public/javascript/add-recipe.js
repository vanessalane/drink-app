// create an option in the dropdown for each ingredient in the database
$(document).ready(function(){
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
});

let inputCount = 1;

function addIngredientInput() {

    // copy the ingredient inputs section
    const inputsId = `ingredient-inputs-${inputCount}`;
    let newInputs = $(`#${inputsId}`).clone();
    console.log(newInputs);

    // increment our inputCount
    inputCount++;
    
    // update the id for this set of inputs
    const newInputsId = `ingredient-inputs-${inputCount}`;
    newInputs.attr('id', newInputsId);

    // update the input value and id
    let amountInput = newInputs.find("input.ingredient-amount");
    let amountLabel = newInputs.find("label.ingredient-amount-label");
    
    const amountId = `ingredient-amount-${inputCount}`;
    amountInput.attr('id', amountId).empty();
    amountLabel.attr('for', amountId);

    // update the name value and id
    const nameInput = newInputs.find("input.ingredient-amount");
    const nameLabel = newInputs.find("label.ingredient-amount-label");

    const nameId = `ingredient-name-${inputCount}`;
    nameInput.attr('id', nameId).empty();
    nameLabel.attr('for', nameId);

    // add event listeners to the buttons
    newInputs.find(".add-ingredient").on("click", addIngredientInput);
    newInputs.find(".remove-ingredient").on("click", () => console.log('delete'));

    // append the copy to the ingredients section
    $("#ingredient-section").append(newInputs);
}


$(".remove-ingredient").on('click', () => console.log('delete'));
$(".add-ingredient").on('click', addIngredientInput);