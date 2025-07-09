import styles from "./GhostCard.module.scss";

export default function GhostCard({ hover }) {
  const style =
    hover === true
      ? `${styles["empty-card"]} ${styles["hover"]}`
      : `${styles["empty-card"]}`;
  return <div className={style}></div>;
}
