
import React from 'react';

export type AuthProviderValue = {
  user?: { [key: string]: any };
  setUser?: any;
  clinicLogo?: any;
  profilePhoto?: any;
  setClinicLogo?: React.Dispatch<React.SetStateAction<any>>;
  setProfilePhoto?: React.Dispatch<React.SetStateAction<any>>;
  i18NextLang?: string;
  setI18NextLang?: (lang: string) => void;
  client?: any;
};
const AuthContext = React.createContext<AuthProviderValue>({
  user: {},
  setUser: () => {},
  clinicLogo: '',
  profilePhoto: '',
  setClinicLogo: () => {},
  setProfilePhoto: () => {},
  i18NextLang: '',
  setI18NextLang: () => {},
  client: null,
});

export const useAuth = (): AuthProviderValue => React.useContext<AuthProviderValue>(AuthContext);

export default AuthContext;
