"use client";
import { MenuItem, TextField } from "@mui/material";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { DarkMode, DisplaySettings } from "@mui/icons-material";

function ThemeButton() {
  const { setTheme, theme, themes } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents rendering mismatches during hydration

  return (
    <div className="w-[150px]">
      {/* <pre>{JSON.stringify(themes, null, 2)}</pre> */}
      <TextField
        className="dark:bg-white bg-gray-800 rounded"
        value={theme}
        select
        fullWidth
        onChange={(event) => {
          setTheme(event.target.value);
        }}
        size="small">
        {themes.map((option) => (
          <MenuItem
            className="flex gap-3"
            key={option}
            onClick={() => setTheme(option)}
            value={option}>
            {option === "light" ? (
              <WbSunnyIcon className="text-yellow-300" />
            ) : option === "dark" ? (
              <DarkMode />
            ) : (
              <DisplaySettings className="text-gray-400" />
            )}{" "}
            {option}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

export default ThemeButton;
