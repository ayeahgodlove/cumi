import React from 'react'
import { GrUserExpert } from "react-icons/gr";
import { MdLightbulbOutline } from "react-icons/md";
import { IoMedalOutline, IoPeopleOutline } from "react-icons/io5";
import { Card } from 'antd';
import "./about-note.scss";

const AboutNote = () => {
  return (
    <>
     <div id="about" className="block padding-top mt-sm-0 pb-5">
        <div className="titleHolder">
          <h1>Why Choose Cumi?</h1>
          <p>
            {`Together let's collaborate to turn your vision into reality and
            shape the future of technology together.`}
          </p>
        </div>
        {/* next */}
        <div
          className="mx-auto  row"
          style={{ width: "85%", minHeight: "15rem" }}
        >
          <div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center"
            >
              <p className="fw-bold text-center">Expertise</p>
              <GrUserExpert
                className="mx-auto d-block"
                style={{
                  width: "3rem",
                  height: "3rem",
                  color: "darkslategray",
                }}
              />
              <small className="d-block text-center">
                Our team comprises professionals with extensive experience in
                software development and technology consulting. We leverage our
                expertise to deliver.
              </small>
            </Card>
          </div>

          <div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center"
            >
              <p className="fw-bold text-center">Innovation</p>
              <MdLightbulbOutline
                className="mx-auto d-block"
                style={{ width: "3rem", height: "3rem", color: "#FFDF00" }}
              />

              <small className="d-block text-center">
                {`We're constantly exploring new technologies and methodologies to
                stay ahead of the curve and deliver cutting-edge solutions that
                drive business growth.`}
              </small>
            </Card>
          </div>

          <div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center"
            >
              <p className="fw-bold text-center">Collaboration</p>
              <IoPeopleOutline
                className="mx-auto d-block"
                style={{ width: "3rem", height: "3rem", color: "#00BFFF" }}
              />
              <small className="d-block text-center">
                {`We work closely with our clients, fostering open communication
                and collaboration every step of the way to ensure that we're
                aligned with their goals and objectives.`}
              </small>
            </Card>
          </div>

          <div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center"
            >
              <p className="fw-bold text-center">Commitment to Excellence</p>
              <IoMedalOutline
                className="mx-auto d-block"
                style={{ width: "3rem", height: "3rem", color: "#32CD32" }}
              />
              <small className="d-block text-center">
               {` From the quality of our work to the level of service we provide,
                we strive for nothing less than perfection to ensure the success
                of our clients.`}
              </small>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutNote