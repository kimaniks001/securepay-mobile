export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ksNumber?: string;
};

export type AuthSession = {
  token: string;
  user: UserProfile;
  expiresAt: string;
};
