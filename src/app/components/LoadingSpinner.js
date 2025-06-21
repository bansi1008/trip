"use client";

import { FaRoute, FaSpinner } from "react-icons/fa";
import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className={styles.container}>
      <div className={styles.spinnerCard}>
        <div className={styles.iconContainer}>
          <FaRoute className={styles.routeIcon} />
          <FaSpinner className={styles.spinner} />
        </div>

        <h2 className={styles.title}>Loading Your Trip</h2>
        <p className={styles.subtitle}>
          Preparing your amazing journey details...
        </p>

        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
      </div>
    </div>
  );
}
