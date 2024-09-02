let isWalletConnected = false;

// Content that is executed when the page is loaded
document.addEventListener('DOMContentLoaded', async function () {
    if (!isWalletEnabled) {
        console.log("Wallet connectivity not enabled...");
        return;
    }

    connectWalletButton.innerHTML = 'Connect Wallet';

    connectWalletButton = document.getElementById('connect-wallet-button');

    // Add event listener to the connect wallet button
    connectWalletButton.addEventListener('click', async () => {
        await connect();
    });

    // Check if the wallet should already be connected
    if (window.ethereum) {
        await connect();

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        // Listen for disconnection
        window.ethereum.on('disconnect', handleDisconnect);

        // Listen for changes in network chain
        window.ethereum.on('chainChanged', checkChainId);
    } else {
        console.log("No wallet");
    }
});

// Function to connect wallet
async function connect() {
    try {
        // Check if the wallet is already connected
        if (isWalletConnected) {
            showAlert('info', 'Wallet already connected...');
            console.log('Wallet already connected...');
            return;
        }

        if (window.ethereum) {
            // Wait for wallet connection
            await window.ethereum.request({ method: "eth_requestAccounts" });
            window.web3 = new Web3(window.ethereum);

            // Check if the wallet is on the correct chain
            await checkChainId();

            // Emit custom event
            const event = new CustomEvent('walletConnected', { detail: { accounts: await window.ethereum.request({ method: 'eth_accounts' }) } });
            document.dispatchEvent(event);
            showAlert('info', 'Connection Established with Wallet...', {
                dismissTime: 4000
            });
        } else {
            console.log("No wallet");
            showAlert('alert', 'No wallet found. Please install a wallet extension.');
        }
    } catch (error) {
        console.error('Error connecting to wallet:', error);
        showAlert('alert', 'Error connecting to wallet. Please try again.');
    }
}

// Function to check the chain ID
async function checkChainId() {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("Current ChainID: ", chainId + " | Correct ChainID: ", chainID);
    if (chainId !== chainID) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainID }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: chainID,
                                chainName: chainName,
                                nativeCurrency: {
                                    name: nativeCurrencyName,
                                    symbol: nativeCurrencySymbol,
                                    decimals: nativeCurrencyDecimals,
                                },
                                rpcUrls: [endpoint],
                                blockExplorerUrls: [blockExplorerURL],
                            },
                        ],
                    });
                } catch (addError) {
                    console.error('Failed to add the chain:', addError);
                }
            } else {
                console.error('Failed to switch the chain:', switchError);
            }
        }
    }
}

// Function to handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        handleDisconnect();
    } else {
        updateWalletConnectButton(accounts[0]);
    }
}

// Function to handle wallet disconnection
function handleDisconnect() {
    console.log('Wallet disconnected');
    connectWalletButton.innerHTML = 'Connect Wallet';
    getUserContributions();
    isWalletConnected = false;

    // Emit custom event without requesting accounts
    const event = new CustomEvent('walletDisconnected');
    document.dispatchEvent(event);

    showAlert('info', 'Wallet Disconnected...', {
        dismissTime: 4000
    });
}

// Subscribe to the wallet connection custom event
document.addEventListener('walletConnected', function (event) {
    console.log('Wallet connected:', event.detail.accounts);

    // Update the connect wallet button to display the connected wallet address
    updateWalletConnectButton(event.detail.accounts[0]);

    // Set the wallet connection status to true
    isWalletConnected = true;
});

// Function to update the connect wallet button
async function updateWalletConnectButton(address) {
    connectWalletButton.innerHTML = truncateAddress(address, 4);

    // Check if the connected user has an ENS on mainnet
    const ensName = await resolveAddressToENS(address);
    if (ensName) {
        // See if the ENS is too long to display in the button and truncate
        if (ensName.length > 10) {
            const truncatedENS = truncateAddress(ensName, 4);
            connectWalletButton.innerHTML = truncatedENS;
        } else {
            connectWalletButton.innerHTML = ensName;
        }
    }
}


// Helper functions to truncate wallet addresses and ENS
function truncateAddress(address, amount) {
    return `${address.slice(0, amount)}...${address.slice(-amount)}`;
}



// make it so the base input field redirects to [userinput]+https://www.base.org/names?claim=0xjoyful.base.eth - so, replace 0xjoyful with the user input
// try to make it look nice somehow that is mobile friendly and not glitchy
// document.addEventListener('DOMContentLoaded', () => {
//     const ensInput = document.getElementById('ens-input');

//     // Function to update the input value with the .base.eth suffix
//     const updateInputValue = () => {
//         const baseValue = ensInput.value.replace('.base.eth', '');
//         ensInput.value = baseValue + '.base.eth';
//         ensInput.setSelectionRange(baseValue.length, baseValue.length);
//     };

//     // Initial update to ensure the suffix is present
//     updateInputValue();

//     ensInput.addEventListener('input', () => {
//         // Prevent the user from deleting the suffix
//         if (!ensInput.value.endsWith('.base.eth')) {
//             updateInputValue();
//         }
//     });

//     ensInput.addEventListener('keydown', (event) => {
//         const baseValue = ensInput.value.replace('.base.eth', '');
//         const cursorPosition = ensInput.selectionStart;

//         // Allow navigation keys and editing within the base value
//         if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Backspace' || event.key === 'Delete') {
//             if (cursorPosition > baseValue.length && (event.key === 'Backspace' || event.key === 'Delete')) {
//                 event.preventDefault();
//             } else {
//                 setTimeout(() => {
//                     updateInputValue();
//                 }, 0);
//             }
//         }
//     });
// });