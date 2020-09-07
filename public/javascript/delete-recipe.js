$("#delete-recipe-btn").on("click", (event) => {
    const $button = $(event.target);
    const recipe_id = $button.attr("data-recipe-id");
    $.ajax({
        url: `/api/recipes/${recipe_id}`,
        type: 'DELETE',
        contentType:'application/json'
    })
    .catch((err) => alert("Sorry, couldn't delete this recipe!"))
    .always(() => document.location.replace('/'))
})