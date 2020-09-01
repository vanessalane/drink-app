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
      document.location.replace('/my-recipes');
    }
    else {
      // otherwise, get the data from the response and surface the error to the user
      response.json().then(data => {
        const latestError = data.message;
        document.querySelector("#auth-error").textContent = latestError;
      })
    }
  }
  
  async function loginFormHandler(event) {
    event.preventDefault();
  
    // clear any prior messages
    document.querySelector("#auth-error").textContent = '';
  
    const email = document.querySelector('#auth-email').value.trim();
    const password = document.querySelector('#auth-password').value.trim();

    if (!email) {
      document.querySelector("#auth-error").textContent = 'Email is required!'
    } else if (!password) {
      document.querySelector("#auth-error").textContent = 'Password is required!'
    } else {
      logIn(email, password);
    }
  }
  
  async function signupFormHandler(event) {
    event.preventDefault();
  
    // clear any prior messages
    document.querySelector("#auth-error").textContent = '';
  
    const username = document.querySelector('#auth-username').value.trim();
    const email = document.querySelector('#auth-email').value.trim();
    const password = document.querySelector('#auth-password').value.trim();
  
    if (!username) {
      document.querySelector("#auth-error").textContent = 'Username is required!'
    } else if (!email) {
      document.querySelector("#auth-error").textContent = 'Email is required!'
    } else if (!password) {
      document.querySelector("#auth-error").textContent = 'Password is required!'
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
              latestError.message = "An account with that email already exists! Please try logging in."
              break;
            case "user.user_username must be unique":
              latestError.message = "Username taken!"
              break;
          }
  
          // add the error to the template
          document.querySelector("#auth-error").textContent = latestError.message;
        })
      }
    }
  }
  
  function displaySignupForm() {
    event.preventDefault();
  
    // clear any prior messages
    document.querySelector("#auth-error").textContent = '';
  
    // hide the login form
    document.querySelector('.btn-login').classList.add('hidden');
    document.querySelector('.btn-create-account').classList.add('hidden');
  
    // show the signup form
    document.querySelector('.btn-login-instead').classList.remove('hidden');
    document.querySelector('.btn-signup').classList.remove('hidden');
    document.querySelector('.auth-username-container').classList.remove('hidden');
    document.querySelector('.auth-card-title').textContent = "Create an Account";
  }
  
  function displayLoginForm() {
    event.preventDefault();
  
    // clear any prior messages
    document.querySelector("#auth-error").textContent = '';
  
    // hide the signup form
    document.querySelector('.btn-login-instead').classList.add('hidden');
    document.querySelector('.btn-signup').classList.add('hidden');
    document.querySelector('.auth-username-container').classList.add('hidden');
  
    // show the login form
    document.querySelector('.btn-login').classList.remove('hidden');
    document.querySelector('.btn-create-account').classList.remove('hidden');
    document.querySelector('.auth-card-title').textContent = "Log In";
  
  }
  
  document.querySelector('.btn-login-instead').addEventListener('click', displayLoginForm);
  document.querySelector('.btn-create-account').addEventListener('click', displaySignupForm);
  document.querySelector('.btn-login').addEventListener('click', loginFormHandler);
  document.querySelector('.btn-signup').addEventListener('click', signupFormHandler);
  