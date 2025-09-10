"use client";
import React, { useState } from "react";
import { Button, ConfigProvider, Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import styles from "./footer.module.css";
import Link from "next/link";
import Image from "next/image";
import { THEME } from "@constants/constant";
import { useTranslation } from "@contexts/translation.context";

type Props = {
  logoPath: string;
};
export const AppFooter: React.FC<Props> = ({ logoPath  }) => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

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
            <p className={styles.subheading}>{t('footer.tagline')}</p>
          </div>
          <div className={styles.content_group}>
            <h4>{t('footer.discover')}</h4>
            <Link href="/our_services">{t('nav.services')}</Link>
            <Link href="/about_us">{t('nav.about_us')}</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/authors">Authors</Link>
          </div>
          <div className={styles.content_group}>
            <h4>{t('footer.info')}</h4>
            <Link href="/blog_posts">{t('nav.blog_posts')}</Link>
            <Link href="/contact_us">{t('nav.contact_us')}</Link>
            <Link href="/faqs">FAQs</Link>
            <Link href="/events">Events</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/opportunities">Opportunities</Link>
          </div>
          <div className={styles.content_group}>
            <h4>Account</h4>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
          <div className={styles.content_group_waitlist}>
            <h4>{t('footer.join_mailing')}</h4>
            <p className={styles.subheading}>
              {t('footer.mailing_description')}
            </p>
            <form>
              <ConfigProvider theme={THEME}>
                <Input
                  placeholder={t('footer.email_placeholder')}
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
