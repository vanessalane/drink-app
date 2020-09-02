async function loginFormHandler(event) {
  event.preventDefault();

  const email = $('#auth-email').val().trim();
  const password = $('#auth-password').val().trim();

  if (!email) {
    $("#auth-error").text('Email is required!').show().delay(3000).fadeOut(500);;
  } else if (!password) {
    $("#auth-error").text('Password is required!').show().delay(3000).fadeOut(500);;
  } else {
    $.post(
      '/api/users/login',
      {email, password}
    )
    .done(() => document.location.replace('/'))
    .fail((data) => {
      const latestError = data.responseJSON.message;
      console.log(data);
      $("#auth-error").text(latestError).show().delay(3000).fadeOut(500);
    })
  }
}
  
async function signupFormHandler(event) {
  event.preventDefault();

  const username = $('#auth-username').val().trim();
  const email = $('#auth-email').val().trim();
  const password = $('#auth-password').val().trim();

  // check to see that we have all of the responses necessary
  if (!username) {
    $("#auth-error").text('Username is required!').show().delay(3000).fadeOut(500);
  } else if (!email) {
    $("#auth-error").text('Email is required!').show().delay(3000).fadeOut(500);
  } else if (!password) {
    $("#auth-error").text('Password is required!').show().delay(3000).fadeOut(500);
  } else {

    // save the user
    $.post(
      '/api/users',
      {username, email, password}
    )
    .done((data) => {
      // log in if the request was successful
      $.post(
        '/api/users/login',
        {email, password}
      )
      .done(() => document.location.replace('/'))
      .fail((data) => {
        const latestError = data.responseJSON.message;
        console.log(data);
        $("#auth-error").text(latestError).show().delay(3000).fadeOut(500);
      })
    })
    .fail((data) => {
      // surface an error message if the request wasn't successful
      const latestError = data.responseJSON.errors[0].message;

      // handle uniqueness constraints that can't be customized in sequelize
      switch (latestError) {
        case "user.email must be unique":
          latestError = "An account with that email already exists."
          break;
        case "user.username must be unique":
          latestError = "Username taken."
          break;
      }

      $("#auth-error").text(latestError).show().delay(3000).fadeOut(500);
    })
  }
}
  
function displaySignupForm() {
    event.preventDefault();

    // hide the error message
    $("#auth-error").hide();
  
    // hide the login form
    $('.btn-login').hide();
    $('.btn-create-account').hide();
  
    // show the signup form
    $('.btn-login-instead').show();
    $('.btn-signup').show();
    $('.auth-username-container').show();
    $('.auth-card-title').text("Create an Account");
}
  
function displayLoginForm() {
    event.preventDefault();

    // hide the error message
    $("#auth-error").hide();
  
    // hide the signup form
    $('.btn-login-instead').hide();
    $('.btn-signup').hide();
    $('.auth-username-container').hide();
  
    // show the login form
    $('.btn-login').show();
    $('.btn-create-account').show();
    $('.auth-card-title').text("Log In");
}
  
$('.btn-login-instead').on('click', displayLoginForm);
$('.btn-create-account').on('click', displaySignupForm);
$('.btn-login').on('click', loginFormHandler);
$('.btn-signup').on('click', signupFormHandler);
  