import React from "react";
import styles from "./feature.module.css";
import { Button } from "antd";
import Image from "next/image";

const FeatureSection = () => {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={`titleHolder ${styles.headerCp}`}>
          <h1 className={styles.heading}>What we offer</h1>
          <p>
            {`Whether you're an individual entrepreneur or a multinational
            corporation, Cumi has got you covered.`}
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.content_group}>
            <Image
              height={500}
              width={1200}
              quality={100}
              src="/img/daniel-korpai-pKRNxEguRgM-unsplash.jpg"
              alt="screenshot of audio player"
              className={styles.content_group_image_1}
            />
            <div className={styles.content_group_1_text}>
              <h1 className={styles.content_group_heading}>
                Custom Digital Solutions
              </h1>
              <p className={styles.content_group_subheading}>
                {` Cumi offers custom digital solutions for individuals and
                corporations, tailored to your unique needs. We collaborate
                closely with clients from concept to execution, delivering
                innovative solutions that yield tangible results.`}
              </p>
              <Button
                className="primary-btn"
                shape="round"
                style={{ background: "darkslategray" }}
                href="/contact-us"
                size="large"
              >
                Hire our expertise
              </Button>
            </div>
          </div>
          <div className={styles.content_group}>
            <div className={styles.content_group_2_text}>
              <h1 className={styles.content_group_heading}>
                Software Development Training
              </h1>
              <p className={styles.content_group_subheading}>
                {` Cumi equips tech enthusiasts with expertise in JavaScript,
                Python, PHP, React, Laravel, Django, and React-Native. Our
                hands-on training empowers aspiring developers for success in
                the competitive tech industry.`}
              </p>
              <Button
                className="primary-btn"
                shape="round"
                style={{ background: "darkslategray" }}
                href="/contact-us"
                size="large"
              >
                Hire our expertise
              </Button>
            </div>
            <Image
              height={500}
              width={1200}
              quality={100}
              src="/img/linkedin-sales-solutions-EI50ZDA-l8Y-unsplash.jpg"
              alt="screenshot of app homepage"
              className={styles.content_group_image_2}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
