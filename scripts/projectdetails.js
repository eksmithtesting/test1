var projectTitle = "Apollo 69";
var projectDescription = [
    "Apollo 69 is a meme project that focuses on deep lore, high quality 2D and 3D graphical assets, experienced team and advisors, professional CMs and marketers, many KOL partners, multiple marketing initiatives and development of infrastructure on the Base chain. For more detailed information on our lunar mission, check out our main website and our medium page."
];
var aboutImageDescription = "Feil's living rent-free inside the Base blockchain, and he wants YOU to help him moonwalk all over the competition!";
var chainID = "0x2105";
var chainName = "Base Mainnet";
var nativeCurrencyName = "ETH";
var nativeCurrencySymbol = "ETH";
var nativeCurrencyDecimals = 18;
var blockExplorerURL = "https://basescan.org";
var isWalletEnabled = true;
var contractAddress = "0xA66DF2f59C6e37E66a063EE3A82eA63C0D521d14";
var totalSupply = "7,201,969,690";
var tokenName = "APOLLO";
var tokenSymbol = "APOLLO";
var tokenDecimals = "18";
var tokenType = "ERC20";
var lp = "50%";
var tax = "0% / 0%";
var endpoint = "https://base-mainnet.g.alchemy.com/v2/wrx1n_eUgVvACBzfyKZK6Vz04it2Vzqb";
var endpointMainnet = "https://eth-mainnet.g.alchemy.com/v2/wrx1n_eUgVvACBzfyKZK6Vz04it2Vzqb";
var isPresale = true;
var presaleAddress = "0x383bC168D9b7A6B38f69a00828ebe5dF76084FB4"; // replace with 0x4828515d2Fa448C9F64A149DF20470066A3d78b1
var presaleTarget = "200";
var launchDate = "2024-09-29T19:30:00";
var minimumContribution = "0.0001";
var maximumContribution = "1";
var refreshTotalContributions = false;
var contributionCheckInterval = 1000;
var leaderboardEnabled = true;
var refreshLeaderboard = false;
var leaderboardCheckInterval = 1000;
var maxLeaderboardRows = 100;
var isReferralEnabled = true;
var isBuyingEnabled = true;
var buyLink = "https://app.uniswap.org/swap?outputCurrency=0x21b9D428EB20FA075A29d51813E57BAb85406620";
var buyDescription = "$APOLLO is a fungible cryptocurrency with no intrinsic value or expectation of financial return. It is a simple meme coin cooked up for the culture. Contrary to what you see online where everyone posts Ws and very few Ls on social media, most ppl lose money so always consider what you can afford to lose before buying $APOLLO. We are only here to entertain and to share community vibes.";
var theme = "presale";
var blockchainColor = "#0151fd"
var backgroundColor = "#000000"
var mainColor = "#ffffff"
var secondaryColor = "#0151fd"
var accentColor = "#0151bd"
var fontFamily = "Poppins, sans-serif"
var fontColor = "#ffffff"
var fontColorSecondary = "#000000"
var linkColor = "#ffffff"
var linkHoverColor = "#00abfd"
var navigationEnabled = true;
var navigationLinks = [
    {
        name: "About",
        link: "#about",
    },
    {
        name: "Leaderboard",
        link: "#leaderboard",
    },
    {
        name: "Tokenomics",
        link: "#tokenomics",
    },
];
var telegramLink = "https://t.me/tukyowave";
var twitterLink = "https://twitter.com/tukyowave";
var discordLink = "None";
var githubLink = "None";
var extraLink = "None";

let projectTitleValue;
let logoImg;

let contractAddressValue;
let totalSupplyValue;
let lpValue;
let taxValue;

let presaleContainer;
let referralsContainer;
let currentDate;

let connectWalletButton;
let buyButton;
let presaleButton;

let presaleStatus;
let presaleTargetMet;

let presaleContributionInputContainer;
let presaleContributionInputfield;
let presaleReferralInputfield;
let presaleContributionConfirmButton;
let presaleContributionCancelButton;
let userContributions;
let presaleLoader;

let buyContributionInputContainer;
let buyContributionInputfield;
let buyReferralInputfield;
let buyContributionConfirmButton;
let buyContributionCancelButton;
let buyLoader;

let generateReferralLinkButton;
let referralLoader;
let referralLink;
let ensButton;
let ensPrompt;

let contributionInputs;
let contributionRange;

