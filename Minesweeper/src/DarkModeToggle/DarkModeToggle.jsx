import { useEffect, useState } from "react";
import Switch from "react-switch";
import styles from './DarkModeToggle.module.css';

export const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        const dark = localStorage.getItem("dark");
        return dark === "true" ? true : false;
    });
  
    useEffect(() => {
        const body = document.body;
        if (isDark) {
            body.classList.add("dark");
        } else {
            body.classList.remove("dark");
        }
        localStorage.setItem("dark", isDark);
    }, [isDark]);
  
    return (
        <Switch 
            className={styles.toggle}
            onChange={(checked) => setIsDark(checked)} 
            checked={isDark} 
            uncheckedHandleIcon={<div className={styles.icon}>🔆</div>} 
            checkedHandleIcon={<div className={styles.icon}>🌙</div>}
            checkedIcon={<div></div>}
            uncheckedIcon={<div></div>}
            offHandleColor="#fafafa"
            onHandleColor="#1f2023"
            onColor="#888888"
        />
    );
  };
  