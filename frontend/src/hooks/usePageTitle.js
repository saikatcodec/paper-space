import { useEffect } from "react";

/**
 * Custom hook to set the page title
 * @param {string} title - The page title to set
 */
export const usePageTitle = (title) => {
  useEffect(() => {
    // Set new title
    document.title = `${title} | PaperSpace`;

    // No need to restore previous title as each page will set its own
  }, [title]);
};
