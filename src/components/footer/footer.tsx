"use client";
import React, { useState } from "react";
import { Button, ConfigProvider, Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import styles from "./footer.module.css";
import Link from "next/link";
import Image from "next/image";
import { THEME } from "@constants/constant";

type Props = {
  logoPath: string;
};
export const AppFooter: React.FC<Props> = ({ logoPath  }) => {
  const [email, setEmail] = useState("");

  return (
    <footer className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.content_group_logo}>
            <Image
              src={`${logoPath || '/'}cumi-green.jpg`}
              className={styles.logo}
              height={90}
              width={160}
              quality={100}
              priority
              alt="CumiTech Logo"
              style={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease'
              }}
            />
            <p className={styles.subheading}>Empowering Your Digital Journey</p>
          </div>
          <div className={styles.content_group}>
            <h4>Discover</h4>
            <Link href="/our_services">Services</Link>
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
              <ConfigProvider theme={THEME}>
                <Input
                  placeholder="Your Email"
                  size="large"
                  addonAfter={
                    <Button
                      type="link"
                      icon={<ArrowRightOutlined style={{ color: "#81ce89" }} />}
                    />
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
