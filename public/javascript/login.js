async function logIn(email, password) {
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });
  
    // if the user could log in, send them to their dashboard
    if (response.ok) {
      console.log('success');
      document.location.replace('/');
    }
    else {
      // otherwise, get the data from the response and surface the error to the user
      response.json().then(data => {
        const latestError = data.message;
        $("#auth-error").text(latestError).show().delay(3000).fadeOut(500);
      })
    }
  }
  
  async function loginFormHandler(event) {
    event.preventDefault();

    const email = $('#auth-email').val().trim();
    const password = $('#auth-password').val().trim();

    if (!email) {
      $("#auth-error").text('Email is required!').show().delay(3000).fadeOut(500);;
    } else if (!password) {
      $("#auth-error").text('Password is required!').show().delay(3000).fadeOut(500);;
    } else {
      logIn(email, password);
    }
  }
  
  async function signupFormHandler(event) {
    event.preventDefault();
  
    // clear any prior messages
    $("#auth-error").text('');
  
    const username = $('#auth-username').val().trim();
    const email = $('#auth-email').val().trim();
    const password = $('#auth-password').val().trim();
  
    if (!username) {
      $("#auth-error").text('Username is required!').show().delay(3000).fadeOut(500);
    } else if (!email) {
      $("#auth-error").text('Email is required!').show().delay(3000).fadeOut(500);
    } else if (!password) {
      $("#auth-error").text('Password is required!').show().delay(3000).fadeOut(500);
    } else {
      const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
          username,
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      // if the credentials seem ok, try logging in
      if (response.ok) {
        logIn(email, password);
      }
      else {
        // otherwise, get the data from the response and surface the error to the user
        response.json().then(data => {
          const latestError = data.errors[0];
  
          // handle uniqueness constraints that can't be customized in sequelize
          switch (latestError.message) {
            case "user.email must be unique":
              latestError.message = "An account with that email already exists."
              break;
            case "user.username must be unique":
              latestError.message = "Username taken."
              break;
          }
  
          // add the error to the template
          $("#auth-error").text(latestError.message);
        })
      }
    }
  }
  
  function displaySignupForm() {
    event.preventDefault();
  
    // hide the login form
    $('.btn-login').addClass('hidden');
    $('.btn-create-account').addClass('hidden');
  
    // show the signup form
    $('.btn-login-instead').removeClass('hidden');
    $('.btn-signup').removeClass('hidden');
    $('.auth-username-container').removeClass('hidden');
    $('.auth-card-title').textContent = "Create an Account";
  }
  
  function displayLoginForm() {
    event.preventDefault();
  
    // hide the signup form
    $('.btn-login-instead').addClass('hidden');
    $('.btn-signup').addClass('hidden');
    $('.auth-username-container').addClass('hidden');
  
    // show the login form
    $('.btn-login').removeClass('hidden');
    $('.btn-create-account').removeClass('hidden');
    $('.auth-card-title').textContent = "Log In";
  
  }
  
  $('.btn-login-instead').on('click', displayLoginForm);
  $('.btn-create-account').on('click', displaySignupForm);
  $('.btn-login').on('click', loginFormHandler);
  $('.btn-signup').on('click', signupFormHandler);
  