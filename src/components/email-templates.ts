export const emailTemplate = (firstName: string): string => `
  <div>
    <h1>
      Hi ${firstName}✋! This is the Scraped data from your last upload. Enjoy your data🎉!
    </h1>
  </div>
`;

export const errorEmailTemplate = (firstName: string): string => `
  <div>
    <h1>
      Hi ${firstName}, there was an issue with your last scraping request. Please check and try again.
    </h1>
  </div>
`;
