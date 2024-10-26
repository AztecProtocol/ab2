import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji } from './utils.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Add session and JSON support
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Store user verification states and NFT data
const verifiedUsers = new Map();
const pendingVerifications = new Map();
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'verify') {
      const userId = req.body.member?.user.id || req.body.user.id;

      // Check if user is already verified
      if (verifiedUsers.has(userId)) {
        const userData = verifiedUsers.get(userId);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `You are already verified! Wallet: ${userData.wallet}\nNFTs: ${userData.nfts.join(', ')}`,
            flags: 64
          },
        });
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Store pending verification
      pendingVerifications.set(verificationToken, {
        userId,
        timestamp: Date.now()
      });

      const verifyUrl = `${process.env.BASE_URL}/verify/${verificationToken}`;


      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Please verify your wallet ${getRandomEmoji()}`,
          components: [{
            type: 1,
            components: [{
              type: 2,
              style: 5,
              label: "Connect Wallet",
              url: verifyUrl
            }]
          }],
          flags: 64
        },
      });
    }

    // Add a new command to check NFTs
    if (name === 'nfts') {
      const userId = req.body.member?.user.id || req.body.user.id;

      if (!verifiedUsers.has(userId)) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "You need to verify your wallet first! Use /verify to get started.",
            flags: 64
          },
        });
      }

      const userData = verifiedUsers.get(userId);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Your NFTs:\n${userData.nfts.map(nft => `• ${nft}`).join('\n')}`,
          flags: 64
        },
      });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }
});

// Serve verification page
app.get('/verify/:token', (req, res) => {
  const { token } = req.params;
  const verification = pendingVerifications.get(token);

  if (!verification) {
    return res.status(400).send('Invalid or expired verification token');
  }

  // Store token in session
  req.session.verificationToken = token;

  res.send(`
    <html>
      <head>
        <title>Wallet Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
          }
          button {
            background-color: #5865F2;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 1rem;
          }
          button:hover {
            background-color: #4752C4;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Connect Your Wallet</h1>
          <p>Please connect your wallet to verify your NFTs</p>
          <button onclick="connectWallet()">Connect Wallet</button>
        </div>
        
        <script>
          async function connectWallet() {
            if (typeof window.ethereum !== 'undefined') {
              try {
                // Request account access
                const accounts = await window.ethereum.request({ 
                  method: 'eth_requestAccounts' 
                });
                
                // Get NFTs for this wallet (replace with actual NFT fetching logic)
                const response = await fetch('/verify-wallet', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ 
                    address: accounts[0]
                  })
                });
                
                if (response.ok) {
                  alert('Verification successful! You can now close this window and return to Discord.');
                } else {
                  const error = await response.json();
                  alert(error.error || 'Verification failed. Please try again.');
                }
              } catch (error) {
                console.error(error);
                alert('Failed to connect wallet. Please try again.');
              }
            } else {
              alert('Please install MetaMask to continue!');
            }
          }
        </script>
      </body>
    </html>
  `);
});

// Handle wallet verification
app.post('/verify-wallet', async (req, res) => {
  const token = req.session.verificationToken;
  const verification = pendingVerifications.get(token);
  const { address } = req.body;

  if (!verification) {
    return res.status(400).json({ error: 'Invalid verification session' });
  }

  try {
    // Fetch NFTs for this wallet (replace with actual API call)
    const nfts = await fetchNFTs(address);

    // Store verification data
    verifiedUsers.set(verification.userId, {
      wallet: address,
      nfts: nfts,
      verifiedAt: new Date()
    });

    // Assign verified role in Discord
    await assignVerifiedRole(verification.userId);

    // Clean up verification state
    pendingVerifications.delete(token);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
});

// Function to fetch NFTs (replace with actual implementation)
async function fetchNFTs(address) {
  // Example: Fetch NFTs from OpenSea or other NFT API
  // For now, returning mock data
  return [
    'CryptoPunk #1234',
    'Bored Ape #5678',
    'Doodle #9012'
  ];
}

// Function to assign verified role
async function assignVerifiedRole(userId) {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${userId}/roles/${process.env.VERIFIED_ROLE_ID}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to assign role');
    }
  } catch (error) {
    console.error('Failed to assign role:', error);
    throw error;
  }
}

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});