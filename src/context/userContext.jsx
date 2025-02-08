import { createContext, useState } from "react";

const UserContext = createContext();

export function UserProvider ({ children }) {
    const [userInfo, setUserInfo] = useState(null)
    const [roleName, setRoleName] = useState(null)
    const [roleList, setRoleList] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    
    const role = roleList?.find(
        (data) => data?.id === userInfo?.roleIdList[0]
    )

    const userProfile = {
        userId: userInfo?.userId,
        userName: userInfo?.username,
        roleName: role?.name
    }
    console.log('this is role', roleList)
    return(
        <UserContext.Provider
            value={{
                userInfo,
                setUserInfo,
                roleList,
                setRoleList,
                roleName,
                setRoleName,
                isLoading,
                setIsLoading
            }}>
                {children}
            </UserContext.Provider>
    )
}


export default UserContext