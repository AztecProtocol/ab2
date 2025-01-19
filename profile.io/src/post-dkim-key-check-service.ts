import { promises as dns } from 'dns';
import { simpleParser } from 'mailparser';
// @ts-ignore
import { authenticate } from 'mailauth';
import { createVerify, createPublicKey } from 'crypto';

export class PostDkimKeyCheckService {
  constructor(
  ) {}
  
  async dkimKeyCheck(body: any): Promise<any>{

    const {
      emailContent
    } = body;
    
    // Parse the raw email content
    const parsedEmail = await simpleParser(emailContent);

    // Extract the "From" address
    const fromEmailAddress = parsedEmail.from?.value[0].address || '';

    const { dkim } = await authenticate(emailContent);
    let isFromEmailAddressValid = false;
    const dkimPass = dkim.results.filter((result: { status: { result: string; aligned: string; }; }) => {
      if(result.status.result === 'pass' && fromEmailAddress!==''){
        // Split the email by the '@' symbol and return the part after it
        const parts = fromEmailAddress.split('@');
        const emailDomain = parts[1];
        // compare the from email address domain is valid
        if(emailDomain==result.status.aligned){
          isFromEmailAddressValid = true;
        }
        return result;
      }
    });
    
    return {success: true, fromEmailAddress, isFromEmailAddressValid, dkimPass};
  }

  // Extract DKIM signature from the parsed email
  private extractDkimSignature(parsedEmail: { headers: { get: (arg0: string) => any; }; }) {
    let dkimSignature = parsedEmail.headers.get('dkim-signature');
    let isDkimSignatureValid = false;

    if (dkimSignature) {
      isDkimSignatureValid = true;
    } else {
      dkimSignature = parsedEmail.headers.get('x-google-dkim-signature');

      // check if dkim is come from Google
      if (dkimSignature) {
        isDkimSignatureValid = true;
      }
    }
    return isDkimSignatureValid ? dkimSignature : null;
  }

  // Retrieve DKIM details including the public key
  private async getDkimDetails(dkimSignature: string): Promise<any> {
    const match = dkimSignature.match(/d=([^;]+);.*s=([^;]+)/) || null;
    if (!match) {
      const errorMessages = `Invalid DKIM signature format.`;
      throw errorMessages;
    }

    const domain = match[1];
    const selector = match[2];
    const publicKey = await this.getDkimPublicKey(domain, selector);

    if(publicKey["success"]==false){
      return publicKey;
    }

    return { domain, selector, publicKey };
  }

  // Fetch DKIM public key from DNS
  private async getDkimPublicKey(domain: string, selector: string): Promise<any> {
    const dkimDomain = `${selector}._domainkey.${domain}`;
    const txtRecords = await dns.resolveTxt(`${dkimDomain}`);

    if(!txtRecords){
      const errorMessages = `Error fetching DKIM public key.`;
      throw errorMessages;
    }

    const publicKeyRecordArray = txtRecords.find(record => record[0].startsWith('v=DKIM1'));
    const publicKeyRecord = publicKeyRecordArray?.join('');
    
    if (publicKeyRecord) {
      const publicKey = publicKeyRecord?.match(/p=([A-Za-z0-9+/=]+)/)?.[1];
      // Split the key into lines of 64 characters each
      
      let formattedKey = '';
      if(publicKey){
        const publicKeyMatch = publicKey.match(/.{1,64}/g);
        if(publicKeyMatch){
          formattedKey = publicKeyMatch.join('\n');
        }
      }

      if (formattedKey) {
        return publicKey;
      } else {
        const errorMessages = `No public key found in DKIM DNS record.`;
        throw errorMessages;
      }
    } else {
      const errorMessages = `No DKIM record found.`;
      throw errorMessages;
    }
  }
  
  // Verify the DKIM signature using the public key
  private async verifySignature(rawEmail: string, publicKey: string, dkimSignature: string): Promise<boolean> {
    // Query domain key TXT records from the domain DNS
    const dkimJson: Record<string, string> = {};
    const parts = dkimSignature.split(';').map(part => part.trim()).filter(Boolean);
    parts.forEach(part => {
      const [key, value] = part.split('=');
      if (key && value) {
        dkimJson[key] = value;
      }
    });
    
    const verifier = createVerify('RSA-SHA256');
    verifier.update(rawEmail);
    const key = createPublicKey({
      key: `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
      format: 'pem',
      type: 'spki',
    });
    
    const signature = this.extractSignature(dkimSignature);
    if(signature["success"]==false){
      return signature;
    }
    
    return verifier.verify(key, signature, 'base64');
  }

  // Extract the actual signature from the DKIM signature
  private extractSignature(dkimSignature: string): any {
    const match = dkimSignature.match(/b=([^;]+)/) || null;
    if (!match) {
      const errorMessages = `No valid signature found in DKIM signature.`;
      throw errorMessages;
    }
    
    return match[1];
  }

  private dkimObjectToString(dkimObject: { [x: string]: any; }) {
    // return Object.entries(dkimObject)
    //   .map(([key, value]) => `${key}=${value}`)
    //   .join('; ');

    const keys = ['a', 'c', 'd', 's', 'h', 'bh', 'b'];  // Order of keys
    return keys.map(key => `${key}=${dkimObject[key]}`).join('; ');
  }
}
