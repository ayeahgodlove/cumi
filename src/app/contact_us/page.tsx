import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";

export default function IndexPage() {
  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>
      {/* banner */}
      <BannerComponent
        breadcrumbs={[{ label: "Contact us", uri: "contact_us" }]}
        pageTitle="Contact Us"
      />

      <section className="py-3">
        <div className="container">
          <div className="row">
            <div className="mx-auto col-md-10 col-lg-6">
              <form method="POST">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Working Mail <span className="text-danger">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="john.doe@email.com"
                    type="email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Anything else? <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    placeholder="Message goes here..."
                    rows={8}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-lg rounded px-5 btn-dark"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
