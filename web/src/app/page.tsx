import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>AcáNomás</h1>
        <p>Directorio de negocios locales.</p>
      </main>
    </div>
  );
}
