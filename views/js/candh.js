// INVITE CODE SUBMIT BUTTON
$('#btnInviteSubmit').click(function (event) {
    event.preventDefault();

    var enteredCode = $("#txtInviteCode").val();

    $.ajax({
        url: '/validateinvite/'+enteredCode,
        data: {
            format: 'json'
        },
        error: function () {
            $('#inviteMessage').html("<img src='img/exclaimation.png' alt='' />&nbsp;Sorry, an error has occurred processing your request. Please drop us a message on Facebook or by phone. Thanks!&nbsp;<img src='img/exclaimation.png' alt='' />");
        },
        dataType: 'jsonp',
        success: function (data) {
            if (data.response.valid === "1")
            {
                alert("redirect");
            } else {
                $('#inviteMessage').html("<img src='img/exclaimation.png' alt='' />&nbsp;Sorry, your code doesn't appear to be valid. Please check and try again. Still having problems? Please drop us a message on Facebook or by phone. Thanks!&nbsp;<img src='img/exclaimation.png' alt='' />");
            }
        },
        type: 'GET'
    });
});