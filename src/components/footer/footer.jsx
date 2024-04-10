import React, { useState } from "react";
import { Button, ConfigProvider, Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import styles from "./footer.module.css";
import Link from "next/link";
import { THEME } from "@constants/constant";

export const AppFooter = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.content_group_logo}>
            <img
              src="./cumi-green.jpeg"
              className={styles.logo}
              height={70}
              width={120}
              alt="Cumi logo"
            />
            <p className={styles.subheading}>Empowering Your Digital Journey</p>
          </div>
          <div className={styles.content_group}>
            <h4>Discover</h4>
            <Link href="/our_services">Services</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/about_us">About</Link>
          </div>
          <div className={styles.content_group}>
            <h4>Info</h4>
            <Link href="/blog_posts">Blog Posts</Link>
            <Link href="/contact_us">Contact us</Link>
            <Link href="/faqs">FAQs</Link>
          </div>
          <div className={styles.content_group_waitlist}>
            <h4>Join Our Mailing List</h4>
            <p className={styles.subheading}>
              Get notified and updated with our marketing emails.
            </p>
            <form>
              <ConfigProvider
              theme={THEME}
              >
                <Input
                  placeholder="Your Email"
                  size="large"
                  addonAfter={
                    <Button type="link" icon={<ArrowRightOutlined style={{ color: "#81ce89"}} />} />
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </ConfigProvider>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};
