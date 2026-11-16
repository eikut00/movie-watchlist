
import "./style.css";

export const metadata = {
  title: "Movie Watchlist",
  description: "Discover movies and manage your personal watchlist."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
