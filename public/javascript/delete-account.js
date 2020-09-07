$("#delete-account-btn").on("click", (event) => {
    const username = $(event.target).attr("data-username");
    $.ajax({
        url: `/api/users/${username}`,
        type: 'DELETE',
        contentType:'application/json'
    })
    .always(() => document.location.replace('/'))
})