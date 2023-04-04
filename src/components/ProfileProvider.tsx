import React, { createContext, useState } from 'react';

interface ProfileContextType {
    profile: any | null;
    setProfile: React.Dispatch<React.SetStateAction<any | null>>;
}

export const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    setProfile: () => {},
});

function ProfileProvider({ children }:{children: React.ReactNode}) {
    const [profile, setProfile] = useState<any | null>(null);

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}
export {ProfileProvider};
