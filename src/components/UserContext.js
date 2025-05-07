import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState( null ); // null or { userType: "", userName: "" }

  // console.log(JSON.parse(localStorage.getItem('udata')))

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const udata = localStorage.getItem('udata');
    // console.log(JSON.parse(udata));
    if(userType && udata) {
      setUserInfo({userType: JSON.parse(userType), udata: JSON.parse(udata)});
    }
  },[])

  const login = (data) => {
    setUserInfo(data); // e.g., { userType: "user", userName: "Bala" }
  };

  // console.log(userInfo)

  const logout = () => {
    setUserInfo(null);
    localStorage.clear();
  };
  

  return (
    <UserContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
