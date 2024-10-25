import { useQuery } from '@tanstack/react-query';

import { getPassport } from '../helpers';
import { useAztecAccount } from './use-aztec-account';

export const usePassport = () => {
  const { wallet, getWallet } = useAztecAccount();

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
  });

  const getPassportScore = async () => {
    const w = await getWallet();
    const passport = await getPassport(w);
    const score = (await passport.methods
      .get_total_score(w.getCompleteAddress())
      .simulate()) as bigint;

    const formatted = Number(score) / 10 ** 6;
    return formatted;
  };

  return {
    passportScore,
    refetchPassportScore,
    isPassportScoreLoading,
    getPassportScore,
  };
};
