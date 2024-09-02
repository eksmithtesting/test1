// Call getEthBalance on page load
document.addEventListener('DOMContentLoaded', function () {
    if (!isPresale) {
        console.log("Presale not enabled...");
        return;
    }
    if (refreshTotalContributions && contributionCheckInterval > 0) {
        setInterval(getNativeCurrencyBalance, contributionCheckInterval);
    } else {
        getNativeCurrencyBalance();
    }
    if (!isWalletEnabled) {
        userContributions.remove();
        presaleButton.remove();
    }
    if (!isWalletConnected) {
        generateReferralLinkButton.childNodes[0].nodeValue = 'Please Connect a Wallet';
        if (isWalletEnabled) {
            getUserContributions();
        }
    }
    if (presaleStatus === "The presale has concluded.") {
        updatePresaleTimer();
        return;
    } else {
        setInterval(updatePresaleTimer, 1000);
    }
    if (isReferralEnabled) {
        populateReferralAddress();
    }
});
document.addEventListener('walletConnected', function () {
    if (generateReferralLinkButton != null && isReferralEnabled) {
        generateReferralLinkButton.addEventListener('click', generateReferralLink);
        generateReferralLinkButton.childNodes[0].nodeValue = 'Generate Referral Link';
    }

    getUserContributions();
});
document.addEventListener('walletDisconnected', function () {
    if (generateReferralLinkButton != null && isReferralEnabled) {
        generateReferralLinkButton.disabled = true;
        generateReferralLinkButton.removeEventListener('click', generateReferralLink);
        generateReferralLinkButton.childNodes[0].nodeValue = 'No Wallet Connected';
    }
});

