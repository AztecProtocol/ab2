import React, { ReactElement } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { WalletProvider } from '../context/WalletContext';
import Home from '../pages/Home';
import Wallet from '../pages/Wallet';
import CreateAccount from '../pages/CreateAccount';
import SignIn from '../pages/SignIn';
import { act } from 'react';  // Changed to import from 'react' instead of 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom';

// Mock the Aztec.js functions
jest.mock('@aztec/aztec.js', () => ({
  createPXEClient: jest.fn(),
  Fr: { 
    random: jest.fn().mockReturnValue({
      toString: () => 'mocked-encryption-key'
    })
  },
  Fq: { 
    random: jest.fn().mockReturnValue({
      toString: () => 'mocked-signing-key'
    })
  },
}));

jest.mock('../aztec', () => ({
  createSchnorrAccount: jest.fn().mockImplementation(() => 
    new Promise(resolve => 
      setTimeout(() => resolve({
        address: 'mocked-address',
        encryptionSecretKey: 'mocked-encryption-key',
        signingSecretKey: 'mocked-signing-key',
      }), 100)
    )
  ),
  fetchAccount: jest.fn().mockResolvedValue({
    address: 'mocked-address',
    wallet: {}
  }),
}));

// Mock the verifyEmail function
jest.mock('../utils/emailVerification', () => ({
  verifyEmail: jest.fn().mockResolvedValue({
    isValid: true,
    proof: {},
    inputs: {
      header: {
        storage: Array(512).fill('0'),
        len: "100"
      },
      pubkey: {
        modulus: Array(18).fill('0'),
        redc: Array(18).fill('0')
      },
      signature: Array(18).fill('0')
    }
  })
}));

// Mock file content
const mockFileContent = `From: test@example.com
Subject: TestCode123
Content-Type: text/plain

Test email content`;

// Mock createHash
jest.mock('crypto', () => ({
  createHash: () => ({
    update: () => ({
      digest: () => 'mocked-hash'
    })
  })
}));

const renderWithRouter = (ui: ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
};

describe('SignIn Component', () => {
  const renderSignIn = () => {
    return render(
      <BrowserRouter>
        <WalletProvider>
          <SignIn />
        </WalletProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Simplified FileReader mock
    const mockFileReader = function(this: any) {
      this.DONE = 2;
      this.EMPTY = 0;
      this.LOADING = 1;
      this.readyState = 0;
      this.error = null;
      this.result = null;
      this.onabort = null;
      this.onerror = null;
      this.onload = null;
      this.onloadend = null;
      this.onloadstart = null;
      this.onprogress = null;

      this.readAsText = function(blob: Blob) {
        const reader = this;
        setTimeout(() => {
          reader.readyState = reader.DONE;
          reader.result = mockFileContent;
          if (reader.onload) {
            const event = new ProgressEvent('load');
            Object.defineProperty(event, 'target', { value: reader });
            reader.onload(event);
          }
        }, 0);
      };

      this.abort = function() {};
      this.addEventListener = function() {};
      this.removeEventListener = function() {};
      this.dispatchEvent = function() { return true; };
    };

    global.FileReader = mockFileReader as any;
  });

  test('renders sign in form', () => {
    renderSignIn();
    expect(screen.getByLabelText(/enter email id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enter your password/i)).toBeInTheDocument();
  });

  test('handles file upload', async () => {
    renderSignIn();
    
    const file = new File([mockFileContent], 'test.eml', { type: 'message/rfc822' });
    const fileInput = screen.getByLabelText(/email verification file/i);
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/✓ File loaded: test.eml/i)).toBeInTheDocument();
    });
  });
});