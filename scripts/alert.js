document.addEventListener('DOMContentLoaded', function () {
    console.log("Custom alerts initializing...");
});

let alertBox;
let alertMessage;
let alertButtons;
let alertDetailsButton;
let alertCloseButton;

let dismissTimeout;
let currentAlertType = null;

function showAlert(type, message, options = {}) {
    alertBox = document.getElementById('alert');
    alertMessage = document.getElementById('alert-message');
    alertButtons = document.getElementById('alert-buttons');
    alertDetailsButton = document.getElementById('alert-details-button');
    alertCloseButton = document.getElementById('alert-close-button');

    // Determine the priority of the new alert
    const alertPriority = { 'info': 1, 'alert': 2, 'confirm': 3 };
    const newAlertPriority = alertPriority[type];
    const currentAlertPriority = alertPriority[currentAlertType];

    // If there is a higher or equal priority alert already displayed, do not replace it
    if (currentAlertType && newAlertPriority < currentAlertPriority) {
        return;
    }

    // Reset alert box
    alertBox.className = 'alert';
    alertBox.style.display = 'block';

    // Set message
    alertMessage.textContent = message;

    // Clear any previous dismiss timeout
    if (dismissTimeout) {
        clearTimeout(dismissTimeout);
    }

    // Handle alert types
    if (type === 'info') {
        alertBox.classList.add('alert-info');
        alertButtons.style.display = 'none';
        dismissTimeout = setTimeout(() => {
            alertBox.style.display = 'none';
            currentAlertType = null; // Reset current alert type
        }, options.dismissTime || 3000);
    } else if (type === 'alert') {
        alertBox.classList.add('alert-warning');
        alertButtons.style.display = 'none';
        dismissTimeout = setTimeout(() => {
            alertBox.style.display = 'none';
            currentAlertType = null; // Reset current alert type
        }, options.dismissTime || 3000);
    } else if (type === 'confirm') {
        alertBox.classList.add('alert-confirm');
        alertButtons.style.display = 'flex';

        alertDetailsButton.onclick = function() {
            if (options.alertDetails) options.alertDetails();
        };

        alertCloseButton.onclick = function() {
            if (options.alertClose) options.alertClose();
            closeAlert();
        };
    }

    // Update the current alert type
    currentAlertType = type;
}

function closeAlert() {
    alertBox.style.display = 'none';
    if (dismissTimeout) {
        clearTimeout(dismissTimeout);
    }
    currentAlertType = null; // Reset current alert type
}