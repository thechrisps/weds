﻿// INVITE CODE SUBMIT BUTTON
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
                    message: 'Hi Apple!'
                });
            } else {
                BootstrapDialog.show({
                    message: 'Boo'
                });
            }
        },
        type: 'GET'
    });
});

var cbInviteValidateError = function (error, xhr) {
    $('#inviteMessage').html("<img src='img/exclaimation.png' alt='' /><br />Sorry, an error has occurred processing your request. Please drop us a message on Facebook or by phone. Thanks!");
}