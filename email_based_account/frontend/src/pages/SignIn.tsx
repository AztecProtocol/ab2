import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAccount } from '../aztec';
import { useWallet } from '../context/WalletContext';
import { createHash } from 'crypto';
import { verifyEmail } from '../utils/emailVerification';

// Function to hash a string
const stringToHash = (inputString: string): string => {
  return createHash('sha256').update(inputString).digest('hex');
};

// Function to generate random alphanumeric string
const generateVerificationCode = (length: number = 6): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Function to extract email from .eml content
const extractEmailFromEml = (emlContent: string): { fromEmail: string; subject: string } | null => {
  try {
    // Look for 'from:' line specifically
    const fromLine = emlContent.split('\n').find(line => line.toLowerCase().startsWith('from:'));
    const subjectLine = emlContent.split('\n').find(line => line.toLowerCase().startsWith('subject:'));

    if (!fromLine) {
      throw new Error("Could not find 'From' field in email");
    }
    if (!subjectLine) {
      throw new Error("Could not find 'Subject' field in email");
    }

    // Extract email from the 'from:' line
    const fromEmail = fromLine.split(':')[1].trim();
    // Extract subject from the 'subject:' line
    const subject = subjectLine.split(':')[1].trim();

    console.log('Extracted From email:', fromEmail);
    console.log('Extracted Subject:', subject);

    return {
      fromEmail,
      subject
    };
  } catch (error) {
    console.error('Error parsing .eml content:', error);
    return null;
  }
};

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emlContent, setEmlContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setWalletInfo } = useWallet();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    proof?: any;
    inputs?: {
      header: { storage: any[]; len: string };
      pubkey: { modulus: string[]; redc: string[] };
      signature: string[];
    };
  } | null>(null);
  const [emlFile, setEmlFile] = useState<File | null>(null);

  // Generate verification code when email and password are entered
  useEffect(() => {
    if (email && password) {
      setVerificationCode(generateVerificationCode());
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      if (!emlContent) {
        throw new Error('Please provide the email verification content.');
      }

      // First verify email ownership using ZK proof
      const verification = await verifyEmail(emlContent);
      setVerificationResult(verification);

      if (!verification.isValid) {
        throw new Error('Email verification failed. The email content might be tampered.');
      }

      // Continue with existing email parsing and verification
      const emailData = extractEmailFromEml(emlContent);
      if (!emailData) {
        throw new Error('Could not parse email content. Please ensure you provided a valid .eml file content.');
      }

      if (emailData.fromEmail.toLowerCase() !== email.toLowerCase()) {
        throw new Error('The email address in the verification email does not match the entered email.');
      }

      if (!emailData.subject.includes(verificationCode)) {
        throw new Error('Could not find verification code in email subject.');
      }

      const emailDerivedEncryptionKey = stringToHash(email + password);
      const passwordDerivedSigningKey = stringToHash(password);

      const accountInfo = await fetchAccount(emailDerivedEncryptionKey, passwordDerivedSigningKey);
      console.log('Account fetched:', accountInfo);

      setWalletInfo({
        address: accountInfo.address,
        balance: '0',
        transactions: [],
        encryptionSecretKey: emailDerivedEncryptionKey,
        signingSecretKey: passwordDerivedSigningKey,
      });

      navigate('/wallet');
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setEmlContent(content);
          setEmlFile(file);
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('Error reading file:', error);
        setError('Failed to read the email file. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Verify email ownership and Sign In
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Enter email ID
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your email address"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Enter your Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your password"
              required
            />
          </div>

          {email && password && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                To verify your email ownership, please:
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                <li>Send an email to rajesh@ragya.com</li>
                <li>Include this code in the subject: <span className="font-mono font-bold">{verificationCode}</span></li>
                <li>Download the sent email as .eml file</li>
                <li>Upload the .eml file below</li>
              </ol>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="emlFile" className="block text-gray-700 text-sm font-bold mb-2">
              Email Verification File (.eml)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-700 rounded-lg shadow-lg tracking-wide border border-gray-300 cursor-pointer hover:bg-gray-50">
                <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-sm">
                  {emlFile ? emlFile.name : 'Select .eml file'}
                </span>
                <input
                  type="file"
                  id="emlFile"
                  accept=".eml"
                  className="hidden"
                  onChange={handleFileUpload}
                  required
                />
              </label>
            </div>
            {emlFile && (
              <p className="mt-2 text-sm text-green-600">
                ✓ File loaded: {emlFile.name}
              </p>
            )}
          </div>

          {isVerifying && (
            <div className="mb-4 text-center">
              <p className="text-gray-700">Verifying email ownership...</p>
            </div>
          )}

          {verificationResult && (
            <div className={`mb-4 p-4 rounded-lg ${verificationResult.isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <p>
                Email verification: {verificationResult.isValid ? 'Valid ✓' : 'Invalid ✗'}
              </p>
            </div>
          )}

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          
          <button
            type="submit"
            disabled={isVerifying}
            className={`w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out ${
              isVerifying ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isVerifying ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Make sure this line is exactly as shown:
export default SignIn;