import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [activeDays, setActiveDays] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async () => {
    const { error } = await supabase.from("settings").insert([
      {
        active_days: activeDays,
        time_options: timeOptions,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error saving settings:", error);
    }
  };

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error loading settings:", error);
    } else if (data.length > 0) {
      setActiveDays(data[0].active_days);
      setTimeOptions(data[0].time_options);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        activeDays,
        setActiveDays,
        timeOptions,
        setTimeOptions,
        saveSettings,
        loadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
