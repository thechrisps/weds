function cbSaveRsvpAjaxError(idNumber) {
    BootstrapDialog.show({
        title: 'Ooops',
        message: 'Sorry, but unfortunately we were unable to save the response for all people on this invite. Please ensure you have selected responses for each person and try again. If the problem persists, give us a call or message us on Facebook. Thanks.',
        buttons: [{
            label: 'Close',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }]
    });
}


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
    var invite = $("#hdnInvite").val();

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

$('#btnSaveRsvp').click(function (event) {
    event.preventDefault();
    var invite = $("#hdnInvite").val();
    $('#btnSaveRsvp').prop("disabled", true);
    $('#lblSave').html("Saving...");

    // Find all forms on the page
    var forms = [];
    $("form").each(function () {
        forms.push(this.name);
    });

    //Pull the forms that exist on the page (i.e. pull the people - 1 form per person)
    var formIds = [];
    forms.forEach(function (thisForm) {
        var checkPrefix = thisForm.substring(0, 6);
        var checkPostfix = thisForm.substring(6);
        if (checkPrefix === "person" && isNaN(checkPostfix) == false) {
            formIds.push(checkPostfix);
        }
        console.log("Found person with ID " + checkPostfix);
    });

    var deferreds = [];
    console.log("There are " + formIds.length + " people on this invite");
    if (formIds.length > 0) {
        // Create the deferred object
        formIds.forEach(function (idNumber) {
            console.log("Adding deferred AJAX for person " + idNumber)
            var ceremony = $('#ceremony' + idNumber).val();
            var reception = $('#reception' + idNumber).val();
            var evening = $('#evening' + idNumber).val();
            var requirements = $('#txtRequirements' + idNumber).val();
            deferreds.push($.ajax({
                url: '/rsvpsave/' + invite,
                data: { "person": idNumber, "ceremony": ceremony, "reception": reception, "evening": evening, "requirements": requirements },
                error: cbSaveRsvpAjaxError(idNumber)
            }));
        });

        // Fire the deferred objects and wait for completion
        $.when.apply($, deferreds).done(function () {
            console.log(arguments); //array of responses [0][data, status, xhrObj],[1][data, status, xhrObj]...
            $('#lblSave').html("Saved!");
            $('#btnSaveRsvp').prop("disabled", false);
        })

    }

    // Failsafe to re-enable save button
    setTimeout(function () {
        $('#btnSaveRsvp').prop("disabled", false);
    }, 2500);
});

var cbInviteValidateError = function (error, xhr) {
    $('#inviteMessage').html("<img src='img/exclaimation.png' alt='' /><br />Sorry, an error has occurred processing your request. Please drop us a message on Facebook or by phone. Thanks!");
}
