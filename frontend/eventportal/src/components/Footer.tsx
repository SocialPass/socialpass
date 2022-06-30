import logoImage from "../static/images/socialpass.svg";


export default function Footer() {
  return (
      <footer className="sp-footer me-15 ms-15">
        <small className="d-flex flex-row align-items-center">
          Powered by &nbsp;
          <img src={logoImage} alt="image" />
        </small>
      </footer>
  );
}
