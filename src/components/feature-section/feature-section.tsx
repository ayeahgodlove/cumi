"use client";
import React from "react";
import styles from "./feature.module.css";
import { Button, Spin, Card } from "antd";
import Image from "next/image";
import ServiceList from "@components/service/service-list.component";
import { serviceAPI } from "@store/api/service_api";
import { useTranslation } from "@contexts/translation.context";

const FeatureSection = () => {
  const { t } = useTranslation();
  const {
    data: services,
    isLoading: isLoadingService,
    isFetching: isFetchService,
  } = serviceAPI.useFetchAllServicesQuery(1);

  const loading = isLoadingService || isFetchService;

  if (loading) {
    return (
      <section className={`section ${styles.section}`} style={{ minHeight: "400px", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
        <Card style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>{t('common.loading')}</div>
        </Card>
      </section>
    );
  }
  
  return (
    <>
      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={`titleHolder ${styles.headerCp}`}>
            <h1 className={styles.heading}>{t('features.title')}</h1>
            <p>
              {t('features.subtitle')}
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
                  {t('features.custom_solutions.title')}
                </h1>
                <p className={styles.content_group_subheading}>
                  {t('features.custom_solutions.description')}
                </p>
                <Button
                  className="primary-btn"
                  shape="round"
                  style={{ background: "darkslategray" }}
                  href="https://wa.me/237681289411"
                  target="_blank"
                  size="large"
                >
                  {t('features.hire_expertise')}
                </Button>
              </div>
            </div>

            <div className={styles.content_group}>
              <div className={styles.content_group_2_text}>
                <h1 className={styles.content_group_heading}>
                  {t('features.training.title')}
                </h1>
                <p className={styles.content_group_subheading}>
                  {t('features.training.description')}
                </p>
                <Button
                  className="primary-btn"
                  shape="round"
                  style={{ background: "darkslategray" }}
                  href="https://wa.me/237681289411"
                  target="_blank"
                  size="large"
                >
                  {t('features.hire_expertise')}
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
    </>
  );
};

export default FeatureSection;
