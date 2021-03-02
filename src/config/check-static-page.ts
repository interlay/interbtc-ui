
// Set to true to show only the static landing page
const checkStaticPage = () => {
  if (process.env.REACT_APP_STATIC_PAGE_ONLY !== undefined) {
    if (process.env.REACT_APP_STATIC_PAGE_ONLY === 'true') {
      return true;
    }
  }
  return false;
};

export default checkStaticPage;
