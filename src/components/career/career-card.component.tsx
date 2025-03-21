"use client";

import { IOpportunity } from "@domain/models/opportunity.model";
import Image from "next/image";
import Link from "next/link";
import "./career-card.style.scss";
import { BASE_URL } from "@constants/api-url";

interface Props {
  data: IOpportunity[];
}
const CareerCard: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.map((listing) => (
        <div className={"col-sm-6 col-lg-6"} key={listing.id}>
          <div className={"listing-style1"}>
            <div className="list-thumb">
              <img
                width={382}
                height={248}
                style={{ height: "230px" }}
                className="w-100  cover"
                src={`${BASE_URL}/img/christopher-gower-m_HRfLhgABo-unsplash.jpg`}
                alt="listings"
              />
              <div className="sale-sticker-wrap">
                {!listing.opp_type && (
                  <div className="list-tag fz12">
                    <span className="flaticon-electricity me-2" />
                    FEATURED
                  </div>
                )}
              </div>

            </div>
            <div className="list-content">
              <h6 className="list-title">
                <Link href={`/single-v1/${listing.id}`}>{listing.title}</Link>
              </h6>
              <p className="list-text">{listing.location}</p>
             
              <hr className="mt-2 mb-2" />
              <div className="list-meta2 d-flex justify-content-between align-items-center">
                <span className="for-what">For Rent</span>
                <div className="icons d-flex align-items-center">
                  <a href="#">
                    <span className="flaticon-fullscreen" />
                  </a>
                  <a href="#">
                    <span className="flaticon-new-tab" />
                  </a>
                  <a href="#">
                    <span className="flaticon-like" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CareerCard;
