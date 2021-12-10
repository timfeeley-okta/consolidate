import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="h-full antialiased bg-gray-100">
        <Head />
        <body className="h-full font-inter">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
