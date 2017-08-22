// INVITE CODE SUBMIT BUTTON
$('#btnInviteSubmit').click(function (event) {
    event.preventDefault();

    var enteredCode = $("#txtInviteCode").val();
    enteredCode = enteredCode.toUpperCase();

    $.ajax({
        url: '/validateinvite/' + enteredCode,
        error: cbInviteValidateError,
        success: function (data) {
            if (data.response.valid === "1") {
                window.location.replace("/invite/" + enteredCode);
            } else {
                $('#inviteMessage').html("<img src='img/exclaimation.png' alt='' /><br />Sorry, your code doesn't appear to be valid. Please check and try again. Still having problems? Please drop us a message on Facebook or by phone. Thanks!");
            }
        },
        type: 'GET'
    });
});

$('#btnRegister').click(function (event) {
    event.preventDefault();

    var email = $("#txtEmail").val();
    var invite = $("#hdnCode").val();

    $.ajax({
        url: '/register/' + invite,
        data: {"email":email},
        error: cbInviteValidateError,
        success: function (data) {
            if (data.response.saved === "1") {
                BootstrapDialog.show({
                    title: 'E-Mail Saved!',
                    message: 'Great, thanks! We have stored your email and will let you know when we are ready with the formal invites. If you need to change your email address, just come back here and submit a new address.',
                    buttons: [{
                        label: 'Close',
                        action: function (dialogItself) {
                            dialogItself.close();
                        }
                    }]
                });
            } else {
                BootstrapDialog.show({
                    title: 'Ooops',
                    message: 'Something went wrong :(. Please try again. If you get this message again, please drop Chris an email, Facebook message or phonecall. Thanks',
                    buttons: [{
                        label: 'Close',
                        action: function (dialogItself) {
                            dialogItself.close();
                        }
                    }]
                });
            }
        },
        type: 'GET'
    });
});

var cbInviteValidateError = function (error, xhr) {
    $('#inviteMessage').html("<img src='img/exclaimation.png' alt='' /><br />Sorry, an error has occurred processing your request. Please drop us a message on Facebook or by phone. Thanks!");
}