import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { defaultTheme, themesOptions } from "./style/theme";
import { GlobalStyles } from "./style/global";
import TypeBox from "./components/features/TypeBox/TypeBox";
import Logo from "./components/common/Logo";
import MusicPlayerSnackbar from "./components/features/MusicPlayer/MusicPlayerSnackbar";
import FooterMenu from "./components/common/FooterMenu";
import FreeTypingBox from "./components/features/FreeTypingBox";

function App() {
  // localStorage persist theme setting
  const [theme, setTheme] = useState(() => {
    const stickyTheme = window.localStorage.getItem("theme");
    if (stickyTheme !== null) {
      const localTheme = JSON.parse(stickyTheme);
      const upstreamTheme = themesOptions.find(
        (e) => e.label === localTheme.label
      ).value;
      // we will do a deep equal here. In case we want to support customized local theme.
      const isDeepEqual = localTheme === upstreamTheme;
      return isDeepEqual ? localTheme : upstreamTheme;
    }
    return defaultTheme;
  });

  // localStorage persist focusedMode setting
  const [isFocusedMode, setIsFocusedMode] = useState(
    localStorage.getItem("focused-mode") === "true"
  );

  // musicMode setting
  const [isMusicMode, setIsMusicMode] = useState(false);

  // coffeeMode setting
  const [isCoffeeMode, setIsCoffeeMode] = useState(false);

  const handleThemeChange = (e) => {
    window.localStorage.setItem("theme", JSON.stringify(e.value));
    setTheme(e.value);
  };

  const toggleFocusedMode = () => {
    setIsFocusedMode(!isFocusedMode);
  };

  const toggleMusicMode = () => {
    setIsMusicMode(!isMusicMode);
  };

  const toggleCoffeeMode = () => {
    setIsCoffeeMode(!isCoffeeMode);
  };

  useEffect(() => {
    localStorage.setItem("focused-mode", isFocusedMode);
  }, [isFocusedMode]);

  const textInputRef = useRef(null);
  const focusTextInput = () => {
    textInputRef.current && textInputRef.current.focus();
  };

  const textAreaRef = useRef(null);
  const focusTextArea = () => {
    textAreaRef.current && textAreaRef.current.focus();
  };
  useEffect(() => {
    if(!isCoffeeMode){
      focusTextInput();
      return;
    }
    if (isCoffeeMode){
      focusTextArea();
      return;
    }
    return;
  }, [theme, isFocusedMode, isMusicMode, isCoffeeMode]);

  return (
    <ThemeProvider theme={theme}>
      <>
        <div className="canvas">
          <GlobalStyles />
          <Logo isFocusedMode={isFocusedMode} isMusicMode={isMusicMode}></Logo>
          {!isCoffeeMode && (
            <TypeBox
              textInputRef={textInputRef}
              isFocusedMode={isFocusedMode}
              key="type-box"
              handleInputFocus={() => focusTextInput()}
            ></TypeBox>
          )}
          {
            isCoffeeMode && (
              <FreeTypingBox
              textAreaRef={textAreaRef}
            />
            )
          }
          <FooterMenu
            themesOptions={themesOptions}
            theme={theme}
            handleThemeChange={handleThemeChange}
            toggleFocusedMode={toggleFocusedMode}
            toggleMusicMode={toggleMusicMode}
            toggleCoffeeMode={toggleCoffeeMode}
            isCoffeeMode={isCoffeeMode}
            isMusicMode={isMusicMode}
            isFocusedMode={isFocusedMode}
          ></FooterMenu>
          <MusicPlayerSnackbar
            isMusicMode={isMusicMode}
            isFocusedMode={isFocusedMode}
            onMouseLeave={() => focusTextInput()}
          ></MusicPlayerSnackbar>
        </div>
      </>
    </ThemeProvider>
  );
}

export default App;
