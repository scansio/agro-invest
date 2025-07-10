
import { SITE_TITLE } from "../scripts/config/contants";
import Reblend, { useContext } from "reblendjs";
import { Helpers } from "../assets/vendor/js/helpers";
import SharedConfig from "../scripts/SharedConfig";
import { ThemeContext } from "../components/context/theme";

class Footer extends Reblend {
  static ELEMENT_NAME = "Footer";
  styles;
  _constructor(props) {
    super._constructor(props);
    const [styles] = useContext.bind(this)(ThemeContext, "style");
    this.styles = styles;
  }

  html() {
    return (
      <div>
        <footer className="footer mt-2" style={this.styles}>
          {this.props.children}
          <div className="d-flex flex-md-row flex-column justify-content-between align-items-md-center">
            <div style={{ padding: "20px 10px", width: "100%" }}>
              <div style={{ float: "left" }}>
                <a
                  href="/"
                  target="_blank"
                  className="footer-text fw-bolder"
                  rel="noreferrer"
                >
                  &copy;{" "}
                  {SharedConfig.getSessionData("SITE_TITLE") || SITE_TITLE}
                </a>
              </div>
              <div style={{ float: "right" }}>
                <button className="btn btn-sm btn-outline-danger"></button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
export default Footer;
