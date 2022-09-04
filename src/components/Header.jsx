import mestoLogo from "../images/logo.svg";

function Header() {
  return (
    <header className="header">
      <img src={mestoLogo} alt="логотип" className="logo" />
    </header>
  );
}
export default Header;
