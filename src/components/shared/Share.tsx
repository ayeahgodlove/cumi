import { API_URL } from "@constants/api-url";
import {
  IoLogoFacebook,
  IoLogoLinkedin,
  IoLogoPinterest,
  IoLogoTwitter,
} from "react-icons/io5";

const Share = ({
  title,
  description,
  slug,
  className,
}: {
  title: string;
  description?: string;
  slug: string;
  className?: string;
}) => {
  return (
    <ul className={className}>
      <li className="inline-block">
        <a
          aria-label="facebook share button"
          href={`https://facebook.com/sharer/sharer.php?u=${API_URL}/${slug}`}
          target="_blank"
          rel="noreferrer noopener"
          className="me-2"
        >
          <IoLogoFacebook size={25} />
        </a>
      </li>
      <li className="inline-block">
        <a
          aria-label="twitter share button"
          href={`https://twitter.com/intent/tweet/?text=${title}&amp;url=${API_URL}/${slug}`}
          target="_blank"
          rel="noreferrer noopener"
          className="me-2"
        >
          <IoLogoTwitter size={25} />
        </a>
      </li>
      <li className="inline-block">
        <a
          aria-label="linkedin share button"
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${API_URL}/${slug}&title=${title}&summary=${description}&source=${API_URL}`}
          target="_blank"
          rel="noreferrer noopener"
          className="me-2"
        >
          <IoLogoLinkedin size={25} />
        </a>
      </li>
      <li className="inline-block">
        <a
          aria-label="pinterest share button"
          href={`https://pinterest.com/pin/create/button/?url=${API_URL}/${slug}&media=&description=${description}`}
          target="_blank"
          rel="noreferrer noopener"
          className="me-2"
        >
          <IoLogoPinterest size={25} />
        </a>
      </li>
    </ul>
  );
};

export default Share;
