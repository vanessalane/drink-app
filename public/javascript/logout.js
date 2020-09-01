async function logout() {
    const response = await fetch('/api/users/logout', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        console.log('logged out');
        document.location.replace('/login');
    } else {
        alert(response.statusText);
    }
}
    
document.querySelector('#logout').addEventListener('click', logout);