let leaderboard;
let leaderboardList;

let navElement;
let hamburgerMenuButton;

let twitterIcon;
let telegramIcon;
let discordIcon
let githubIcon;

let validWalletAddress = /^0x[a-fA-F0-9]{40}$/;
let validENS = /^([a-z0-9-]+\.)*eth$/i;

let chainlinkUSDPriceFeed = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
document.addEventListener('DOMContentLoaded', async function () {
    window.addEventListener('resize', handleResize);
    projectTitleValue = document.getElementById('project-title-value')
    logoImg = document.getElementById('logo-img');

    contractAddressValue = document.getElementById('contract-address-value');
    totalSupplyValue = document.getElementById('total-supply-value');
    lpValue = document.getElementById('lp-value');
    taxValue = document.getElementById('tax-value');

    presaleContainer = document.getElementById('presale');
    referralsContainer = document.getElementById('referrals');

    connectWalletButton = document.getElementById('connect-wallet-button');
    buyButton = document.getElementById('buy-button');
    presaleButton = document.getElementById('presale-button');

    generateReferralLinkButton = document.getElementById('generate-referral-link-button');
    referralLoader = document.getElementById('referral-loader');
    
    referralLink = document.getElementById('referral-link-value');
    ensButton = document.getElementById('ens-button');
    ensPrompt = document.getElementById('ens-prompt');

    presaleContributionInputContainer = document.getElementById('presale-contribution-input-container');
    presaleContributionInputContainer.style.display = 'none';
    presaleContributionInputfield = document.getElementById('presale-contribution-input');
    presaleReferralInputfield = document.getElementById('presale-referral-input');
    presaleContributionConfirmButton = document.getElementById('presale-contribution-confirm-button');
    presaleContributionCancelButton = document.getElementById('presale-contribution-cancel-button');
    userContributions = document.getElementById('user-contributions');
    presaleLoader = document.getElementById('presale-loader');

    buyContributionInputContainer = document.getElementById('buy-contribution-input-container');
    buyContributionInputContainer.style.display = 'none';
    buyContributionInputfield = document.getElementById('buy-contribution-input');
    buyReferralInputfield = document.getElementById('buy-referral-input');
    buyContributionConfirmButton = document.getElementById('buy-contribution-confirm-button');
    buyContributionCancelButton = document.getElementById('buy-contribution-cancel-button');
    buyLoader = document.getElementById('buy-loader');

    contributionInputs = document.querySelectorAll('.contribution-input');
    contributionRange = document.querySelectorAll('.contribution-range');

    leaderboard = document.getElementById('leaderboard');
    leaderboardList = document.getElementById('leaderboard-list');

    navElement = document.getElementById('nav');
    hamburgerMenuButton = document.getElementById('hamburger-button');

    twitterIcon = document.getElementById('twitter-icon').parentElement;
    telegramIcon = document.getElementById('telegram-icon').parentElement;
    discordIcon = document.getElementById('discord-icon').parentElement;
    githubIcon = document.getElementById('github-icon').parentElement;
    extraIcon = document.getElementById('extra-icon').parentElement;

    projectTitleValue.innerHTML = "Disclaimer:";
    totalSupplyValue.innerHTML = totalSupply;
    lpValue.innerHTML = lp;
    taxValue.innerHTML = tax;

    if (isPresale) {
        presaleContainer.style.display = 'flex';

        presaleStatus = checkPresaleTimer();
        if (presaleStatus === "The presale has concluded.") {
            presaleButton.style.display = 'none';
        } else {
            presaleButton.addEventListener('click', startContribution);
        }

        presaleButton.addEventListener('click', startContribution);

        if (leaderboardEnabled) {
            leaderboard.style.display = 'flex';
        } else {
            leaderboard.style.display = 'none';
        }
    } else {
        presaleContainer.style.display = 'none';
        leaderboard.style.display = 'none';
        referralsContainer.style.display = 'none';
    }

    if (isWalletEnabled) {
        connectWalletButton.style.display = 'block';
        if (isReferralEnabled) {
            referralsContainer.style.display = 'flex';
        } else {
            referralsContainer.style.display = 'none';
        }
    } else {
        connectWalletButton.style.display = 'none';
        presaleButton.style.display = 'none';
        referralsContainer.style.display = 'none';
    }

    contributionRange.forEach(function (element) {
        element.textContent = "Minimum Contribution: " + minimumContribution + " " + nativeCurrencySymbol + " • Maximum Contribution: " + maximumContribution + " " + nativeCurrencySymbol;

        if (minimumContribution === "0" && maximumContribution === "0") {
            element.textContent = "No Contribution Limit";
        }
    });

    if (isBuyingEnabled) {
        if (isPresale) {
            presaleStatus = checkPresaleTimer();

            if (presaleStatus === "The presale has concluded.") {
                buyButton.textContent = 'Buy';
                contractAddressValue.innerHTML = contractAddress;

            } else {
                if (isWalletEnabled) {
                    buyButton.textContent = 'Contribute';
                    buyButton.addEventListener('click', startContribution);
                } else {
                    buyButton.textContent = 'Coming Soon';
                }

                contractAddressValue.innerHTML = "The contract address will be available after the presale concludes and buying is enabled for the token.";
            }
        } else {
            buyButton.textContent = 'Buy';
            contractAddressValue.innerHTML = contractAddress;

            buyButton.addEventListener('click', function () {
                window.open(buyLink, '_blank');
            });
        }
    } else {
        if (isPresale) {
            presaleStatus = checkPresaleTimer();

            if (presaleStatus === "The presale has concluded.") {
                buyButton.textContent = 'Coming Soon';

                contractAddressValue.innerHTML = "The presale has concluded. Buying will be enabled shortly!";
            } else {
                if (isWalletEnabled) {
                    buyButton.textContent = 'Contribute';
                    buyButton.addEventListener('click', startContribution);
                } else {
                    buyButton.textContent = 'Coming Soon';
                }

                contractAddressValue.innerHTML = "The contract address will be available after the presale concludes and buying is enabled for the token.";
            }
        }
        else {
            const buyRightSplit = document.getElementById('buy-right-split');
            buyRightSplit.style.display = 'none';
        }
    }

    if (navigationEnabled) {
        const navLinks = navElement.querySelectorAll('a');
        navLinks.forEach(link => link.remove());
        navigationLinks.forEach(link => {
            const anchor = document.createElement('a');
            anchor.textContent = link.name;
            anchor.href = link.link;
            anchor.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent the default anchor behavior
                const targetSection = document.querySelector(link.link);
    
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
    
            navElement.insertBefore(anchor, connectWalletButton);
        });  
        
        hamburgerMenuButton.addEventListener('click', toggleNav);
    } else {
        const navLinks = navElement.querySelectorAll('a');
        navLinks.forEach(link => link.remove());
    
        console.log('Navigation disabled...');
    }
    

    if (twitterLink == "None") {
        twitterIcon.remove();
    } else {
        twitterIcon.href = twitterLink;
    }
    if (telegramLink == "None") {
        telegramIcon.remove();
    } else {
        telegramIcon.href = telegramLink;
    }
    if (discordLink == "None") {
        discordIcon.remove();
    } else {
        discordIcon.href = discordLink;
    }
    if (githubLink == "None") {
        githubIcon.remove();
    } else {
        githubIcon.href = githubLink;
    }
    if (extraLink == "None") {
        extraIcon.remove();
    } else {
        extraIcon.href = extraLink;
    }

    setTheme(theme);
    updateCSSVariables();
    populateProjectDescriptions();
    handleResize();
    logProjectData();

    checkEndpointConnection(endpoint, chainName);
    checkEndpointConnection(endpointMainnet, 'Mainnet');
});
function setTheme(theme) {
    var linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'theme/' + theme + '.css';
    document.head.appendChild(linkElement);
}
function updateCSSVariables() {
    const root = document.documentElement;

    root.style.setProperty('--blockchain-color', blockchainColor);
    root.style.setProperty('--background-color', backgroundColor);
    root.style.setProperty('--main-color', mainColor);
    root.style.setProperty('--secondary-color', secondaryColor);
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--font-family', fontFamily);
    root.style.setProperty('--font-color', fontColor);
    root.style.setProperty('--font-color-secondary', fontColorSecondary);
    root.style.setProperty('--link-color', linkColor);
    root.style.setProperty('--link-highlight-color', linkHoverColor);
}
function populateProjectDescriptions() {
    projectDescription.forEach((description, index) => {
        const paragraph = document.getElementById(`description-paragraph-${index}`);
        if (paragraph) {
            paragraph.textContent = description;
        }
    });
    const aboutImageParagraph = document.getElementById('about-image-paragraph');
    if (aboutImageParagraph) {
        aboutImageParagraph.textContent = aboutImageDescription;
    }
    const buyDescriptionElement = document.getElementById('buy-description-paragraph');
    if (buyDescriptionElement) {
        buyDescriptionElement.textContent = buyDescription;
    }
}
function logProjectData() {
    console.log(
        "Project Information:",
        "\nTitle: " + projectTitle,
        "\nBlockchain: ", chainName,
        "\nWallet Enabled: ", isWalletEnabled,
        "\nPresale: ", isPresale,
        "\n", presaleStatus,
        "\nLeaderboards: ", leaderboardEnabled,
        "\nReferrals: ", isReferralEnabled
    );
}
function toggleNav() {
    if (navElement.style.display === 'flex') {
        navElement.style.display = 'none';
        hamburgerMenuButton.classList.remove('active');
    } else {
        navElement.style.display = 'flex';
        hamburgerMenuButton.classList.add('active');
    }
}
function handleResize() {
    const windowWidth = window.innerWidth;

    if (windowWidth <= 950) {
        navElement.style.display = 'none';
    } else {
        navElement.style.display = 'flex';
    }
    if (windowWidth <= 400) {
        logoImg.src = 'assets/logo_alt.png';
    } else {
        logoImg.src = 'assets/logo.png';
    }
}
async function checkEndpointConnection(endpoint, type) {
    try {
        const web3Mainnet = AlchemyWeb3.createAlchemyWeb3(endpoint);
        const isListening = await web3Mainnet.eth.net.isListening();

        if (isListening) {
            console.log(type, "endpoint is connected.");
            return true;
        } else {
            console.log(type, "endpoint is not connected.");
            return false;
        }
    } catch (error) {
        console.error('Error checking Alchemy endpoint connection:', error.message);
        return false;
    }
}

