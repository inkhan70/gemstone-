import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="The Gilded Sanctuary - Premier International Auction House for Certified Gemstones" />
        <meta name="keywords" content="gemstones, auction, rare minerals, certified, luxury, diamonds, rubies, sapphires" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="The Gilded Sanctuary" />
        <meta property="og:description" content="Rare Minerals. Absolute Trust." />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
