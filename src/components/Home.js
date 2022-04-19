//components
import Logo from "./Logo/Logo";
import Navbar from "./Navbar/Navbar";
//styles
import "./Home.css";

/**
 * Fixed component contains logo and navbar
 * @param {address[]} auctionAddressList-list of existing auction addresses fetched from blockchain network
 */
function Home({ auctionAddressList }) {
  return (
    <div>
      <Logo auctionAddressList={auctionAddressList} />
      <Navbar />
    </div>
  );
}

export default Home;
