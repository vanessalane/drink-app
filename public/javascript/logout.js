function logout() {
    $.post('/api/users/logout')
    .done((data) => document.location.replace('/login'))
    .fail((data) => {
        const latestError = data.responseJSON.message;
        alert(latestError);
    });
}
    
$('.logout').on('click', logout);