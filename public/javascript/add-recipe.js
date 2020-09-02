$(document).ready(function(){
    $('select').formSelect();

    $('.tooltipped').tooltip();
});

// async function newFormHandler(event) {
//     event.preventDefault();
  
//     const title = $('#recipe-name').val().trim();
//     const instructions = $('#recipe-instructions').val().trim();
//     const ingredients = $('.ingredient');
  
//     const response = await fetch(`/api/posts`, {
//       method: 'POST',
//       body: JSON.stringify({
//         title,
//         instructions,
//         image_file_name,
        
//       }),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
  
//     if (response.ok) {
//       document.location.replace('/dashboard');
//     } else {
//       alert(response.statusText);
//     }
// }

// $('.add-recipe-form').onSubmit(newFormHandler);
