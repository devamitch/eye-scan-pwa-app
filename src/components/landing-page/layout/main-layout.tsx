import Footer from "@/components/layout/Footer/Footer";
import Header from "../header/header";
import styles from "./main-layout.module.css";

export default function MainLayout ({ children }: { children: React.ReactNode }) {
  return (
	<div className={styles.container}>
			<Header />
            {children}
            <Footer />
    </div>
  );
}