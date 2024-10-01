"use client";
import styles from "../_styles/Nav.module.scss";
// import Button from "./Button/Button";
import { usePathname } from "next/navigation";
// import { withRouter } from "next/router";

export default function Nav() {
  const page = usePathname();
  return (
    <nav className={styles.mainnav} role="navigation" aria-label="Main">
      {/* <ul className={styles.mainul}>
        {page === "/" ? (
          <>
            <li className={styles.link}>
              <NavLink location={"/about"} text={"About"} />
            </li>
            {this.props.spotifyUser ? (
              <li className={styles.link}>
                <Button
                  variant="outlined"
                  style={{ borderColor: "white" }}
                  onClick={() => this.props.spotifyUser.destroySesh()}
                >
                  Logout
                </Button>
              </li>
            ) : (
              <li className={styles.link}>
                <Link href="/api/login" styles={{ paddingLeft: "10px" }}>
                  <Button variant="outlined" style={{ borderColor: "white" }}>
                    Login to Spotify
                  </Button>
                </Link>
              </li>
            )}
          </>
        ) : (
          <li className={styles.link}>
            <NavLink location={"/"} text={"Back to Home"} />
          </li>
        )}
      </ul> */}
    </nav>
  );
}

// export default withRouter(Nav);
