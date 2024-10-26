import { useQuery } from '@tanstack/react-query';
import { useGoogleAuth } from '@zk-email/zk-email-sdk';

import {
  type WithBodyParams,
  type WithToParams,
  extractXUsername,
  generateInputs,
  getBiometricModule,
  getEmail,
  getGitHubModule,
  getGoogleModule,
  getLinkedinModule,
  getPassport,
  getXModule,
} from '../helpers';
import { useAztecAccount } from './use-aztec-account';

export const usePassport = () => {
  const { wallet, getWallet } = useAztecAccount();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- safe
  const { googleAuthToken, loggedInGmail } = useGoogleAuth();

  const {
    data: passportScore,
    refetch: refetchPassportScore,
    isLoading: isPassportScoreLoading,
  } = useQuery({
    queryKey: ['passport-score', wallet?.getAddress().toString()],
    queryFn: async () => {
      const score = await getPassportScore();
      return score;
    },
    enabled: Boolean(wallet),
    initialData: 0,
  });

  const getPassportScore = async () => {
    const w = await getWallet();
    const passport = await getPassport(w);
    const score = (await passport.methods
      .get_total_score(w.getCompleteAddress())
      .simulate()) as bigint;

    console.log('Passport Score:', score);

    const formatted = Number(score) / 10 ** 6;
    return formatted;
  };

  const verifyGithub = async () => {
    if (!googleAuthToken) {
      throw new Error('Log in with Google to access Emails.');
    }
    const w = await getWallet();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
    const accessToken = googleAuthToken?.access_token as string;
    const emailContent = await getEmail(accessToken, 'github');
    const i = (await generateInputs(
      w.getAddress().toString(),
      emailContent,
      'github',
      loggedInGmail ?? ''
    )) as WithToParams;

    const githubModule = await getGitHubModule(w);
    const tx = await githubModule
      .withWallet(w)
      .methods.verify(
        i.address,
        i.header_array,
        i.header_length,
        i.pubkey_modulus,
        i.pubkey_redc,
        i.signature,
        i.from_header_sequence_index,
        i.from_header_sequence_length,
        i.from_address_sequence_index,
        i.from_address_sequence_length,
        i.to_header_sequence_index,
        i.to_header_sequence_length,
        i.to_address_sequence_index,
        i.to_address_sequence_length,
        i.email_array
      )
      .send()
      .wait();

    await refetchPassportScore();

    return tx;
  };

  const verifyGoogle = async () => {
    if (!googleAuthToken) {
      throw new Error('Log in with Google to access Emails.');
    }
    const w = await getWallet();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
    const accessToken = googleAuthToken?.access_token as string;
    const emailContent = await getEmail(accessToken, 'google');
    const i = (await generateInputs(
      w.getAddress().toString(),
      emailContent,
      'google',
      loggedInGmail ?? ''
    )) as WithToParams;

    const module = await getGoogleModule(w);
    const tx = await module
      .withWallet(w)
      .methods.verify(
        i.address,
        i.header_array,
        i.header_length,
        i.pubkey_modulus,
        i.pubkey_redc,
        i.signature,
        i.from_header_sequence_index,
        i.from_header_sequence_length,
        i.from_address_sequence_index,
        i.from_address_sequence_length,
        i.to_header_sequence_index,
        i.to_header_sequence_length,
        i.to_address_sequence_index,
        i.to_address_sequence_length,
        i.email_array
      )
      .send()
      .wait();

    await refetchPassportScore();

    return tx;
  };

  const verifyLinkedin = async () => {
    if (!googleAuthToken) {
      throw new Error('Log in with Google to access Emails.');
    }
    const w = await getWallet();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
    const accessToken = googleAuthToken?.access_token as string;
    const emailContent = await getEmail(accessToken, 'linkedin');
    const i = (await generateInputs(
      w.getAddress().toString(),
      emailContent,
      'linkedin',
      loggedInGmail ?? ''
    )) as WithToParams;

    const module = await getLinkedinModule(w);
    const tx = await module
      .withWallet(w)
      .methods.verify(
        i.address,
        i.header_array,
        i.header_length,
        i.pubkey_modulus,
        i.pubkey_redc,
        i.signature,
        i.from_header_sequence_index,
        i.from_header_sequence_length,
        i.from_address_sequence_index,
        i.from_address_sequence_length,
        i.to_header_sequence_index,
        i.to_header_sequence_length,
        i.to_address_sequence_index,
        i.to_address_sequence_length,
        i.email_array
      )
      .send()
      .wait();

    await refetchPassportScore();

    return tx;
  };

  const verifyTwitter = async () => {
    if (!googleAuthToken) {
      throw new Error('Log in with Google to access Emails.');
    }
    const w = await getWallet();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
    const accessToken = googleAuthToken?.access_token as string;
    const emailContent = await getEmail(accessToken, 'x');
    const username = extractXUsername(emailContent);

    const i = (await generateInputs(
      w.getAddress().toString(),
      emailContent,
      'x',
      username
    )) as WithBodyParams;

    const module = await getXModule(w);
    const tx = await module
      .withWallet(w)
      .methods.verify(
        i.address,
        i.header_array,
        i.header_length,
        i.body_array,
        i.body_length,
        i.pubkey_modulus,
        i.pubkey_redc,
        i.signature,
        i.body_hash_index,
        i.dkim_header_sequence_index,
        i.dkim_header_sequence_length,
        i.from_header_sequence_index,
        i.from_header_sequence_length,
        i.from_address_sequence_index,
        i.from_address_sequence_length,
        i.username,
        BigInt(username.length)
      )
      .send()
      .wait();

    await refetchPassportScore();

    return tx;
  };

  const verifyBiometric = async (actual: number[], expected: number[]) => {
    const w = await getWallet();

    const module = await getBiometricModule(w);
    const tx = await module
      .withWallet(w)
      .methods.verify(w.getAddress(), actual, expected)
      .send()
      .wait();

    await refetchPassportScore();

    return tx;
  };

  return {
    passportScore,
    refetchPassportScore,
    isPassportScoreLoading,
    getPassportScore,
    verifyGithub,
    verifyGoogle,
    verifyLinkedin,
    verifyTwitter,
    verifyBiometric,
  };
};
