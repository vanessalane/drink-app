$(document).ready(function(){
    // for the collapsible menu on mobile
    $('.sidenav').sidenav();

    // for the settings button
    const elems = $('.fixed-action-btn').floatingActionButton();
    let hoverEnabled = true;
    if ( $(window).width() < 769) {
        hoverEnabled = false;
    }
    M.FloatingActionButton.init(elems, {hoverEnabled});

    // only show the save button if you're editing
    $('.btn-save').hide();
});

// clicking the delete button in the settings on the recipe page or surfaces the confirm delete modal
$(".btn-delete").click(() => $('.modal').modal());

// confirming deletion in the delete modal will execute the delete operation
$(".btn-confirm-delete").click(() => {
    console.log('deleted');
})

// clicking "edit" changes fields into inputs
$(".btn-edit").click(() => {
    console.log('edit');
    $(".btn-edit").hide();
    $(".btn-save").show();
});

// save event listener
$(".btn-save").click(() => {
    console.log('save');
    $(".btn-delete-recipe-card").remove();
    $(".btn-edit").show();
    $(".btn-save").hide();
});