async function resolveENSName(ensName) {
    try {
        const web3Mainnet = AlchemyWeb3.createAlchemyWeb3(endpointMainnet);
        const resolvedAddress = await web3Mainnet.eth.ens.getAddress(ensName);
        console.log(`Resolved ENS ${ensName} to address: ${resolvedAddress}`);
        return resolvedAddress;
    } catch (error) {
        console.error(`Error resolving ENS ${ensName}:`, error);
        return null;
    }
}
async function resolveAddressToENS(address) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(endpointMainnet);
        const ensName = await provider.lookupAddress(address);

        if (ensName) {
            console.log(`Resolved address ${address} to ENS: ${ensName}`);
            return ensName;
        } else {
            console.log(`No ENS found for address: ${address}`);
            return null;
        }
    } catch (error) {
        console.error(`Error resolving address ${address} to ENS:`, error);
        return null;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    let arrows = [
        'ArrowUp', 'ArrowUp', 'ArrowDown',
        'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA', 'Enter'
    ];
    let currentPosition = 0;
    let timer;
    const CODE_TIMEOUT = 2000; // Time allowed between key presses in milliseconds

    document.addEventListener('keydown', (e) => {
        if (arrows[currentPosition] === e.code) {
            console.log("Correct key: " + e.code);
            currentPosition++;

            clearTimeout(timer);
            if (currentPosition === arrows.length) {
                console.log("Arrows entered...");
                const sections = document.querySelectorAll('section');
                sections.forEach(section => {
                  section.classList.toggle('flip');
                });
                currentPosition = 0; // Reset the position for the next attempt
            } else {
                timer = setTimeout(() => {
                    console.log("Timeout, try again.");
                    currentPosition = 0; // Reset the position due to timeout
                }, CODE_TIMEOUT);
            }
        } else {
            console.log("Incorrect key, try again.");
            currentPosition = 0; // Reset the position if the wrong key is pressed
        }
    });
});
async function getNativeCurrencyBalance() {
    const url = endpoint;
    const requestData = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [presaleAddress, "latest"],
        id: 1
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        const data = await response.json();
        if (data.result) {
            const balanceInWei = data.result;
            const balanceInEth = Web3.utils.fromWei(balanceInWei, 'ether');
            const balanceInEthNumber = parseFloat(balanceInEth); // Convert to number
            displayTotalContributions(balanceInEthNumber);
            displayPercentage(balanceInEthNumber);
        } else {
            console.error('Failed to fetch balance:', data);
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}
// #endregion Global Helper Functions