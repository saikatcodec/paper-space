import { Link } from "react-router-dom";

const NotFound = () => {
  // Set page title for 404 page
  useEffect(() => {
    document.title = "404 | Page Not Found | PaperSpace";
  }, []);

  return (
    <div
      className="not-found-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <h1 style={{ fontSize: "72px", marginBottom: "0" }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <div style={{ marginTop: "20px" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Return to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