function checkPresaleTimer() {
    const currentDate = new Date();
    const launchDateObject = new Date(launchDate);

    // Calculate the time until the presale is concluded
    const timeUntilLaunch = launchDateObject - currentDate;

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeUntilLaunch / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilLaunch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilLaunch % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntilLaunch % (1000 * 60)) / 1000);

    if (timeUntilLaunch < 0) {
        return "The presale has concluded.";
    }

    // Format the time difference
    const formattedTime = `Time Left: ${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;

    return formattedTime;
}
function displayTotalContributions(balance) {
    const totalContributionsElement = document.getElementById('total-contributions');
    totalContributionsElement.innerText = `Total Contributions: ${balance.toFixed(5)} ${nativeCurrencySymbol}`;
}
async function getUserContributions() {
    if (window.ethereum) {
        if (window.ethereum.selectedAddress) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const connectedWallet = accounts[0];

                const url = endpoint;
                const requestData = {
                    jsonrpc: "2.0",
                    id: 1,
                    method: "alchemy_getAssetTransfers",
                    params: [
                        {
                            fromBlock: "0x0", // Start from the beginning
                            toBlock: "latest",
                            fromAddress: connectedWallet,
                            toAddress: presaleAddress,
                            category: ["external"],
                            excludeZeroValue: true,
                            maxCount: "0x3e8", // Adjust as needed
                        },
                    ],
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });

                const data = await response.json();
                if (data.result && data.result.transfers) {
                    const totalContributionInWei = data.result.transfers.reduce((sum, transfer) => {
                        const valueInWei = BigInt(parseFloat(transfer.value) * 1e18);
                        return sum + valueInWei;
                    }, BigInt(0));

                    const totalContributionInEth = Web3.utils.fromWei(totalContributionInWei.toString(), 'ether');
                    const totalContributionInEthNumber = parseFloat(totalContributionInEth);

                    displayUserContributions(totalContributionInEthNumber);
                    console.log('Connected user has contributed:', totalContributionInEthNumber + ` ${nativeCurrencySymbol}`);
                } else {
                    console.log('No contributions from user found for the presale address.');
                    displayUserContributions(0); // No contributions
                }
            } catch (error) {
                console.error('Error fetching user contributions:', error);
                displayUserContributions(null); // Use null to indicate error
            }
        } else {
            displayUserContributions("NoConnection");
        }
    } else {
        showAlert('alert', 'Wallet not detected! Please install a crypto wallet.');
        displayUserContributions("NoWallet");
    }
}
function displayUserContributions(balance) {
    userContributions.innerText = 'Fetching your contribution...';
    if (balance === null) {
        userContributions.innerText = `Unable to fetch your contribution. Please try again later.`;
    } else if (balance === "NoWallet") {
        userContributions.innerText = `Please install a crypto wallet to view your contribution.`;
    } else if (balance === "NoConnection") {
        userContributions.innerText = `Please connect a wallet to view your contribution.`;
    } else {
        userContributions.innerText = `Your Contribution: ${balance.toFixed(5)} ${nativeCurrencySymbol}`;
    }
}
// Function to calculate and display the percentage of the balance relative to the presale target
function displayPercentage(balance) {
    const percentage = (balance / presaleTarget) * 100;
    const percentageElement = document.getElementById('percentage');
    percentageElement.innerText = `Progress: ${percentage.toFixed(2)}%`;

    // Update progress bar width
    const progressBarFill = document.getElementById('progress-bar-fill');
    progressBarFill.style.width = `${Math.min(percentage, 100)}%`;

    // Check if the percentage is above 100%
    if (percentage > 100) {
        // Create a new progress bar fill if it doesn't exist
        let extraProgressBarFill = document.getElementById('extra-progress-bar-fill');
        if (!extraProgressBarFill) {
            extraProgressBarFill = document.createElement('div');
            extraProgressBarFill.id = 'extra-progress-bar-fill';
            extraProgressBarFill.className = 'bar-fill';
            document.getElementById('progress-bar').appendChild(extraProgressBarFill);
        }
        extraProgressBarFill.style.width = `${percentage - 100}%`;
    } if (percentage > 200) {
        // Create yes another new progress bar fill to overlay for the extra percentage
        let extraProgressBarFill2 = document.getElementById('extra-progress-bar-fill-2');
        if (!extraProgressBarFill2) {
            extraProgressBarFill2 = document.createElement('div');
            extraProgressBarFill2.id = 'extra-progress-bar-fill-2';
            extraProgressBarFill2.className = 'bar-fill';
            document.getElementById('progress-bar').appendChild(extraProgressBarFill2);
        }
        extraProgressBarFill2.style.width = `${percentage - 200}%`;
    } else {
        // Remove the extra progress bar fill if it exists
        const extraProgressBarFill = document.getElementById('extra-progress-bar-fill');
        if (extraProgressBarFill) {
            extraProgressBarFill.remove();
        }
        const extraProgressBarFill2 = document.getElementById('extra-progress-bar-fill-2');
        if (extraProgressBarFill2) {
            extraProgressBarFill2.remove();
        }
    }

    // Check if the presale target has been met or not
    if (balance >= presaleTarget) {
        presaleTargetMet = true;
    }
}
function updatePresaleTimer() {
    const timerElement = document.getElementById('presale-timer');
    if (timerElement) {
        if (presaleStatus === "The presale has concluded.") {
            if (presaleTargetMet) {
                timerElement.innerText = "The presale has concluded. The target has been met!";
            } else {
                timerElement.innerText = "The presale has concluded. The target has not been met.";
            }
        } else {
            timerElement.innerText = checkPresaleTimer();
        }
    }
}

// #region Contribution Process
// Functions to handle the contribution process
// startContribution is called when the user clicks either of the contribute buttons
// The handler functions are used to process the callback events
// The contributePresale function is used to send the transaction to the blockchain
// The cancelContribution function is used to reset the UI and remove event listeners

let referralAddress = null;

function startContribution(event) {
    if (window.ethereum) {
        if (window.ethereum.selectedAddress) {
            // Log that the contribution process has started
            console.log('Contribution process started...');

            // Determine which button was pressed by checking the event target's ID
            const buttonId = event.target.id;

            // Add your logic based on the buttonId
            if (buttonId === 'presale-button') {
                console.log('Presale button was pressed.');

                // Hide the presale contribution button and display the input field
                presaleButton.style.display = 'none';
                presaleContributionInputContainer.style.display = 'flex';

                presaleContributionInputfield.addEventListener('keydown', handlePresaleKeydown);
                if (isReferralEnabled) {
                    presaleReferralInputfield.addEventListener('keydown', handlePresaleKeydown);
                } else {
                    presaleReferralInputfield.style.display = 'none';
                }
                presaleContributionConfirmButton.addEventListener('click', handlePresaleConfirmClick);

                presaleContributionCancelButton.addEventListener('click', cancelContribution);
            } else if (buttonId === 'buy-button') {
                console.log('Buy/Contribute button was pressed.');

                // Hide the dynamic buy/contribute button and display the input field
                buyButton.style.display = 'none';
                buyContributionInputContainer.style.display = 'flex';

                buyContributionInputfield.addEventListener('keydown', handleBuyKeydown);
                if (isReferralEnabled) {
                    buyContributionInputfield.addEventListener('keydown', handleBuyKeydown);
                } else {
                    buyReferralInputfield.style.display = 'none';
                }
                buyContributionConfirmButton.addEventListener('click', handleBuyConfirmClick);

                buyContributionCancelButton.addEventListener('click', cancelContribution);
            }
        } else {
            showAlert('alert', 'Wallet not connected! Please connect your wallet.');
        }
    }
    else {
        showAlert('alert', 'Wallet not detected! Please install a crypto wallet.');
    }
}

// #region Event Listeners for Contribution Process
// Presale Container
function handlePresaleKeydown(event) {
    if (event.key === 'Enter') {
        const contributionAmount = presaleContributionInputfield.value;
        const referralAddress = referralLink.value;

        loadContributionProcess('presale');

        checkReferralAddress(contributionAmount, referralAddress);
    }

    if (event.key === 'Escape') {
        cancelContribution();
    }
}
function handlePresaleConfirmClick() {
    const contributionAmount = presaleContributionInputfield.value;
    const referralAddress = referralLink.value

    loadContributionProcess('presale');

    checkReferralAddress(contributionAmount, referralAddress);
}
// Buy Container
function handleBuyKeydown(event) {
    if (event.key === 'Enter') {
        const contributionAmount = buyContributionInputfield.value;
        const referralAddress = referralLink.value

        loadContributionProcess('buy');

        checkReferralAddress(contributionAmount, referralAddress);
    }
    if (event.key === 'Escape') {
        cancelContribution();
    }
}
function handleBuyConfirmClick() {
    const contributionAmount = buyContributionInputfield.value;
    const referralAddress = referralLink.value

    loadContributionProcess('buy');

    checkReferralAddress(contributionAmount, referralAddress);
}
function loadContributionProcess(container) {
    let cancelButton, confirmButton, loader;

    if (container === 'presale') {
        cancelButton = presaleContributionCancelButton;
        confirmButton = presaleContributionConfirmButton;
        loader = presaleLoader;
    } else if (container === 'buy') {
        cancelButton = buyContributionCancelButton;
        confirmButton = buyContributionConfirmButton;
        loader = buyLoader;
    }

    if (cancelButton && confirmButton && loader) {
        // Apply the shrink animation
        cancelButton.classList.add('shrink');

        // Set display to none after the animation completes
        cancelButton.addEventListener('animationend', () => {
            cancelButton.style.display = 'none';
            cancelButton.classList.remove('shrink'); // Clean up the class
        });

        // Adjust the confirm button
        confirmButton.style.width = '100%';
        confirmButton.childNodes[0].nodeValue = '';
        confirmButton.disabled = true;

        // Show the loader
        loader.style.display = 'block';
    }
}
// #endregion Event Listeners for Contribution Process

async function checkReferralAddress(contributionAmount, referralAddress) {
    if (!window.ethereum || !window.ethereum.selectedAddress) {
        showAlert('alert', 'Wallet not connected! Please connect your wallet.');
        restorePresaleContainer();
        return;
    }

    const connectedWallet = window.ethereum.selectedAddress.toLowerCase();

    // Check if the connected wallet is the same as the referral address
    if (referralAddress.toLowerCase() === connectedWallet) {
        showAlert('alert', 'You cannot use your own wallet address as a referral!');
        restorePresaleContainer();
        return;
    }

    if (referralAddress === '') {
        contributePresale(contributionAmount, null);
    } else if (validWalletAddress.test(referralAddress)) {
        contributePresale(contributionAmount, referralAddress);
    } else if (referralAddress.length > 4 && referralAddress.slice(-4).toLowerCase() === '.eth') {
        const resolvedAddress = await resolveENSName(referralAddress);
        if (resolvedAddress) {
            contributePresale(contributionAmount, resolvedAddress);
        } else {
            console.log("Could not resolve ENS to a valid Ethereum address.");
        }
    } else {
        showAlert('alert', 'Invalid wallet address or ENS. Please enter a valid Ethereum wallet address or ENS.');
    }
}
async function contributePresale(contributionAmount, referralAddress) {
    if (window.ethereum) {
        console.log("Contribution amount:", contributionAmount);
        // Parse the contribution amount as a float
        // This is used to check if the amount is within the valid contribution range
        // *** This will not stop the user from contributing over the maximum amount - that is up to you to track.***
        const amount = parseFloat(contributionAmount);
        console.log("Converted amount:", amount);
        //
        // Check if the contribution amount is within the valid range and is not 0
        if (amount < minimumContribution && minimumContribution != 0 || amount > maximumContribution && maximumContribution != 0) {
            showAlert('alert', `Contribution amount must be between ${minimumContribution} and ${maximumContribution} ETH.`);
            restorePresaleContainer();
            return; // Stop further processing
        }
        if (amount === 0) {
            showAlert('alert', 'Contribution amount cannot be 0.');
            restorePresaleContainer();
            return; // Stop further processing
        }

        // Request the user's account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        // Convert the amount to wei
        const amountInWei = Web3.utils.toWei(contributionAmount, 'ether');
        console.log("Amount in Wei:", amountInWei);

        const amountHex = '0x' + BigInt(amountInWei).toString(16);
        console.log("Amount in Hex:", amountHex);

        // Prepare the transaction parameters
        const txParams = {
            from: account,
            to: presaleAddress,
            value: amountHex,
            data: null, // Initialize data as null
        };

        // If a referral address is provided, encode it and replace the data field
        if (referralAddress != null) {
            const referralAddressHex = web3.utils.toHex(referralAddress);
            console.log("Referral Address Hex:", referralAddressHex);
            txParams.data = referralAddressHex;
        } else {
            console.log("No referral address provided, leaving data field as null.");
        }

        console.log("Transaction Parameters:", txParams);

        try {
            await checkChainId();

            // Send the transaction
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [txParams],
            });

            console.log('Transaction Hash:', txHash);
            showAlert('info', 'Transaction sent! ' + txHash, {
                dismissTime: 15000,
            });

            // Wait for the transaction receipt
            let receipt = null;
            while (receipt === null) {
                receipt = await web3.eth.getTransactionReceipt(txHash);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
                console.log('Polling for transaction receipt...');
            }

            console.log('Transaction Receipt:', receipt);
            showAlert('confirm', 'Transaction Confirmed! ' + txHash, {
                alertDetails: function () {
                    console.log("Opening transaction details in a new tab...");
                    window.open(`${blockExplorerURL}/tx/${txHash}`, '_blank');
                },
                alertClose: function () {
                    console.log("Closing the alert...");
                }
            });

            getUserContributions();
            getNativeCurrencyBalance();
        } catch (error) {
            console.error('Transaction failed:', error);
            showAlert('alert', 'Transaction failed: ' + error.message, {
                dismissTime: 8000,
            });
        }
    } else {
        showAlert('alert', 'Wallet not detected! Please install a crypto wallet.');
    }

    restorePresaleContainer();
}
function restorePresaleContainer() {
    // Restore the presale container
    presaleContributionCancelButton.style.display = 'block';
    presaleContributionCancelButton.classList.add('expand');
    presaleContributionCancelButton.disabled = false;

    presaleContributionCancelButton.addEventListener('animationend', () => {
        presaleContributionCancelButton.style.display = 'block';
        presaleContributionCancelButton.classList.remove('expand');
    });

    presaleContributionConfirmButton.style.width = '100%';
    presaleContributionConfirmButton.childNodes[0].nodeValue = 'Confirm';
    presaleContributionConfirmButton.disabled = false;
    presaleLoader.style.display = 'none';

    // Restore the buy container
    buyContributionCancelButton.style.display = 'block';
    buyContributionCancelButton.classList.add('expand');
    buyContributionCancelButton.disabled = false;

    buyContributionCancelButton.addEventListener('animationend', () => {
        buyContributionCancelButton.style.display = 'block';
        buyContributionCancelButton.classList.remove('expand');
    });

    buyContributionConfirmButton.style.width = '100%';
    buyContributionConfirmButton.childNodes[0].nodeValue = 'Confirm';
    buyContributionConfirmButton.disabled = false;
    buyLoader.style.display = 'none';
}
function cancelContribution() {
    // Remove event listeners for presale
    presaleContributionInputfield.removeEventListener('keydown', handlePresaleKeydown);
    presaleContributionConfirmButton.removeEventListener('click', handlePresaleConfirmClick);

    // Remove event listeners for buy
    buyContributionInputfield.removeEventListener('keydown', handleBuyKeydown);
    buyContributionConfirmButton.removeEventListener('click', handleBuyConfirmClick);

    // Hide input fields and confirm buttons
    presaleContributionInputContainer.style.display = 'none';
    buyContributionInputContainer.style.display = 'none';

    // Reshow the contribute/buy buttons
    presaleButton.style.display = 'block';
    buyButton.style.display = 'block';
}
// #endregion Contribution Process

// #region Referrals
async function populateReferralAddress() {
    const urlParams = new URLSearchParams(window.location.search);
    let referrerAddress = urlParams.get('ref');

    if (referrerAddress) {
        console.log('Referral Address:', referrerAddress);

        // If the referral address is an ENS, use the function resolveENSName to determine the wallet address
        if (validENS.test(referrerAddress)) {
            referrerAddress = await resolveENSName(referrerAddress);
            if (referrerAddress === null) {
                showAlert('alert', 'Could not resolve ENS to a valid Ethereum address. Reloading the page and removing referral link...', {
                    dismissTime: 5000
                });
                // Remove the 'ref' parameter and reload the page
                urlParams.delete('ref');

                setTimeout(() => {
                    window.location.search = urlParams.toString();
                }, 5000);
                return;
            }
        } else {
            console.log('Referral address is not an ENS.');
            if (validWalletAddress.test(referrerAddress)) {
                console.log('Referral address is a valid wallet address.');
            } else {
                showAlert('alert', 'Invalid referral link! Reloading page and removing address...');
                // Remove the 'ref' parameter and reload the page
                urlParams.delete('ref');

                // Wait 5 seconds before reloading the page
                await new Promise(resolve => setTimeout(resolve, 3000));
                window.location.search = urlParams.toString();
                return;
            }
        }

        referralLink.value = referrerAddress;

        console.log("Populating hidden referral input field with address:", referrerAddress);

        // Populate the input fields with the referral address so that it can be captured
        presaleReferralInputfield.value = 'Referral: ' + truncateAddress(referrerAddress, 8);
        buyReferralInputfield.value = 'Referral: ' + truncateAddress(referrerAddress, 8);

        // Hide the referral input fields
        presaleReferralInputfield.style.disabled = true;
        buyReferralInputfield.style.disabled = true;
    } else {
        console.log('No referral address detected.');

        presaleReferralInputfield.style.display = 'none';
        buyReferralInputfield.style.display = 'none';
    }
}
async function generateReferralLink() {
    if (window.ethereum) {
        // Hide the button text
        generateReferralLinkButton.childNodes[0].nodeValue = '';

        // Show the loader
        referralLoader.style.display = 'block';

        window.ethereum.request({ method: 'eth_requestAccounts' }).then(async accounts => {
            const referrerAddress = accounts[0];
            let actualReferralLink;

            // Check if the referrer address resolves to an ENS
            const ensName = await resolveAddressToENS(referrerAddress);

            if (ensName) {
                // If an ENS is found, use it in the referral link
                actualReferralLink = `${window.location.origin}?ref=${ensName}`;
            } else {
                // Otherwise, use the original wallet address
                actualReferralLink = `${window.location.origin}?ref=${referrerAddress}`;

                // Contextually reveal the basename sign-up process
                ensContextualClaim();
            }

            console.log("Generated Referral Link:", actualReferralLink);

            // Copy the referral link to the clipboard
            navigator.clipboard.writeText(actualReferralLink).then(() => {
                showAlert('info', 'Referral link: ' + actualReferralLink + ' - copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy referral link: ', err);
            });

            // Hide the loader
            referralLoader.style.display = 'none';

            generateReferralLinkButton.childNodes[0].nodeValue = 'Link Copied to Clipboard!';

            referralLink.value = actualReferralLink;
            referralLink.style.display = 'block';

            await new Promise(resolve => setTimeout(resolve, 10000));

            referralLink.style.display = 'none';

            // Restore the button text
            generateReferralLinkButton.childNodes[0].nodeValue = 'Generate Referral Link';
        });
    } else {
        showAlert('alert', 'Please connect your wallet.');
    }
}
function ensContextualClaim() {
    ensPrompt.style.display = 'block';
    // Create the button animation
    const ensNames = [
        '0xhappy.base.eth',
        'tukyo.base.eth',
        'jesse.base.eth',
        'vitalik.base.eth',
        'satoshi.base.eth',
        'd3v3l0pr.base.eth',
        'apollo69.base.eth',
        'd0gecoin.base.eth',
        'four.base.eth',
        'wagmi.base.eth',
        'm00n.base.eth',
        'hodl.base.eth',
    ];

    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * ensNames.length);
        const randomEnsName = ensNames[randomIndex];
        ensButton.textContent = randomEnsName;
    }, 1000);

    // Add event click listener to the button
    ensButton.addEventListener('click', () => {
        window.open('https://www.base.org/names?claim', '_blank');
    });
}
// #endregion Referrals