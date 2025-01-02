import React, { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

export const usePopup = () => {
  return useContext(PopupContext);
};

export const PopupProvider = ({ children }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);
  const closePopup = () => setIsPopupVisible(false);

  return (
    <PopupContext.Provider value={{ isPopupVisible, togglePopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
};
