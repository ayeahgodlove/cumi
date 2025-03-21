import React, { useState, useRef } from "react";
import { Button, Input } from "antd";
import styles from "./subscribe.module.css";
import Image from "next/image";

export const Subscribe = () => {
  const [email, setEmail] = useState("");
  const ref = useRef(null);

  return (
    <section id="subscribe" ref={ref} className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.heading}>Subscribe.</h1>
          <p className={styles.subheading}>
            Sign up for our marketing notifications.
          </p>
          <form className={styles.form}>
            <Input
              placeholder="Your email address"
              size="large"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              style={{
                borderRadius: 30,
              }}
            />
            <Button
              //   type="primary"
              size="large"
              className={styles.button}
              shape="round"
              style={{ backgroundColor: "#32CD32", color: "#fff" }}
            >
              Subscribe
            </Button>
          </form>
          <Image
            height={250}
            width={100}
            src="/img/pattern/pattern-4.svg"
            alt="pattern image"
            className={styles.pattern}
          />
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
