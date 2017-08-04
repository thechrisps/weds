// INVITE CODE SUBMIT BUTTON
$('#btnInviteSubmit').click(function (event) {
    event.preventDefault();

    var enteredCode = $("#txtInviteCode").val();
    enteredCode = enteredCode.toUpperCase();

    $.ajax({
        url: '/validateinvite/'+enteredCode,
        error: cbInviteValidateError,
        dataType: 'jsonp',
        success: cbInviteValidateSuccess,
        type: 'GET'
    });
});

var cbInviteValidateSuccess = function (data, textStatus, xhr) {
    if (data.response.valid === "1") {
        alert("redirect");
    } else {
        $('#inviteMessage').html("<img src='img/exclaimation.png' alt='' /><br />Sorry, your code doesn't appear to be valid. Please check and try again. Still having problems? Please drop us a message on Facebook or by phone. Thanks!&nbsp;<img src='img/exclaimation.png' alt='' />");
    }
}
var cbInviteValidateError = function (error, xhr) {
    $('#inviteMessage').html("<img src='img/exclaimation.png' alt='' /><br />Sorry, an error has occurred processing your request. Please drop us a message on Facebook or by phone. Thanks!&nbsp;<img src='img/exclaimation.png' alt='' />");
}