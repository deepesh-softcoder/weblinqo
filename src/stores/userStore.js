import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default structure for user profile
const initialProfile = {
  slug: '',
  title: '',
  bio: '',
  profileImage: '',
  qrId:'',
  links: [],
  template: {
    id: null,
    background: '',
    textColor: '',
    buttonColor: '',
    buttonTextColor: '',
    buttonStyle: '',
    accessLevel: 'FREE',
    isCustom: false,
  },
};

// Default structure for digital card profile
const initialDcProfile = {
  avatar: '',
  name: '',
  designation: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  socials: {},
};

// Default structure for subscription details
const initialSubscription = {
  planName: '',
  status: '',
  planId: '',
  isActive: false,
  expiresAt: null,
  features: {},
};

// Default structure for module states (checks for features)
const initialModuleStates = {
  digitalCardExists: null,
  linkInBioExists: null,
  isCheckingDigitalCard: false,
  isCheckingLinkInBio: false,
};

const useUserStore = create(
  persist(
    (set) => ({
      userProfile: initialProfile,
      userDcProfile: initialDcProfile,
      subscription: initialSubscription,
      moduleStates: initialModuleStates,
      accessToken: '',
      refreshToken: '',
      isAuthenticated: false,
      theme: 'light',
      selectedPlanId: '',
      selectedTemplate: '',
      refreshTokenExpiry: null,
      accessTokenExpiry: null,

      // Actions
      setUserProfile: (updates) =>
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...updates,
          },
        })),
      setUserDcProfile: (updates) =>
        set((state) => ({
          userDcProfile: {
            ...state.userDcProfile,
            ...updates,
          },
        })),

      updateNested: (path, value) =>
        set((state) => {
          const keys = path.split('.');
          const newProfile = structuredClone
            ? structuredClone(state.userProfile)
            : JSON.parse(JSON.stringify(state.userProfile));

          let current = newProfile;
          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) current[key] = {};
            current[key] = { ...current[key] };
            current = current[key];
          }
          current[keys[keys.length - 1]] = value;

          return { userProfile: newProfile };
        }),

        updateDcNested: (path, value) =>
        set((state) => {
          const keys = path.split('.');
          const newProfile = structuredClone
            ? structuredClone(state.userDcProfile)
            : JSON.parse(JSON.stringify(state.userDcProfile));

          let current = newProfile;
          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) current[key] = {};
            current[key] = { ...current[key] };
            current = current[key];
          }
          current[keys[keys.length - 1]] = value;

          return { userDcProfile: newProfile };
        }),

      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setTheme: (theme) => set({ theme }),

      setSelectedPlanId: (planId) => set({ selectedPlanId: planId }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      setRefreshTokenExpiry: (expiry) => set({ refreshTokenExpiry: expiry }),
      setAccessTokenExpiry: (expiry) => set({ accessTokenExpiry: expiry }),

      // Subscription actions
      setSubscription: (subscriptionData) =>
        set((state) => ({
          subscription: {
            ...state.subscription,
            ...subscriptionData,
            isActive: subscriptionData?.status === 'ACTIVE',
          },
        })),
      
      updateSubscription: (updates) =>
        set((state) => ({
          subscription: {
            ...state.subscription,
            ...updates,
            isActive: updates?.status === 'ACTIVE' || state.subscription.isActive,
          },
        })),
      
      clearSubscription: () => set({ subscription: initialSubscription }),
      
      // Module states actions
      setDigitalCardExists: (exists) =>
        set((state) => ({
          moduleStates: {
            ...state.moduleStates,
            digitalCardExists: exists,
            isCheckingDigitalCard: false,
          },
        })),
      
      setLinkInBioExists: (exists) =>
        set((state) => ({
          moduleStates: {
            ...state.moduleStates,
            linkInBioExists: exists,
            isCheckingLinkInBio: false,
          },
        })),
      
      setCheckingDigitalCard: (isChecking) =>
        set((state) => ({
          moduleStates: {
            ...state.moduleStates,
            isCheckingDigitalCard: isChecking,
          },
        })),
      
      setCheckingLinkInBio: (isChecking) =>
        set((state) => ({
          moduleStates: {
            ...state.moduleStates,
            isCheckingLinkInBio: isChecking,
          },
        })),
      
      resetModuleStates: () => set({ moduleStates: initialModuleStates }),
      
      // reset all store data
      resetAll: () =>
        set({
          userProfile: initialProfile,
          userDcProfile: initialDcProfile,
          subscription: initialSubscription,
          moduleStates: initialModuleStates,
          accessToken: '',
          refreshToken: '',
          isAuthenticated: false,
          theme: 'light',
          selectedPlanId: '',
          selectedTemplate: '',
          refreshTokenExpiry: null,
          accessTokenExpiry: null,
        }),
    }),
    {
      name: 'data',
      // Persist only selected parts of the store
      partialize: (state) => ({
        userProfile: state.userProfile,
        userDcProfile: state.userDcProfile,
        subscription: state.subscription,
        moduleStates: state.moduleStates,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        selectedPlanId: state.selectedPlanId,
        selectedTemplate: state.selectedTemplate,
        refreshTokenExpiry: state.refreshTokenExpiry,
        accessTokenExpiry: state.accessTokenExpiry,
      }),
    }
  )
);

export default useUserStore;

export const getAccessToken = () => useUserStore.getState().accessToken;
